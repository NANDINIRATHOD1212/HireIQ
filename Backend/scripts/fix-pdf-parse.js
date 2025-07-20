import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('node_modules', 'pdf-parse', 'index.js');

fs.readFile(indexPath, 'utf-8', (err, data) => {
  if (err) {
    console.error('❌ Could not read pdf-parse/index.js', err);
    return;
  }

  const fixed = data.replace(
    /let isDebugMode = !module\.parent;/,
    'let isDebugMode = false; // patched to disable test execution'
  );

  fs.writeFile(indexPath, fixed, 'utf-8', (err) => {
    if (err) {
      console.error('❌ Failed to patch pdf-parse', err);
    } else {
      console.log('✅ Patched pdf-parse to disable test block');
    }
  });
});
