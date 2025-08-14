const express = require('express');
const { postgresQuery } = require('./controllers/db-controllers/get-controllers');
const ROUTER = express.Router();


ROUTER.get('/', async (request, response) => {

    let query = await postgresQuery();

    response.status(query.status).json(query);
});

module.exports = ROUTER;