const express = require('express');
const SWAGGER_UI = require('swagger-ui-express');
const SWAGGER_DOCUMENT = require('./api-docs/swagger.json');
const APP = express();
const ROUTE = require('./routes/routes.js');
const PORT = 3000;

APP.use(express.json());

APP.use('/students', ROUTE);

APP.use('/api-docs', SWAGGER_UI.serve, SWAGGER_UI.setup(SWAGGER_DOCUMENT));

APP.use((request, response) => {
    response.status(404).json({ message: "Route not found" });
});

APP.listen(PORT, () => {

    console.log(`Server listening in http://localhost:${PORT}`);
});