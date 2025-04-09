import express from "express";

const app = express();
const port = 8080;
app.use(express.json());

class Book {
	constructor(isbn, title, year, author, res) {
		if (!(isbn && title && year && author)) {
			if (res) res.send(422);
			throw Error("Not all fields set!")
		}
		this.isbn = isbn;
		this.title = title;
		this.year = year;
		this.author = author;
	}
}

let books = [
	new Book("978-3-16-148410-0", "JavaScript Basics", 2020, "John Doe"),
	new Book("978-1-23-456789-7", "Advanced JS", 2021, "Jane Smith"),
	new Book("978-0-12-345678-9", "Node.js in Action", 2019, "Alice Johnson"),
	new Book("978-4-56-789012-3", "React for Beginners", 2022, "Bob Brown"),
	new Book("978-9-87-654321-0", "Mastering TypeScript", 2023, "Charlie White")
];

let activeLends = []

class Lend {
	constructor(id, customerId, isbn, res) {
		if (!(id && customerId && isbn)) {
			if (res) res.send(422);
			throw Error("Not all fields set!");
		}
		if (activeLends.some(lend => lend.isbn === isbn) || !books.find((book) => book.isbn === isbn)) {
			if (res) res.send(422);
			throw Error("Book not available");
		}
		if (activeLends.filter((lend) => customerId === lend.customerId).length >= 3) {
			if (res) res.send(422);
			throw Error("You can only lend 3 books at a time");
		}

		this.id = id;
		this.customerId = customerId,
		this.isbn = isbn;

		this.borrowedAt = new Date();

		activeLends.push(this);
	}

	returnLend() {
		activeLends = activeLends.filter((lend) => lend.isbn !== this.isbn);

		this.returnedAt = new Date();
	}
}

const lends = [
	new Lend(1, 101, "978-3-16-148410-0"),
	new Lend(2, 102, "978-1-23-456789-7"),
];

app.get("/lends", (_, res) => {
	res.send(lends);
});

app.get("/lends/:id", (req, res) => {
	const id = parseInt(req.params.id);
	res.send(lends.find((lend) => lend.id === id));
});

app.post("/lends", (req, res) => {
	const lend = new Lend(req.body.id, req.body.customerId, req.body.isbn, res)
	lends.push(lend);
	res.status(201).send(lend);
});

app.delete("/lends/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const lend = lends.find(lend => lend.id === id);
	lend.returnLend();
	res.sendStatus(204);
});

app.get("/books", (_, res) => {
	res.send(books);
});

app.get("/books/:id", (req, res) => {
	const id = req.params.id;
	res.send(books.filter(book => book.isbn === id));
});

app.post("/books", (req, res) => {
	const book = req.body;
	books.push(new Book(book.isbn, book.title, book.year, book.author, res));
	res.status(201).send(book);
});

app.put("/books/:id", (req, res) => {
	const book = req.body;
	const id = req.params.id;

	books = books.map(b => {
		if (b.isbn === id) {
			return new Book(book.isbn, book.title, book.year, book.author, res);
		} 
		return b;
	});

	res.sendStatus(204);
});

app.delete("/books/:id", (req, res) => {
	const id = req.params.id;

	books = books.filter(book => book.isbn !== id);
	res.sendStatus(204);
});

app.patch("/books/:id", (req, res) => {
	const book = req.body;
	const id = req.params.id;

	books = books.map(b => {
		if (b.isbn === id) {
			return {...b, ...book};
		} 
		return b;
	});

	res.sendStatus(204);
});

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
});

