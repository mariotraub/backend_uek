import express from "express";

const app = express();
const port = 8080;

app.use(express.urlencoded());
app.use(express.json()),

app.get("/now", (req, res) => {
	const tz = req.query.tz;
	const now = new Date()
	if (tz) {
		res.type("text").send(now.toLocaleString(undefined, {timeZone: tz}))
	} else {
		res.type("text").send(now.toTimeString())
	}
});

app.get("/zli", (_, res) => {
	res.redirect("https://www.zli.ch")
});

let names = [];

app.get("/names", (_, res) => {
	res
		.type("text")
		.send(names[Math.floor((Math.random() * names.length))]);
});

app.post("/names", (req, res) => {
	const name = req.body.name;
	if (name) names.push(name);
	res.type("text").send(name);
});

app.delete("/names", (req, res) => {
	const nameParam = req.query.name;
	names = names.filter((name) => {
		return name !== nameParam;	
	});

	res.sendStatus(204);
});

app.get("/secret2", (req, res) => {
	const auth = req.headers.authorization;
	if (auth === "Basic aGFja2VyOjEyMzQ=") {
		res.sendStatus(200);
	} else {
		res.sendStatus(401);
	}
});

app.get("/chuck", async (req, res) => {
	const joke = (await (await fetch("https://api.chucknorris.io/jokes/random")).json()).value;
	const name = req.query.name;
	if (name) {
		res.type("text").send(joke.replace(new RegExp("Chuck Norris", "gi"), name));
	} else {
		res.type("text").send(joke)
	}
});

let me = {
	vorname: "Max",
	nachname: "Mustermann",
	alter: 17,
	wohnort: "Berlin",
	augenfarbe: "blau"
};

app.get("/me", (_, res) => {
	res.send(me);
});

app.patch("/me", (req, res) => {
	me = {...me, ...req.body};
	res.send(me);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});


