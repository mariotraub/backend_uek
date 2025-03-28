import express from "express";
import path from "path";

const app = express();
const port = 8080;
const dir = import.meta.dirname;

app.get("/now", (_, res) => {
	const now = new Date();
	res.type("text").send(now.toTimeString())
});

app.get("/zli", (_, res) => {
	res.redirect("https://www.zli.ch")
});

const names = [
  "Lena", "Maximilian", "Hannah", "Felix", "Emma",
  "Noah", "Mia", "Leon", "Sophia", "Elias",
  "Marie", "Paul", "Clara", "Jonas", "Anna",
  "Luca", "Laura", "Ben", "Emily", "Finn"
];
app.get("/name", (_, res) => {
	res
		.type("text")
		.send(names[Math.floor((Math.random() * names.length))]);
});

app.get("/html", (_, res) => {
	res.sendFile(path.join(dir, "index.html"));
});

app.get("/image", (_, res) => {
	res.sendFile(path.join(dir, "img.png"));
});

app.get("/teapot", (_, res) => {
	res.sendStatus(418);
});

app.get("/user-agent", (req, res) => {
	const userAgent = req.headers["user-agent"];
	res.type("text").send(userAgent);
});

app.get("/secret", (_, res) => {
	res.sendStatus(403);
});

app.get("/xml", (_, res) => {
	res.sendFile(path.join(dir, "data.xml"));
});

const me = {
	name: "Mario",
	eyeColor: "Blue"
};

app.get("/me", (_, res) => {
	res.send(me);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});

