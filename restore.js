const fs = require('fs');
const [,, filePath, ...contentParts] = process.argv;
const content = contentParts.join(' ');
fs.writeFileSync(filePath, content, 'utf8');
console.log(`Wrote ${filePath}`);
