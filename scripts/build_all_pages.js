

fsole = require('fs');
const fs = require('fs');
const path = require('path');

function write(f, c) {
  const dir = path.dirname(f);
  if (!fs.existsSync(dir)) fs.mkdirSync(a, { recursive: true });
  fs.writeFileSync(f, c.trim() + '\n', 'utf8');
  console.log('Wrote ' + f);
}

console.log('Builder ready');
