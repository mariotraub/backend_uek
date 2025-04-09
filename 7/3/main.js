import express from "express";
import session from "express-session";
import { randomUUID } from 'node:crypto';
import path from "path";

const app = express();
const port = 8080;
const dir = import.meta.dirname;


const user = {
	email: "desk@library.example",
	password: "m295",
}

app.use(session({
	secret: "secret string",
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60,
	},
}));

app.use(express.json());
app.use(express.urlencoded());


app.get("/", (_, res) => {
	res.sendFile(path.join(dir, "index.html"))
});

app.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	
	if (email === user.email && password === user.password) {
		req.session.email = email;
		res.sendStatus(200);
		return;
	}
	
	res.sendStatus(401);
});

app.get("/verify", (req, res) => {
	if (req.session.email) {
		res.send(req.session.email);
		return;
	}
	res.sendStatus(401);
});

app.delete("/logout", (req, res) => {
	req.session.destroy();
	res.sendStatus(204);
});

let books = [
    { isbn: "9780747532743", title: "Harry Potter and the Philosopher's Stone", year: 1997, author: "J.K. Rowling" },
    { isbn: "9780439064873", title: "Harry Potter and the Chamber of Secrets", year: 1998, author: "J.K. Rowling" },
    { isbn: "9780261103573", title: "The Lord of the Rings", year: 1954, author: "J.R.R. Tolkien" },
    { isbn: "9780316769488", title: "The Catcher in the Rye", year: 1951, author: "J.D. Salinger" },
    { isbn: "9780061120084", title: "To Kill a Mockingbird", year: 1960, author: "Harper Lee" },
    { isbn: "9780451524935", title: "1984", year: 1949, author: "George Orwell" },
    { isbn: "9780141439600", title: "Pride and Prejudice", year: 1813, author: "Jane Austen" },
    { isbn: "9780553386790", title: "A Brief History of Time", year: 1988, author: "Stephen Hawking" },
    { isbn: "9780307277671", title: "The Road", year: 2006, author: "Cormac McCarthy" },
    { isbn: "9780385504201", title: "The Da Vinci Code", year: 2003, author: "Dan Brown" }
];

let lends = [];

app.get('/books', (_request, response) => {
    response.send(books);
});

app.get(`/books/:isbn`, (request, response) => {
    const book = books.find((b) => b.isbn === request.params.isbn);
    response.send(book);
});

app.post('/books', (request, response) => {
    books = [...books, request.body];
    response.status(201).send(books);
});

app.put(`/books/:isbn`, (request, response) => {
    if (!books.find((b) => b.isbn === request.params.isbn)) {
        return response.send(409);
    }
    books = books.map((b) => {
        if (b.isbn === request.params.isbn) {
            return request.body;
        } else {
            return b;
        }
    });
    response.send(books);
});

app.delete(`/books/:isbn`, (request, response) => {
    books = books.filter((b) => b.isbn !== request.params.isbn);
    response.send(204);
});

app.get('/lends', (request, response) => {
	if (!request.session.email){
		response.sendStatus(401);
		return;
	}
    response.send(lends);
});

app.get('/lends/:id', (request, response) => {
	if (!request.session.email){
		response.sendStatus(401);
		return;
	}
    const lend = lends.find((l) => l.id === request.params.id);
    response.send(lend);
});

app.post('/lends', (request, response) => {
	if (!request.session.email){
		response.sendStatus(401);
		return;
	}
	
    const isValid = request.body.isbn;
    if (!isValid) {
        return response.send(422);
    }
    const isLent = lends.some(
        (l) => l.isbn === request.body.isbn && !l.returnedAt
    );
    const tooManyLends = lends.filter(
        (l) => l.customerId === request.body.customerId && !l.returnedAt
    ).length >= 3;
    if (isLent || tooManyLends) {
        return response.send(400);
    }
    lends = [...lends, { ...request.body, id: randomUUID(), borrowedAt: Date.now(), customerId: request.session.email }]
    response.status(201).send(lends);
});

app.delete('/lends/:id', (request, response) => {
    lends = lends.map((l) => {
	if (!request.session.email){
		response.sendStatus(401);
		return;
	}
        if (l.id === request.params.id) {
            return {...l, returnedAt: Date.now()}
        } else {
            return l;
        }
    });
    response.send(lends);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});

