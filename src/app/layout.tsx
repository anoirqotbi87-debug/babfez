import type { Metadata, Viewport } from "next";
import { DM_Sans, Cairo, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const libreBaskerville = Libre_Baskerville({ 
  subsets: ["latin"], 
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair", 
  display: "swap" 
});
const cairo = Cairo({ 
  subsets: ["arabic", "latin"], 
  weight: ['400', '600', '700', '800'],
  variable: "--font-cairo",
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#F2F2F2",
};

export const metadata: Metadata = {
  title: "BABFEZ - Conciergerie & Intendance Privée à Fès",
  description: "Déléguez à 100% la gestion locative de votre appartement ou Riad à Fès.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${dmSans.variable} ${cairo.variable} ${libreBaskerville.variable} font-sans antialiased bg-[#F2F2F2] text-[#646767]`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    reg.update();
                  }).catch(function() {});
                });
                var refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', function() {
                  if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                  }
                });
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
