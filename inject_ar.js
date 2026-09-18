const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add import ar if fr, en, es exist but ar doesn't
  if (content.includes('import es from "@/dictionaries/es.json";') && !content.includes('import ar from "@/dictionaries/ar.json";')) {
    content = content.replace('import es from "@/dictionaries/es.json";', 'import es from "@/dictionaries/es.json";\nimport ar from "@/dictionaries/ar.json";');
    changed = true;
  }

  // Add ar to dicts object
  if (content.includes('const dicts = { fr, en, es };')) {
    content = content.replace('const dicts = { fr, en, es };', 'const dicts = { fr, en, es, ar };');
    changed = true;
  }
  
  if (content.includes('const dicts = { fr, en, es }')) {
    content = content.replace('const dicts = { fr, en, es }', 'const dicts = { fr, en, es, ar }');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
console.log('Done injecting ar into components');
