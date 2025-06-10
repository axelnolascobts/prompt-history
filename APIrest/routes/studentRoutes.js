const express = require('express');
const router = express.Router();
//test
router.get('/', (req, res) => 
    res.send('Todos los estudiantes'));
router.get('/:id', (req,res) => 
res.send(`Estudiante con ID ${req.params.id}`));

module.exports = router;
