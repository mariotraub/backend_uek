const fs = require("fs")

const dir = process.argv[2];
const ext = process.argv[3];

fs.readdir(dir, (err, list) => {
	if (err) throw err;
	const filtered = list.filter(file => file.endsWith(`.${ext}`))
	console.log(filtered.join("\n"))
});
