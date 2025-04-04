import express from "express";
import dotenv from "dotenv"

dotenv.config({path: "7/1/.env"})
console.log(process.env)
const app = express();
const port = 8080;

const userName = process.env.USERNAME
const password = process.env.PASSWORD

app.get("/public", (_, res) => {
	res.send("I'm a public endpoint")
});

app.get("/private", (req, res) => {
	if (req.headers.authorization) {
		const authEncoded = req.headers.authorization.replace(/^Basic\s+/i, '');
		const auth = Buffer.from(authEncoded, 'base64').toString('utf8');
		if (auth === `${userName}:${password}`) {
			res.send("I'm a private endpoint");
			return;
		}
	}
	res.setHeader("WWW-Authenticate", "Basic realm='Server'")
		.sendStatus(401);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});
