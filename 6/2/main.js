import express from 'express';
import { randomUUID } from 'node:crypto';
import * as swaggerUi from "swagger-ui-express";
import Doc from "./swagger-output.json" with { type: "json" };

const app = express();
app.use(express.json());
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(Doc));
const port = 3000;

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
	// #swagger.tags = ['Books']
	// #swagger.description = 'Get all Books'
    response.send(books);
});

app.get(`/books/:isbn`, (request, response) => {
	// #swagger.tags = ['Books']
	// #swagger.description = 'Get a Book by its isbn'
    const book = books.find((b) => b.isbn === request.params.isbn);
    response.send(book);
});

app.post('/books', (request, response) => {
	// #swagger.tags = ['Books']
	// #swagger.description = 'Add a new Book'
    books = [...books, request.body];
    response.status(201).send(books);
});

app.put(`/books/:isbn`, (request, response) => {
	// #swagger.tags = ['Books']
	// #swagger.description = 'Update a book by its isbn'
    if (!books.find((b) => b.isbn === request.params.isbn)) {
        return response.sendStatus(409);
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
	// #swagger.tags = ['Books']
	// #swagger.description = 'Delete a book by its isbn'
    books = books.filter((b) => b.isbn !== request.params.isbn);
    response.sendStatus(204);
});

app.get('/lends', (_request, response) => {
	// #swagger.tags = ['Lends']
	// #swagger.description = 'Get all Lends'
    response.send(lends);
});

app.get('/lends/:id', (request, response) => {
	// #swagger.tags = ['Lends']
	// #swagger.description = 'Get a lend by its id'
    const lend = lends.find((l) => l.id === request.params.id);
    response.send(lend);
});

app.post('/lends', (request, response) => {
	// #swagger.tags = ['Lends']
	// #swagger.description = 'Create a new lend'
    const isLent = lends.some((l) => l.isbn === request.body.isbn && !l.returnedAt);
    if (isLent) {
        return response.send(400);
    }
    lends = [...lends, { ...request.body, id: randomUUID(), borrowedAt: Date.now() }]
    response.status(201).send(lends);
});

app.delete('/lends/:id', (request, response) => {
	// #swagger.tags = ['Lends']
	// #swagger.description = 'Return a lent book.'
    lends = lends.map((l) => {
        if (l.id === request.params.id) {
            return {...l, returnedAt: Date.now()}
        } else {
            return l;
        }
    });
    response.send(lends);
});


app.listen(port, () => {
    console.log(`Book server on port ${port}`);
});
