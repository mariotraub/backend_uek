const http = require("http")

const url = process.argv[2];

http.get(url, (response) => {
	let fullData = "";
	response.setEncoding("utf8")
	response.on("data", (data) => {
		fullData += data;
	});
	response.on("end", () => {
		console.log(fullData.length);
		console.log(fullData);
	});
});
