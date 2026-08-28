const fs = require('fs');
const [,, target, b64] = process.argv;
var buf = Buffer.from(b64, "base64");
fs.appendFileSync(target, buf);
console.log('Appended ' + buf.length + ' bytes to ' + target);
