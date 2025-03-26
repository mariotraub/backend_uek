const http = require("http");

const [,, ...urls] = process.argv;

urls.forEach(async (url) => {
	let fullData = "";
	await new Promise((resolve) => {
		http.get(url, (res) => {
			res.setEncoding("utf8");
			res.on("data", (data) => fullData += data);
			res.on("end", () => resolve())
		});
	});
	console.log(fullData)
});
