const express = require("express");
const { consultBooks, consultBookById, saveBook, deleteBook } = require("./routes/books.js");
const APP = express();
const PORT = 3000;
//const fs = require('fs');

let booksList = [];

APP.use(express.json());

APP.get('/books', async (request, response) => {

    booksList = await consultBooks();
    
    response.json(booksList);
});

APP.get('/books/:id', async (request, response) => {

    const ID = request.params.id;

    let book = await consultBookById(ID);
    //console.log(book);
    
    response.json(book);
});

APP.post('/books', async (request, response) => {

    const { title, autor } = request.body;

    let newBook = await saveBook(title, autor);

    response.json(newBook);

});

APP.delete('/books/:id', async (request, response) => {

    const ID = request.params.id;

    let deleteMessage = await deleteBook(ID);

    response.json(deleteMessage);
});

APP.listen(PORT, () => {

    console.log(`Server listening in http://localhost:${PORT}`);
});