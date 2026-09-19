const fs = require('fs');
const langs = ['fr', 'en', 'es', 'ar'];

const additions = {
  nav: {
    home: { fr: 'Accueil', en: 'Home', es: 'Inicio', ar: 'الرئيسية' },
    faq: { fr: 'FAQ', en: 'FAQ', es: 'FAQ', ar: 'الأسئلة الشائعة' }
  },
  footer: {
    admin: { fr: '🔒 Admin', en: '🔒 Admin', es: '🔒 Admin', ar: 'إدارة النظام 🔒' }
  }
};

langs.forEach(lang => {
  let file = 'src/dictionaries/' + lang + '.json';
  let data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!data.nav) data.nav = {};
  if (!data.footer) data.footer = {};
  
  data.nav.home = additions.nav.home[lang];
  data.nav.faq = additions.nav.faq[lang];
  data.footer.admin = additions.footer.admin[lang];
  
  let jsonString = JSON.stringify(data, null, 2);
  if (lang === 'ar') {
     jsonString = jsonString.replace(/[\u007F-\uFFFF]/g, function(chr) {
       return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
     });
  }
  fs.writeFileSync(file, jsonString);
});
