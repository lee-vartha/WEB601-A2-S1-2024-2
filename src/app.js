const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Note = require('./models/note');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("");
    console.log('Server is running on port 3000');
})

mongoose.connect('mongodb+srv://lee-vartha:hyp1ricuMLeuc5thoe@notepad.lrtnanc.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("");
    console.log('Connected to MongoDB!');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/notes/list', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/notes', async (req,res) => {
    const {title, content} = req.body;
    try {
        const newNote = new Note({
            title, 
            content
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json(err)
    }
});

app.put('/notes/:id', async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
    try {
        const updatedNote = await Note.findByIdAndUpdate(id, {title, content}, {new: true});
        if (updatedNote) {
            res.status(200).json(updatedNote);
        } else {
            res.status(404).json(err);
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

app.delete('/notes/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletedNote = await Note.findByIdAndDelete(id);
    if (deletedNote) {
        res.status(200).json(deletedNote);
    } else {
        res.status(404).json({message: 'Note not found'});
    }
    } catch(err) {
        res.status(500).json(err);
    }
})




module.exports = app;