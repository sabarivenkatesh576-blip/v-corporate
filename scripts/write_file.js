const fs = require("fs");
const path = require("path");
const [,, target, b64] = process.argv;
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, Buffer.from(b64, "base64"));
console.log("Saved " + target);
