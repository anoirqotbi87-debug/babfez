import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const cairo = Cairo({ 
  subsets: ["arabic", "latin"], 
  weight: ['400', '600', '700', '800'],
  variable: "--font-cairo",
  display: "swap"
});

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
  const isRtl = params.lang === 'ar';
  
  return (
    <html lang={params.lang} dir={isRtl ? 'rtl' : 'ltr'} className="scroll-smooth">
      <body 
        className={`${isRtl ? cairo.variable : jakarta.variable} ${isRtl ? 'font-cairo' : 'font-jakarta'} antialiased bg-slate-50 text-slate-900`}
        style={{ fontFamily: isRtl ? "var(--font-cairo), 'Segoe UI', Tahoma, Arial, sans-serif" : undefined }}
      >
        {children}
      </body>
    </html>
  );
}
