// defining the modules used for the routes in the application
const express = require('express');
const router = express.Router();
const path = require('path');

// defining the note model used to interact with the database (schema)
const Note = require('../models/note');

// for this route, we are using the express middleware to serve the static files (css, html, frontend javascript etc.)
router.use(express.static(path.join(__dirname, 'public')));

// // viewing the html file to show the frontend
// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/notes.html'))
// })

// getting the list of notes
router.get('/notes/list', async (_req, res) => {
    const notes = await Note.find();

    if(!notes) { // if no notes are found (error in the database, not whether a user has posted or not) then it will return a 500 error  - 500 means internal server error
        res.status(500).json({success: false})
    }
    res.status(200).json(notes);
})

// adding a new note into the system
router.post('/notes', async (req, res) => { // defining the array of what is contained in a note
    let note = new Note({
        title: req.body.title,
        content: req.body.content
    });
    const savedNote = await note.save();
    if(!savedNote) { // if the note is not saved then it will return a 404 error - 404 means not found
        return res.status(404).json({message:'The note cannot be created', success: false})
    }
    res.status(201).json(savedNote);
})


// updating a note
router.put('/notes/edit/:id', async (req, res) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { // we are finding the note by the id and updating the title and content
        title: req.body.title,
        content: req.body.content
    }, {new: true}) //

    if(!updatedNote) { // if the note is not updated then it will return a 404 error - 404 means not found
        return res.status(404).json({message: 'The note cannot be updated', success: false})
    } else {
        return res.status(200).json(updatedNote);
    }
})


// deleting a note
router.delete('/notes/:id', async (req, res) => {
    const deletedNote = await Note.findByIdAndDelete(req.params.id); // finding the note by the id and deleting it
        if(deletedNote) { // if it is deleted, then it will say that the note is deleted
            return res.status(200).json({success: true, message: 'Note is deleted'})
        } else {
            return res.status(400).json({success: false, message:'Something isnt working.'});
        }
    });


// exporting the router
module.exports = router;