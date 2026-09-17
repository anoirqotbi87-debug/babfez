import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "BABFEZ - Conciergerie & Intendance Privée à Fès",
  description: "Déléguez à 100% la gestion locative de votre appartement ou Riad à Fès. Accueil, ménage hôtelier, fiches de police, tarification dynamique.",
  openGraph: {
    title: "BABFEZ - Conciergerie & Intendance Privée à Fès",
    description: "Déléguez à 100% la gestion locative courte durée de votre bien à Fès.",
    url: "https://babfez.ma",
    siteName: "BABFEZ",
    locale: "fr_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang} className="scroll-smooth">
      <body className={`${jakarta.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
