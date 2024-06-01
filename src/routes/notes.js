const express = require('express');
const router = express.Router();
const path = require('path');

const Note = require('../models/note');

router.use(express.static(path.join(__dirname, 'public')));

// viewing the html file to show the frontend
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
})

// getting the list of notes
router.get('/notes/list', async (req, res) => {
    const notes = await Note.find();

    if(!notes) {
        res.status(500).json({success: false})
    }
    res.status(200).json(notes);
})

// adding a new note into the system
router.post('/notes', async (req, res) => {
    let note = new Note({
        title: req.body.title,
        content: req.body.content,
        user: req.user._id
    });
    const savedNote = await note.save();
    if(!savedNote) {
        return res.status(404).json({message:'The note cannot be created', success: false})
    }
    res.status(201).json(savedNote);
})


// updating a note
router.put('/notes/edit/:id', async (req, res) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content,
        user: req.user._id
    }, {new: true})

    if(!updatedNote) {
        return res.status(404).json({message: 'The note cannot be updated', success: false})
    } else {
        return res.status(200).json(updatedNote);
    }
})

router.delete('/notes/:id', async (req, res) => {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if(deletedNote) {
            return res.status(200).json({success: true, message: 'Note is deleted'})
        } else {
            return res.status(400).json({success: false, message:'Something isnt working.'});
        }
    });



module.exports = router;