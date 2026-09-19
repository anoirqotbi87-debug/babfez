const fs = require('fs');

const files = [
  'src/app/[lang]/admin/login/page.tsx',
  'src/app/[lang]/conditions-generales/page.tsx',
  'src/app/[lang]/confidentialite/page.tsx',
  'src/app/[lang]/mentions-legales/page.tsx',
  'src/app/[lang]/page.tsx',
  'src/app/[lang]/proprietaire/dashboard/page.tsx',
  'src/app/[lang]/proprietaire/login/page.tsx',
  'src/app/[lang]/reserver/page.tsx'
];

const mergeCode = `
  const baseDict = dicts[lang as keyof typeof dicts] || dicts.fr;
  const dict: any = {
    ...dicts.fr,
    ...baseDict,
    nav: { ...dicts.fr.nav, ...(baseDict as any).nav },
    hero: { ...(dicts.fr as any).hero, ...(baseDict as any).hero },
    simulator: { ...(dicts.fr as any).simulator, ...(baseDict as any).simulator },
    services: { ...(dicts.fr as any).services, ...(baseDict as any).services },
    contact: { ...(dicts.fr as any).contact, ...(baseDict as any).contact },
    booking: { ...(dicts.fr as any).booking, ...(baseDict as any).booking },
    modal: { ...(dicts.fr as any).modal, ...(baseDict as any).modal },
    home: { ...(dicts.fr as any).home, ...(baseDict as any).home },
    reserver: { ...(dicts.fr as any).reserver, ...(baseDict as any).reserver },
    proprietaire: { ...(dicts.fr as any).proprietaire, ...(baseDict as any).proprietaire },
    footer: { ...(dicts.fr as any).footer, ...(baseDict as any).footer },
    sim: { ...(dicts.fr as any).sim, ...(baseDict as any).sim },
    form: { ...(dicts.fr as any).form, ...(baseDict as any).form },
    login: { ...(dicts.fr as any).login, ...(baseDict as any).login }
  };
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/const dict: any = dicts\[lang as keyof typeof dicts\] \|\| dicts\.fr;/g, mergeCode.trim());
    fs.writeFileSync(file, content);
  }
});
