const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());

const NOTES_FILE = "notes.json"

let notes = [];

//console.log(uuidv4());

fs.readFile(NOTES_FILE, 'utf8', function(err, data) {

    if (err) {

        fs.appendFile(NOTES_FILE, '{"notes": []}', function (err) {

            if (err) {
                //console.error("Error creating to file");
                //throw err;
            }

            //console.log('Saved');
        }); 
        
    }

    //console.log(data);
    notes = JSON.parse(data).notes;
});

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const ID = parseInt(req.params.id);
    const NOTE = notes.find(n => n.id === ID);

    if (NOTE) {
        res.json(NOTE);
    } else {
        res.status(404).json({ message: "Note not found" });
    }

});

app.get('/notes/:title', (req, res) => {
    const TITLE = parseInt(req.params.title);
    const NOTE = notes.find(n => n.title === TITLE);

    if (NOTE) {
        res.json(NOTE);
    } else {
        res.status(404).json({ message: "Note not found" });
    }

});

app.post("/notes", (req, res) => {

    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content
    };

    notes.push(newNote);

    fs.writeFile(NOTES_FILE, JSON.stringify({ notes: notes }, null, 2), (err) => {

        if (err) {
            //console.error("Error writing to file");
            return res.status(500).json({ message: "Failed to save note" });
        }

        res.status(201).json(newNote);
    });

});


app.delete("/notes/:id", (req, res) => {
    const ID = req.params.id;

    const index = notes.findIndex(n => n.id === ID);

    if (index !== -1) {
        const deletedNote = notes.splice(index, 1)[0];

        fs.writeFile(NOTES_FILE, JSON.stringify({ notes: notes }, null, 2), (err) => {

            if (err) {
                //console.error("Error writing to file");
                return res.status(500).json({ message: "Failed to delete note" });
            }

            res.json({ message: "Note deleted", note: deletedNote });
        });
    } else {
        res.status(404).json({ message: "Note not found" });
    }
});



app.listen(port, () => {
    console.log(`Server listening in http://localhost:${port}`);
});