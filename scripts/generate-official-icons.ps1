$csharp = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class OfficialIconBuilder {
    private static Image sourceLogo;

    public static void Init(string logoPath) {
        sourceLogo = Image.FromFile(logoPath);
    }

    public static Bitmap RenderIcon(int size, bool isRound, bool isMaskable, Color bgColor) {
        Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp)) {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.Transparent);

            if (isRound) {
                using (GraphicsPath p = new GraphicsPath()) {
                    p.AddEllipse(0, 0, size, size);
                    g.SetClip(p);
                    using (Brush b = new SolidBrush(bgColor)) {
                        g.FillEllipse(b, 0, 0, size, size);
                    }
                }
            } else if (bgColor != Color.Transparent) {
                using (Brush b = new SolidBrush(bgColor)) {
                    g.FillRectangle(b, 0, 0, size, size);
                }
            }

            // Calculate fit with padding
            float paddingRatio = isMaskable ? 0.22f : 0.12f;
            float pad = size * paddingRatio;
            float availW = size - (2.0f * pad);
            float availH = size - (2.0f * pad);

            float ratio = Math.Min(availW / (float)sourceLogo.Width, availH / (float)sourceLogo.Height);
            float drawW = sourceLogo.Width * ratio;
            float drawH = sourceLogo.Height * ratio;
            float drawX = (size - drawW) / 2.0f;
            float drawY = (size - drawH) / 2.0f;

            g.DrawImage(sourceLogo, drawX, drawY, drawW, drawH);
        }
        return bmp;
    }

    public static void SaveIcon(string path, int size, bool isRound, bool isMaskable, Color bgColor) {
        string dir = Path.GetDirectoryName(path);
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
        using (Bitmap b = RenderIcon(size, isRound, isMaskable, bgColor)) {
            b.Save(path, ImageFormat.Png);
        }
    }

    public static void SaveIco(string path, Color bgColor) {
        int[] sizes = new int[] { 16, 32, 48 };
        using (MemoryStream ms = new MemoryStream())
        using (BinaryWriter bw = new BinaryWriter(ms)) {
            bw.Write((ushort)0);
            bw.Write((ushort)1);
            bw.Write((ushort)sizes.Length);

            byte[][] pngBytes = new byte[sizes.Length][];
            for (int i = 0; i < sizes.Length; i++) {
                using (Bitmap b = RenderIcon(sizes[i], false, false, bgColor))
                using (MemoryStream pms = new MemoryStream()) {
                    b.Save(pms, ImageFormat.Png);
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

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing

$logoPath = "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\logo.png"
[OfficialIconBuilder]::Init($logoPath)

$blueColor = [System.Drawing.Color]::FromArgb(255, 11, 37, 69) # #0B2545
$transp = [System.Drawing.Color]::Transparent

Write-Output "=== 1. Generating SVG with exact official babfez.com logo ==="
$bytes = [System.IO.File]::ReadAllBytes($logoPath)
$base64 = [Convert]::ToBase64String($bytes)
$svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152 182" width="100%" height="100%">
  <image href="data:image/png;base64,$base64" width="152" height="182"/>
</svg>
"@

[System.IO.File]::WriteAllText("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\logo.svg", $svgContent)
[System.IO.File]::WriteAllText("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\logo.svg", $svgContent)

Write-Output "=== 2. Generating Web Icons in public/ and public/icons/ ==="
[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icon-192.png", 192, $false, $false, $blueColor)
[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-192x192.png", 192, $false, $false, $blueColor)

[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icon-512.png", 512, $false, $false, $blueColor)
[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-512x512.png", 512, $false, $false, $blueColor)
[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon.png", 512, $false, $false, $blueColor)

# Maskable icon with safe zone
[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\icons\icon-maskable.png", 512, $false, $true, $blueColor)

[OfficialIconBuilder]::SaveIcon("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\apple-touch-icon.png", 180, $false, $false, $blueColor)

[OfficialIconBuilder]::SaveIco("c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\favicon.ico", $blueColor)
Copy-Item "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\favicon.ico" -Destination "c:\Users\Qotbi\Documents\GitHub\BABFEZ\src\app\favicon.ico" -Force
Copy-Item $logoPath -Destination "c:\Users\Qotbi\Documents\GitHub\BABFEZ\public\logo.png" -Force

Write-Output "=== 3. Generating Android Mipmaps in android_app/ ==="
$androidRes = "c:\Users\Qotbi\Documents\GitHub\BABFEZ\android_app\src\main\res"

$mipmaps = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($e in $mipmaps.GetEnumerator()) {
    $dir = "$androidRes\$($e.Key)"
    $px = $e.Value
    [OfficialIconBuilder]::SaveIcon("$dir\ic_launcher.png", $px, $false, $false, $blueColor)
    [OfficialIconBuilder]::SaveIcon("$dir\ic_launcher_round.png", $px, $true, $false, $blueColor)
    # Maskable foreground (transparent background for adaptive icons)
    [OfficialIconBuilder]::SaveIcon("$dir\ic_maskable.png", $px, $false, $true, $transp)
    Write-Output "Generated Android icons for $($e.Key) ($px x $px)"
}

Write-Output "=== 4. Generating Splash Screens in android_app/ ==="
$splashes = @{
    "drawable-mdpi" = 200
    "drawable-hdpi" = 300
    "drawable-xhdpi" = 400
    "drawable-xxhdpi" = 600
    "drawable-xxxhdpi" = 800
}

foreach ($e in $splashes.GetEnumerator()) {
    $dir = "$androidRes\$($e.Key)"
    $px = $e.Value
    [OfficialIconBuilder]::SaveIcon("$dir\splash.png", $px, $false, $false, $blueColor)
    Write-Output "Generated splash for $($e.Key) ($px x $px)"
}

Write-Output "SUCCESS: All official babfez.com logo assets restored and generated across Web and Android!"
