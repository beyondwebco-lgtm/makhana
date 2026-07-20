const http = require('http');
// Just test the fs logic directly
const fs = require('fs');
const path = require('path');
const dirPath = path.join(process.cwd(), 'public', 'assets', 'products', 'crush-me');
const files = fs.readdirSync(dirPath);
console.log(files);
