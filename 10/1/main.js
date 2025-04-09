import express from "express";
import tasks from "./tasks.js";
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

app.use("/tasks", tasks);

app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	
	if (password === "m295") {
		req.session.email = email;
		res.sendStatus(200);
		return;
	}
	res.sendStatus(401);
});

app.get("/verify", (req, res) => {
	if (!req.session.email) {
		res.sendStatus(401);
		return;
	}
	res.send(req.session.email);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});
