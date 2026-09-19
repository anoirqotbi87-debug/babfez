const fs = require('fs');

function replaceFooterWithComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the exact footer block
  const footerStart = content.indexOf('<footer');
  if (footerStart === -1) return;
  const footerEnd = content.indexOf('</footer>', footerStart) + 9;
  
  const originalFooter = content.substring(footerStart, footerEnd);
  
  // Replace with the Footer component
  content = content.replace(originalFooter, '<Footer lang={lang} dict={dict} />');

  // Add the import at the top if it's not there
  if (!content.includes('import Footer from')) {
    // find the last import and add it there
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    
    content = content.substring(0, endOfLastImport) + 
              '\nimport Footer from "@/components/Footer";' + 
              content.substring(endOfLastImport);
  }

  fs.writeFileSync(filePath, content);
}

replaceFooterWithComponent('src/app/[lang]/page.tsx');
replaceFooterWithComponent('src/app/[lang]/reserver/page.tsx');
