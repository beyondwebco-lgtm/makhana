const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

const dirs = fs.readdirSync('public/assets/products');
for (const d of dirs) {
  if (d.startsWith('.')) continue;
  const p = path.join('public/assets/products', d);
  const files = fs.readdirSync(p).filter(f => f.endsWith('.png')).sort();
  
  // Find the product block in products.ts
  const regex = new RegExp(`slug:\\s*["']${d}["'][\\s\\S]*?bgImages:\\s*\\[(.*?)\\]`, 'g');
  const match = regex.exec(content);
  if (match) {
    const filesStr = files.map(f => `"${f}"`).join(', ');
    const newBlock = match[0].replace(match[1], filesStr);
    content = content.replace(match[0], newBlock);
  }
}

fs.writeFileSync(productsFile, content);
console.log("Updated products.ts");
