const fs = require('fs');

function fixFile(file) {
  if (!fs.existsSync(file)) return;
  let page = fs.readFileSync(file, 'utf8');

  // Col Titles
  page = page.replace(
    /\"Nos Services\"}/g,
    "lang === 'ar' ? \"خدماتنا\" : \"Nos Services\"}"
  );
  page = page.replace(
    /\"Navigation\"}/g,
    "lang === 'ar' ? \"روابط سريعة\" : \"Navigation\"}"
  );
  page = page.replace(
    /\"Contact \& Permanence\"}/g,
    "lang === 'ar' ? \"التواصل والمداومة\" : \"Contact & Permanence\"}"
  );

  // Permanence
  page = page.replace(
    /\"7j\/7 — 24h\/24 pour les urgences\"}/g,
    "lang === 'ar' ? \"7 أيام / 7 — 24 ساعة للطوارئ\" : \"7j/7 — 24h/24 pour les urgences\"}"
  );

  // Legal
  page = page.replace(
    /\"Mentions légales\"}/g,
    "lang === 'ar' ? \"الشروط القانونية\" : \"Mentions légales\"}"
  );
  page = page.replace(
    /\"Politique de confidentialité\"}/g,
    "lang === 'ar' ? \"سياسة الخصوصية\" : \"Politique de confidentialité\"}"
  );
  page = page.replace(
    /\"Conditions Générales\"}/g,
    "lang === 'ar' ? \"الشروط العامة\" : \"Conditions Générales\"}"
  );

  fs.writeFileSync(file, page);
}

fixFile('src/app/[lang]/page.tsx');
fixFile('src/app/[lang]/reserver/page.tsx');
