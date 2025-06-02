const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Función para obtener el siguiente ID
 function getnextID() {
    const files = fs.readdirSync(DATA_DIR);
    const ids = files
        .map(file => parseInt(file.replace('.json', '')))
        .filter(num => !isNaN(num));
    const maxid = ids.length > 0 ? Math.max(...ids) : 0;
    return maxid + 1;
}

// Obtener todos los libros
router.get('/', (req, res) => {
    fs.readdir(DATA_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: 'Error leyendo libros' });

        const books = files.map(file => {
            const content = fs.readFileSync(path.join(DATA_DIR, file));
            return JSON.parse(content);
        });
        res.json(books);
    });
});

// Obtener un libro por ID
router.get('/:id', (req, res) => {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Libro no encontrado' });
    }
    const content = fs.readFileSync(filePath);
    const book = JSON.parse(content);
    res.json(book);
});

// Agregar un nuevo libro
router.post('/',  (req, res) => {
    const newId =  getnextID();
    const filePath = path.join(DATA_DIR, `${newId}.json`);
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (title, author)' });
    }
    const book = { id: newId, title, author };
    fs.writeFileSync(filePath, JSON.stringify(book, null, 2));
    res.status(201).json(book);
});

// eliminar libro
router.delete('/:id', (req, res) => {
const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Libro no encontrado' });
    }
    fs.unlinkSync(filePath);
    res.status(204).send();
}
)
module.exports = router;
