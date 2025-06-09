const express = require('express');
const fs = require('fs');
const app = express();
const routes = require(`./routes/routes.js`);
const PORT = 3000;


app.use(express.json());
app.use(`/routes`, routes)


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });