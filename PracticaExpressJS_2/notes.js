const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());

const NotesFiles = "notes.json"

let notes = [];

//console.log(uuidv4());

fs.readFile(NotesFiles, 'utf8', function(err, data) {

    if (err) {

        fs.appendFile(NotesFiles, '{"notes": []}', function (err) {

            if (err) {
                //console.error("Error creating to file");
                return res.status(500).json({ message: "Failed to delete note" });
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

app.get('/notes/:value', (req, res) => {
    let id = req.params.value; 
    let note = notes.find(n => n.id ===id);

    if (note) {

        res.json(note);

    } else {

        let title = req.params.value;
        note = notes.find(n => n.title === title);
        
        if (note) {

            res.json(note);

        } else {

            res.status(404).json({ message: "Note not found" });
        }
    }

});

/*app.get('/notes/title', (req, res) => {
    const TITLE = req.query;
    console.log(TITLE);
    const NOTE = notes.find(n => n.title === TITLE);

    if (NOTE) {
        res.json(NOTE);
    } else {
        res.status(404).json({ message: "Note not found" });
    }

});*/

app.post("/notes", (req, res) => {

    const NewNotes = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content
    };

    notes.push(NewNotes);

    fs.writeFile(NotesFiles, JSON.stringify({ notes: notes }, null, 2), (err) => {

        if (err) {
            //console.error("Error writing to file");
            return res.status(500).json({ message: "Failed to save note" });
        }

        res.status(201).json(NewNotes);
    });

});


app.delete("/notes/:value", (req, res) => {
    const Id = req.params.value;

    const Index = notes.findIndex(n => n.id ===Id);

    if (Index !== -1) {
        const DeletedNote = notes.splice(index, 1)[0];

        fs.writeFile(NotesFiles, JSON.stringify({ notes: notes }, null, 2), (err) => {

            if (err) {
                //console.error("Error writing to file");
                return res.status(500).json({ message: "Failed to delete note" });
            }

            res.json({ message: "Note deleted", note: DeletedNote });
        });
    } else {
        res.status(404).json({ message: "Note not found" });
    }
});



app.listen(port, () => {
    console.log(`Server listening in http://localhost:${port}`);
});