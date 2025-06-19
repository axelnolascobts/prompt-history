const express = require('express');
const APP = express();
const ROUTER = require('./routes/router.js');
const PORT = 3000;

APP.use(express.json());

APP.use('/teams', ROUTER);

APP.use((request, response) => {
    response.status(404).json({ error_message: "Route not found" });
});

APP.listen(PORT, () => {
    console.log(`server listening in port: ${PORT}`);
});

module.exports = APP;