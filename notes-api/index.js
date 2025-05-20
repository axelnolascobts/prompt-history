const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

const PORT=3000;
let notas = []; 
const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

app.use(express.json());

app.get(`/notes`, (req, res) => {
    fs.readFile(`notes.json`, `utf-8`, (err, data) =>{
        if (err) return res.status(500).json({error: `Error al leer`});

        notas = JSON.parse(data);
        res.json(notas);
    })
})


        app.get(`/notes/:id`, (req, res) => {
            
            const ID = req.params.id;
            if(regex.exec(ID)){
                let nota = notas.find(n => n.id === ID);
                if (nota){
                    res.json(nota);
                }else{
                    res.status(404).json({error: `Error al buscar`})
                }
            }else{
                const titulo = req.params.id;
                let nota = notas.find(n => n.title === titulo);
                if (nota){
                    res.json(nota);
                }else{
                    res.status(404).json({error: `Error al buscar`})
            }
            }
            });
    
                app.delete(`/notes/:id`, (req, res) => {
                    const ID = req.params.id;
                    let index =  notas.findIndex(n => n.id === ID);
                        if (index !== -1){
                            const delete_nota = notas.splice(index,1);
                            fs.writeFile('notes.json', JSON.stringify(notas, null, 3), (err) =>{
                                if (err){ return res.status(500).json({ error: 'Error borrando nota' })};
                                res.json(delete_nota);
                        })
                    }
                });



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
  