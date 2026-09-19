const fs = require('fs');

function updateFooter(file) {
  let page = fs.readFileSync(file, 'utf8');

  page = page.replace(
    />Votre partenaire d'excellence pour la gestion locative courte durée et la conciergerie privée\.</g,
    `>{dict.footer?.slogan || "Votre partenaire d\\'excellence pour la gestion locative courte durée et la conciergerie privée."}<`
  );
  page = page.replace(
    />Nos Formules</g,
    `>{dict.footer?.servicesTitle || "Nos Formules"}<`
  );
  page = page.replace(
    />Liens Utiles</g,
    `>{dict.footer?.navTitle || "Liens Utiles"}<`
  );
  page = page.replace(
    />Contact & Permanence</g,
    `>{dict.footer?.contactTitle || "Contact & Permanence"}<`
  );
  page = page.replace(
    />Gestion Digitale</g,
    `>{dict.services?.planDigitalTitle || "Gestion Digitale"}<`
  );
  page = page.replace(
    />Gestion Sérénité</g,
    `>{dict.services?.planSereniteTitle || "Gestion Sérénité"}<`
  );
  page = page.replace(
    />7j\/7 — 24h\/24 pour les urgences</g,
    `>{dict.footer?.support247 || "7j/7 — 24h/24 pour les urgences"}<`
  );
  page = page.replace(
    />Mentions Légales</g,
    `>{dict.footer?.legal || "Mentions Légales"}<`
  );
  page = page.replace(
    />Confidentialité</g,
    `>{dict.footer?.privacy || "Confidentialité"}<`
  );
  page = page.replace(
    />CGV</g,
    `>{dict.footer?.terms || "CGV"}<`
  );
  page = page.replace(
    />Admin 🔒</g,
    `>{dict.footer?.admin || "Admin 🔒"}<`
  );

  fs.writeFileSync(file, page);
}

updateFooter('src/app/[lang]/page.tsx');
if (fs.existsSync('src/app/[lang]/reserver/page.tsx')) {
  updateFooter('src/app/[lang]/reserver/page.tsx');
}
