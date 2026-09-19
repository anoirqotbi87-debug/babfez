const fs = require('fs');
let page = fs.readFileSync('src/app/[lang]/page.tsx', 'utf8');
let match = page.indexOf('<section id="services"');
console.log(page.substring(match, match + 4000));
