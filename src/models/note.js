// defining the modules
const mongoose = require('mongoose'); 
// defining the schema
const Schema = mongoose.Schema;

// making a noteSchema variable for the schema - defining what a note should include
const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: { // this is only seen in the MongoDB database
        type: Date,
        default: Date.now
    }
});

// module.exports is used to export the schema to be used in the application
module.exports = mongoose.model('Note', noteSchema);