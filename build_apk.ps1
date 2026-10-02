$ErrorActionPreference = "Stop"
$env:ANDROID_HOME = "C:\Users\Qotbi\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Users\Qotbi\AppData\Local\Programs\ECLIPS~1\jdk-17.0.19.10-hotspot"
$java = "$env:JAVA_HOME\bin\java.exe"
$buildTools = "$env:ANDROID_HOME\build-tools\36.0.0"
$zipalign = "$buildTools\zipalign.exe"
$apksignerJar = "$buildTools\lib\apksigner.jar"

Write-Output "=== 1. Building APK with Gradle ==="
& .\gradlew.bat assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle build failed with code $LASTEXITCODE"
    exit 1
}

$unsignedApk = ".\app\build\outputs\apk\release\app-release-unsigned.apk"
$alignedApk = ".\app-release-unsigned-aligned.apk"
$signedApk = ".\app-release-signed.apk"
$publicApk = ".\public\downloads\babfez.apk"

if (-not (Test-Path $unsignedApk)) {
    Write-Error "Output APK not found at $unsignedApk"
    exit 1
}

Write-Output "=== 2. Aligning APK ==="
if (Test-Path $alignedApk) { Remove-Item $alignedApk -Force }
& $zipalign -v -p 4 $unsignedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "zipalign failed with code $LASTEXITCODE"
    exit 1
}

Write-Output "=== 3. Signing APK ==="
if (Test-Path $signedApk) { Remove-Item $signedApk -Force }
& $java -Xmx1024M -jar $apksignerJar sign --ks .\babfez-release.keystore --ks-key-alias babfez --ks-pass pass:babfez2026 --key-pass pass:babfez2026 --out $signedApk $alignedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "apksigner failed with code $LASTEXITCODE"
    exit 1
}

Write-Output "=== 4. Verifying APK signature ==="
& $java -jar $apksignerJar verify -v $signedApk
if ($LASTEXITCODE -ne 0) {
    Write-Error "Signature verification failed"
    exit 1
}

Write-Output "=== 5. Copying to public/downloads/babfez.apk ==="
$downloadsDir = ".\public\downloads"
if (-not (Test-Path $downloadsDir)) {
    New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null
}
Copy-Item $signedApk -Destination $publicApk -Force

$item = Get-Item $publicApk
Write-Output "SUCCESS: Signed APK ready at $publicApk ($($item.Length) bytes, $($item.LastWriteTime))"
