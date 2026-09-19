const fs = require('fs');

function updateFooter(file) {
  if (!fs.existsSync(file)) return;
  let page = fs.readFileSync(file, 'utf8');

  page = page.replace(
    /\{dict\.footer\?\.slogan \|\| \"Votre partenaire d\\'excellence pour la gestion locative courte durée et la conciergerie privée\.\"}/g,
    "{lang === 'ar' ? \"شريككم المتميز لإدارة الكراء القصير الأمد والكونسيرج الخاص.\" : \"Votre partenaire d\\'excellence pour la gestion locative courte durée et la conciergerie privée.\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.servicesTitle \|\| \"Nos Formules\"}/g,
    "{lang === 'ar' ? \"خدماتنا\" : \"Nos Formules\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.navTitle \|\| \"Liens Utiles\"}/g,
    "{lang === 'ar' ? \"روابط سريعة\" : \"Liens Utiles\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.contactTitle \|\| \"Contact & Permanence\"}/g,
    "{lang === 'ar' ? \"التواصل والمداومة\" : \"Contact & Permanence\"}"
  );

  page = page.replace(
    /Accueil<\/Link>/g,
    "{lang === 'ar' ? \"الرئيسية\" : \"Accueil\"}</Link>"
  );

  page = page.replace(
    /Nos Logements<\/Link>/g,
    "{lang === 'ar' ? \"عقاراتنا\" : \"Nos Logements\"}</Link>"
  );

  page = page.replace(
    /Espace Propriétaire<\/Link>/g,
    "{lang === 'ar' ? \"فضاء المالك\" : \"Espace Propriétaire\"}</Link>"
  );

  page = page.replace(
    /\{dict\.footer\?\.support247 \|\| \"7j\/7 — 24h\/24 pour les urgences\"}/g,
    "{lang === 'ar' ? \"7 أيام / 7 — 24 ساعة للطوارئ\" : \"7j/7 — 24h/24 pour les urgences\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.legal \|\| \"Mentions Légales\"}/g,
    "{lang === 'ar' ? \"الشروط القانونية\" : \"Mentions légales\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.privacy \|\| \"Confidentialité\"}/g,
    "{lang === 'ar' ? \"سياسة الخصوصية\" : \"Politique de confidentialité\"}"
  );

  page = page.replace(
    /\{dict\.footer\?\.terms \|\| \"CGV\"}/g,
    "{lang === 'ar' ? \"الشروط العامة\" : \"Conditions Générales\"}"
  );

  fs.writeFileSync(file, page);
}

updateFooter('src/app/[lang]/page.tsx');
updateFooter('src/app/[lang]/reserver/page.tsx');
