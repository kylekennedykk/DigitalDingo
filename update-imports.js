const fs = require('fs');
const path = require('path');

const importMappings = {
  // Client imports
  '@/lib/firebase': '@/src/lib/firebase',
  
  // Admin imports
  '@/lib/firebase-admin': '@/src/lib/firebase/admin/db',
  '@/lib/firebase/admin': '@/src/lib/firebase/admin/config',
  
  // Config imports
  '@/lib/firebase/config': '@/src/lib/firebase/client/config'
};

function updateImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;

    // Update imports
    Object.entries(importMappings).forEach(([oldPath, newPath]) => {
      const regex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
      updatedContent = updatedContent.replace(regex, `from '${newPath}'`);
    });

    // Write back if changed
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function walkDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDir(filePath);
      } else if (stat.isFile() && /\.(ts|tsx)$/.test(file)) {
        updateImports(filePath);
      }
    });
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }
}

// Start from project root
console.log('Starting import updates...');
walkDir('.');
console.log('Import updates complete!');
