Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\logo.png"
if (-not (Test-Path $logoPath)) {
    Write-Error "Logo not found"
    exit 1
}

$logo = [System.Drawing.Image]::FromFile($logoPath)
Write-Output "Loaded logo: $($logo.Width)x$($logo.Height)"

function Generate-Icon {
    param(
        [int]$size,
        [string]$outputPath,
        [string]$bgColor = "#F2F2F2"
    )
    
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Fill background
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($bgColor))
    $gfx.FillRectangle($brush, 0, 0, $size, $size)
    
    # Calculate fit with 15% padding
    $padding = [int]($size * 0.12)
    $availW = $size - (2 * $padding)
    $availH = $size - (2 * $padding)
    
    $ratio = [Math]::Min($availW / $logo.Width, $availH / $logo.Height)
    $drawW = [int]($logo.Width * $ratio)
    $drawH = [int]($logo.Height * $ratio)
    $drawX = [int](($size - $drawW) / 2)
    $drawY = [int](($size - $drawH) / 2)
    
    $gfx.DrawImage($logo, $drawX, $drawY, $drawW, $drawH)
    
    # Ensure dir exists
    $dir = Split-Path $outputPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $gfx.Dispose()
    $bmp.Dispose()
    Write-Output "Generated $outputPath ($size x $size)"
}

# 1. Web icons in public/icons/
Generate-Icon 192 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-192x192.png"
Generate-Icon 512 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-512x512.png"
Generate-Icon 512 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-maskable.png"
Generate-Icon 512 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon.png"

# 2. Android mipmaps in app/src/main/res/
Generate-Icon 48 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-mdpi\ic_launcher.png"
Generate-Icon 48 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-mdpi\ic_maskable.png"

Generate-Icon 72 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-hdpi\ic_launcher.png"
Generate-Icon 72 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-hdpi\ic_maskable.png"

Generate-Icon 96 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xhdpi\ic_launcher.png"
Generate-Icon 96 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xhdpi\ic_maskable.png"

Generate-Icon 144 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xxhdpi\ic_launcher.png"
Generate-Icon 144 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xxhdpi\ic_maskable.png"

Generate-Icon 192 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png"
Generate-Icon 192 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\mipmap-xxxhdpi\ic_maskable.png"

# 3. Notification and splash drawables
Generate-Icon 96 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\drawable-xhdpi\ic_notification_icon.png"
Generate-Icon 96 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\drawable-xhdpi\splash.png"
Generate-Icon 144 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\drawable-xxhdpi\splash.png"
Generate-Icon 192 "c:\Users\Qotbi\Documents\GitHub\BABFEZ\app\src\main\res\drawable-xxxhdpi\splash.png"

$logo.Dispose()
Write-Output "ALL_ICONS_GENERATED_SUCCESSFULLY"
