const express = require('express');
const studentRoutes = require('./routes/studentRoutes.js')
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const courseRoutes = require("./routes/courseRoutes");


app.use(express.json());
app.use('/students', studentRoutes);
app.use("/courses", courseRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('The api is running');
});

// Middleware para capturar errores de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 400,
      message: "Malformed JSON in request body",
      data: null
    });
  }
  next(err);
});

//rutas no encontradas
app.use((req, res, next) => {
return res.status(404).json({
      status: 404,
      message: "Route not found",
      data: []
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });



  module.exports = app;