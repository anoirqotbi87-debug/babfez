const fs = require('fs');

function fixPrecedence(file) {
  if (!fs.existsSync(file)) return;
  let page = fs.readFileSync(file, 'utf8');

  // Regex to match: dict.something || lang === 'ar' ? "..." : "..."
  // and replace with: dict.something || (lang === 'ar' ? "..." : "...")
  
  page = page.replace(
    /\|\| lang === 'ar' \? \"([^\"]+)\" \: \"([^\"]+)\"/g,
    "|| (lang === 'ar' ? \"$1\" : \"$2\")"
  );

  fs.writeFileSync(file, page);
}

fixPrecedence('src/app/[lang]/page.tsx');
fixPrecedence('src/app/[lang]/reserver/page.tsx');
