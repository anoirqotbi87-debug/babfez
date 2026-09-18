const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/[lang]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Nav
  [/dict\.nav\.simulator/g, 'dict.nav.simulator'],
  [/dict\.nav\.services/g, 'dict.nav.services'],
  [/dict\.nav\.atouts/g, 'dict.nav.advantages'],
  [/dict\.nav\.faq/g, 'dict.nav.faq'],
  [/dict\.nav\.book/g, 'dict.nav.book'], // Wait, new translation uses book or properties?
  // Let's check update_dicts.js:
  // nav: { simulator, services, advantages, properties, faq, ownerSpace, estimateBtn, backHome }
  // hero: { badge, title, subtitle, kpi1, kpi2, kpi3 }
  // simulator: { title, zoneLabel, zoneMedina, zoneVilleNouvelle, zoneImmouzzer, typeLabel, typeApartment, typeRiad, typeVilla, roomStudio, room1, room2, room3, room4, occupancy, monthlyGross, annualGross, avgRate, ctaQuote }
  // contact: { fullName, email, phone, area, surface, plan, planSerenite, planDigital, planCustom, message, consent, submitBtn }

  // Let's replace manually
  [/dict\.home\.heroTag/g, 'dict.hero.badge'],
  [/dict\.home\.heroTitle/g, 'dict.hero.title'],
  [/dict\.home\.heroSubtitle/g, 'dict.hero.subtitle'],
  [/dict\.home\.btnEstimate/g, 'dict.nav.estimateBtn'],
  [/dict\.home\.btnServices/g, 'dict.nav.services'],
  [/dict\.nav\.estimate/g, 'dict.nav.estimateBtn'],
  
  // Simulator
  [/dict\.home\.simTitle/g, 'dict.simulator.title'],
  [/dict\.home\.simSubtitle/g, '""'], // Subtitle removed or can use empty string
  [/dict\.home\.simZone/g, 'dict.simulator.zoneLabel'],
  [/dict\.form\.quartierMedina/g, 'dict.simulator.zoneMedina'],
  [/dict\.form\.quartierVN/g, 'dict.simulator.zoneVilleNouvelle'],
  [/dict\.form\.quartierRoute/g, 'dict.simulator.zoneImmouzzer'],
  
  [/dict\.sim\.propType/g, 'dict.simulator.typeLabel'],
  [/dict\.sim\.propTypeAppart/g, 'dict.simulator.typeApartment'],
  [/dict\.sim\.propTypeRiad/g, 'dict.simulator.typeRiad'],
  [/dict\.sim\.propTypeVilla/g, 'dict.simulator.typeVilla'],
  
  [/dict\.home\.simRooms/g, '"" /* Numéro de chambres */'], 
  [/dict\.sim\.roomStudio/g, 'dict.simulator.roomStudio'],
  [/dict\.sim\.room1/g, 'dict.simulator.room1'],
  [/dict\.sim\.room2/g, 'dict.simulator.room2'],
  [/dict\.sim\.room3/g, 'dict.simulator.room3'],
  [/dict\.sim\.room4/g, 'dict.simulator.room4'],
  
  [/dict\.home\.simOccupancy/g, 'dict.simulator.occupancy'],
  [/dict\.home\.simRevMonth/g, 'dict.simulator.monthlyGross'],
  // For simRevYear we have dict.simulator.annualGross but the text has {amount}.
  // Let's replace "Soit {yearlyRevenue...} MAD {dict.home.simRevYear.split(' ')[1]}"
  // with dict.simulator.annualGross.replace('{amount}', yearlyRevenue.toLocaleString('fr-FR') + ' MAD')
  [/Soit \{yearlyRevenue\.toLocaleString\('fr-FR'\)\} MAD \{dict\.home\.simRevYear\.split\(' '\)\[1\]\}/g, "dict.simulator.annualGross.replace('{amount}', yearlyRevenue.toLocaleString('fr-FR') + ' MAD')"],
  
  [/dict\.home\.simContact/g, 'dict.simulator.ctaQuote'],

  // Contact form
  [/dict\.home\.contactTitle/g, '"" /* Contact title */'],
  [/dict\.home\.contactSubtitle/g, '""'],
  [/dict\.formName/g, 'dict.contact.fullName'],
  [/dict\.formPhone/g, 'dict.contact.phone'],
  [/dict\.formZone/g, 'dict.contact.area'],
  [/dict\.formFormula/g, 'dict.contact.plan'],
  [/dict\.formMsg/g, 'dict.contact.message'],
  [/dict\.formSubmit/g, 'dict.contact.submitBtn'],
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

fs.writeFileSync(filePath, content);
console.log('page.tsx replaced');
