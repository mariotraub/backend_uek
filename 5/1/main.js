import express from "express";

const app = express();
const port = 8080;
app.use(express.json());

class Book {
	constructor(isbn, title, year, author, res) {
		if (!(isbn && title && year && author)) {
			res.send(422);
			throw Error("Not all fields set!")
		}
		this.isbn = isbn;
		this.title = title;
		this.year = year;
		this.author = author;
	}
}

let books = [];

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
	res.send(book);
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

