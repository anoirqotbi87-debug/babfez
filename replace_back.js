const fs = require('fs');
const files = [
  'c:/Users/Qotbi/Documents/GitHub/BABFEZ/src/app/[lang]/conditions-generales/page.tsx',
  'c:/Users/Qotbi/Documents/GitHub/BABFEZ/src/app/[lang]/confidentialite/page.tsx',
  'c:/Users/Qotbi/Documents/GitHub/BABFEZ/src/app/[lang]/mentions-legales/page.tsx',
  'c:/Users/Qotbi/Documents/GitHub/BABFEZ/src/app/[lang]/admin/login/page.tsx',
  'c:/Users/Qotbi/Documents/GitHub/BABFEZ/src/app/[lang]/proprietaire/login/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Retour à l'accueil/g, '{dict.nav.backHome}');
  fs.writeFileSync(file, content);
}
console.log('Replaced Retour à l\'accueil');
