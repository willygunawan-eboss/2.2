const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');
const componentsDir = path.join(__dirname, '../src/components');

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

pageFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // For each component file, if imported as './Something', replace with '../components/Something'
  componentFiles.forEach(compFile => {
    const compName = compFile.replace('.tsx', '');
    const regex1 = new RegExp(`from (['"])\\.\\/${compName}(['"])`, 'g');
    content = content.replace(regex1, `from $1../components/${compName}$2`);
  });

  fs.writeFileSync(filePath, content);
});

// Also fix App.tsx imports for components
let appContent = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
componentFiles.forEach(compFile => {
  const compName = compFile.replace('.tsx', '');
  const regex1 = new RegExp(`from (['"])\\.\\/pages\\/${compName}(['"])`, 'g');
  appContent = appContent.replace(regex1, `from $1./components/${compName}$2`);
});
fs.writeFileSync(path.join(__dirname, '../src/App.tsx'), appContent);

console.log('Imports fixed.');
