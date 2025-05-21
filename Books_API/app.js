const express = require("express");
const consultBooks = require("./routes/books.js")
const APP = express();
const PORT = 3000;
const fs = require('fs');

let booksList = consultBooks();


APP.use(express.json());

APP.get('/books', (request, response) => {
    
    response.json(booksList);
})
//consultBooks();

APP.listen(PORT, () => {

    console.log(`Server listening in http://localhost:${PORT}`);

});