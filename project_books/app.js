const express = require('express');
const fs = require('fs');
const app = express();
const bookroute = require(`./routes/books`);
const path = require('path');
const PORT = 3000;


app.use(express.json());
app.use(`/books`, bookroute)


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });