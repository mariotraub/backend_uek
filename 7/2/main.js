import express from "express";
import session from "express-session";

const app = express();
const port = 8080;

app.use(session({
	secret: "secret string",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60,
	},
}));

app.use(express.json());

app.post("/name", (req, res) => {
	const name = req.body.name;
	req.session.name = name;

	res.status(201).send(name);
});

app.get("/name", (req, res) => {
	const name = req.session.name;
	res.send(name);
});

app.delete("/name", (req, res) => {
	req.session.destroy();
	res.sendStatus(204);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});

