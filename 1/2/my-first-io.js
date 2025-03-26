const fs = require("fs")

const path = process.argv[2];

const content = fs.readFileSync(path).toString();

const newLineCount = content.split("\n").length - 1;

console.log(newLineCount);
