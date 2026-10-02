import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const cairo = Cairo({ 
  subsets: ["arabic", "latin"], 
  weight: ['400', '600', '700', '800'],
  variable: "--font-cairo",
  display: "swap"
});

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
      <body className={`${jakarta.variable} ${cairo.variable} ${playfair.variable} font-sans antialiased bg-[#FBF9F5] text-[#1C1917]`}>
        {children}
      </body>
    </html>
  );
}
