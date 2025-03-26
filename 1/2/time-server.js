const net = require("net")

const port = process.argv[2];

const server = net.createServer((socket) => {
	const date = new Date();

	const year = date.getFullYear();
	const month = zeroFill(date.getMonth() + 1);
	const day = zeroFill(date.getDate());
	const hour = zeroFill(date.getHours());
	const min = zeroFill(date.getMinutes());

	const out = `${year}-${month}-${day} ${hour}:${min}\n`;
	socket.end(out);
});

server.listen(port)

function zeroFill(num) {
	if (num.toString().length === 1) {
		return `0${num}`;
	}
	return num.toString();
}
