const fs = require("fs")

function leseDateiInhalt(path) {
	return new Promise((resolve, reject) => {
		try {
			resolve(fs.readFileSync(path, "utf8"));
		} catch (error) {
			reject(error);
		}
	});
}

leseDateiInhalt(process.argv[1])
	.then(inhalt => console.log('Die Länge des Dateiinhalts beträgt:', inhalt.length))
	.catch(err => { console.error('Fehler beim Lesen der Datei:', err)});

