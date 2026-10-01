import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BABFEZ - Conciergerie & Intendance Privée à Fès",
  description: "Déléguez à 100% la gestion locative de votre appartement ou Riad à Fès. Accueil, ménage hôtelier, fiches de police, tarification dynamique.",
};

export default function LangLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const isRtl = params.lang === 'ar';
  
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-cairo' : 'font-jakarta'}>
      {children}
    </div>
  );
}
