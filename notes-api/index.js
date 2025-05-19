const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT=3000;

app.use(express.json());

app.get(`/notes`, (req, res) => {
    fs.readFile(`notes.json`, `utf-8`, (err, data) =>{
        if (err) return res.status(500).json({error: `Error al leer`});

        const notas = JSON.parse(data);
        res.json(notas);
    })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  app.post('/notes', (req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
        return res.status(500).json({error: `Error al leer`});
    }

    let notas = [];
    try {
        notas = JSON.parse(data);
    } catch {
        notas = [];
    }

    const nuevaNota = {
        id: uuidv4(),
        title,
        content
    }
    notas.push(nuevaNota)

    fs.writeFile('notes.json', JSON.stringify(notas, null, 3), (err) =>{
        if (err) return res.status(500).json({ error: 'Error guardando nota' });

    res.status(201).json(nuevaNota);
    });
  });
  