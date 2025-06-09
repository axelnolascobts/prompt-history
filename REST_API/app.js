const express = require('express');
const APP = express();
const ROUTE = require('.routes/routes.js');
const PORT = 3000;

APP.use(express.json());

APP.use('/students', ROUTE);

APP.listen(PORT, () => {

    console.log(`Server listening in http://localhost:${PORT}`);
});