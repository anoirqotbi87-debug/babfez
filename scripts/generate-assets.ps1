$source = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class BabFezIconGenerator {
    public static Bitmap GenerateIcon(int size, bool isRound, bool isMaskable) {
        Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp)) {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.Transparent);

            Color blueBg = Color.FromArgb(255, 11, 37, 69);     // #0B2545
            Color gold = Color.FromArgb(255, 197, 155, 39);      // #C59B27
            Color goldLight = Color.FromArgb(255, 235, 195, 80); // #EBC350

            if (isRound) {
                using (GraphicsPath path = new GraphicsPath()) {
                    path.AddEllipse(0, 0, size, size);
                    g.SetClip(path);
                    using (Brush b = new SolidBrush(blueBg)) {
                        g.FillEllipse(b, 0, 0, size, size);
                    }
                }
            } else {
                using (Brush b = new SolidBrush(blueBg)) {
                    g.FillRectangle(b, 0, 0, size, size);
                }
            }

            float margin = isMaskable ? 0.22f : 0.12f;
            float content = size * (1.0f - 2.0f * margin);
            float cx = size / 2.0f;
            float cy = size / 2.0f;

            // Border
            float borderWidth = Math.Max(1.5f, size * 0.02f);
            using (Pen borderPen = new Pen(gold, borderWidth)) {
                if (isRound) {
                    float inset = size * 0.04f;
                    g.DrawEllipse(borderPen, inset, inset, size - 2 * inset, size - 2 * inset);
                } else {
                    float inset = size * 0.05f;
                    float r = size * 0.12f;
                    using (GraphicsPath p = new GraphicsPath()) {
                        float d = r * 2;
                        p.AddArc(inset, inset, d, d, 180, 90);
                        p.AddArc(size - inset - d, inset, d, d, 270, 90);
                        p.AddArc(size - inset - d, size - inset - d, d, d, 0, 90);
                        p.AddArc(inset, size - inset - d, d, d, 90, 90);
                        p.CloseFigure();
                        g.DrawPath(borderPen, p);
                    }
                }
            }

            // Moorish Horseshoe Arch
            float archW = content * 0.68f;
            float archH = content * 0.82f;
            float archLeft = cx - archW / 2.0f;
            float archRight = cx + archW / 2.0f;
            float archBottom = cy + archH * 0.45f;
            float springY = cy + archH * 0.05f;
            float peakY = cy - archH * 0.45f;

            float archStroke = Math.Max(2.0f, size * 0.045f);
            using (Pen archPen = new Pen(gold, archStroke)) {
                archPen.StartCap = LineCap.Round;
                archPen.EndCap = LineCap.Round;
                archPen.LineJoin = LineJoin.Round;

                using (GraphicsPath arch = new GraphicsPath()) {
                    // Left pillar
                    arch.AddLine(archLeft, archBottom, archLeft, springY);

                    // Left curve up to peak
                    arch.AddBezier(
                        new PointF(archLeft, springY),
                        new PointF(archLeft - archW * 0.12f, cy - archH * 0.15f),
                        new PointF(cx - archW * 0.15f, peakY + archH * 0.05f),
                        new PointF(cx, peakY)
                    );

                    // Right curve down from peak
                    arch.AddBezier(
                        new PointF(cx, peakY),
                        new PointF(cx + archW * 0.15f, peakY + archH * 0.05f),
                        new PointF(archRight + archW * 0.12f, cy - archH * 0.15f),
                        new PointF(archRight, springY)
                    );

                    // Right pillar
                    arch.AddLine(archRight, springY, archRight, archBottom);

                    g.DrawPath(archPen, arch);
                }
            }

            // Steps at the base of the Arch
            float stepStroke = Math.Max(1.5f, size * 0.022f);
            using (Pen stepPen = new Pen(gold, stepStroke)) {
                stepPen.StartCap = LineCap.Round;
                stepPen.EndCap = LineCap.Round;
                float stepExt = archW * 0.12f;
                g.DrawLine(stepPen, archLeft - stepExt, archBottom, archRight + stepExt, archBottom);
                g.DrawLine(stepPen, archLeft - stepExt * 0.4f, archBottom + size * 0.025f, archRight + stepExt * 0.4f, archBottom + size * 0.025f);
            }

            // Key inside the Arch
            float ringR = content * 0.11f;
            float ringCy = cy - content * 0.10f;
            float keyStroke = Math.Max(1.5f, size * 0.035f);

            using (Pen keyPen = new Pen(goldLight, keyStroke)) {
                keyPen.StartCap = LineCap.Round;
                keyPen.EndCap = LineCap.Round;
                keyPen.LineJoin = LineJoin.Round;

                // Ring (Head of key)
                g.DrawEllipse(keyPen, cx - ringR, ringCy - ringR, ringR * 2, ringR * 2);

                // Inner rosette inside key ring
                using (Brush b = new SolidBrush(goldLight)) {
                    float innerR = ringR * 0.38f;
                    g.FillEllipse(b, cx - innerR, ringCy - innerR, innerR * 2, innerR * 2);
                }

                // Key Stem
                float stemTop = ringCy + ringR;
                float stemBottom = archBottom - size * 0.05f;
                g.DrawLine(keyPen, cx, stemTop, cx, stemBottom);

                // Collar
                float collarY = stemTop + content * 0.08f;
                float collarW = content * 0.09f;
                g.DrawLine(keyPen, cx - collarW / 2.0f, collarY, cx + collarW / 2.0f, collarY);

                // Bit (teeth)
                float bitW = content * 0.12f;
                float bitH = content * 0.14f;
                float bitY = stemBottom - bitH;
                g.DrawLine(keyPen, cx, bitY, cx + bitW, bitY);
                g.DrawLine(keyPen, cx + bitW, bitY, cx + bitW, bitY + bitH);
                g.DrawLine(keyPen, cx, bitY + bitH * 0.5f, cx + bitW * 0.7f, bitY + bitH * 0.5f);
            }
        }
        return bmp;
    }

    public static void SaveIcon(string path, int size, bool isRound, bool isMaskable) {
        using (Bitmap bmp = GenerateIcon(size, isRound, isMaskable)) {
            bmp.Save(path, ImageFormat.Png);
        }
    }

    public static void SaveIco(string path) {
        int[] sizes = new int[] { 16, 32, 48 };
        using (MemoryStream ms = new MemoryStream())
        using (BinaryWriter bw = new BinaryWriter(ms)) {
            bw.Write((ushort)0);
            bw.Write((ushort)1);
            bw.Write((ushort)sizes.Length);

            byte[][] pngBytes = new byte[sizes.Length][];
            for (int i = 0; i < sizes.Length; i++) {
                using (Bitmap bmp = GenerateIcon(sizes[i], false, false))
                using (MemoryStream pms = new MemoryStream()) {
                    bmp.Save(pms, ImageFormat.Png);
                    pngBytes[i] = pms.ToArray();
                }
            }

            int offset = 6 + (16 * sizes.Length);
            for (int i = 0; i < sizes.Length; i++) {
                int s = sizes[i];
                bw.Write((byte)s);
                bw.Write((byte)s);
                bw.Write((byte)0);
                bw.Write((byte)0);
                bw.Write((ushort)1);
                bw.Write((ushort)32);
                bw.Write((uint)pngBytes[i].Length);
                bw.Write((uint)offset);
                offset += pngBytes[i].Length;
            }

            for (int i = 0; i < sizes.Length; i++) {
                bw.Write(pngBytes[i]);
            }

            File.WriteAllBytes(path, ms.ToArray());
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

Write-Output "=== 1. Generating Web Icons in public/ and public/icons/ ==="
$publicIconsDir = "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons"
if (-not (Test-Path $publicIconsDir)) { New-Item -ItemType Directory -Path $publicIconsDir -Force | Out-Null }

[BabFezIconGenerator]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icon-192.png", 192, $false, $false)
[BabFezIconGenerator]::SaveIcon("$publicIconsDir\icon-192x192.png", 192, $false, $false)

[BabFezIconGenerator]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icon-512.png", 512, $false, $false)
[BabFezIconGenerator]::SaveIcon("$publicIconsDir\icon-512x512.png", 512, $false, $false)
[BabFezIconGenerator]::SaveIcon("$publicIconsDir\icon.png", 512, $false, $false)
[BabFezIconGenerator]::SaveIcon("$publicIconsDir\logo.png", 512, $false, $false)

[BabFezIconGenerator]::SaveIcon("$publicIconsDir\icon-maskable.png", 512, $false, $true)

[BabFezIconGenerator]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\apple-touch-icon.png", 180, $false, $false)

[BabFezIconGenerator]::SaveIco("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\favicon.ico")
Copy-Item "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\favicon.ico" -Destination "c:\Users\Qotbi\Documents\GitHub\BABFEZ\src\app\favicon.ico" -Force

Write-Output "=== 2. Generating Android Mipmap Icons ==="
$androidResDir = "c:\Users\Qotbi\Documents\GitHub\BABFEZ\android_app\src\main\res"

$densityMap = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($entry in $densityMap.GetEnumerator()) {
    $dirName = $entry.Key
    $px = $entry.Value
    $targetDir = "$androidResDir\$dirName"
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }

    [BabFezIconGenerator]::SaveIcon("$targetDir\ic_launcher.png", $px, $false, $false)
    [BabFezIconGenerator]::SaveIcon("$targetDir\ic_launcher_round.png", $px, $true, $false)
    [BabFezIconGenerator]::SaveIcon("$targetDir\ic_maskable.png", $px, $false, $true)

    Write-Output "Generated icons for $dirName ($px x $px)"
}

Write-Output "=== 3. Generating Splash screens for Android ==="
$splashDensities = @{
    "drawable-mdpi" = 200
    "drawable-hdpi" = 300
    "drawable-xhdpi" = 400
    "drawable-xxhdpi" = 600
    "drawable-xxxhdpi" = 800
}

foreach ($entry in $splashDensities.GetEnumerator()) {
    $dirName = $entry.Key
    $px = $entry.Value
    $targetDir = "$androidResDir\$dirName"
    if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }

    [BabFezIconGenerator]::SaveIcon("$targetDir\splash.png", $px, $false, $false)
    Write-Output "Generated splash for $dirName ($px x $px)"
}

Write-Output "SUCCESS: All web & Android icons generated flawlessly!"
