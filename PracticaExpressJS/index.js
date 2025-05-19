const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let tareas = [
    { id: 1, descripcion: 'Aprender a usar ExpressJS' },
    { id: 2, descripcion: 'practicar Express' },
    { id: 3, descripcion: 'dominar ExpressJS' }
];

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Obtener una tarea por ID
app.get('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
        res.json(tarea);
    } else {
        res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
});

// Agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const nuevaTarea = {
        id: tareas.length + 1,
        descripcion: req.body.texto
    };

    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cantidadOriginal = tareas.length;
    tareas = tareas.filter(t => t.id !== id);

    if (tareas.length < cantidadOriginal) {
        res.status(204).send(); // Eliminación exitosa
    } else {
        res.status(404).json({ mensaje: "Tarea no encontrada" });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
