// adding the important modules for the application
const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// we are creating an instance of the express module
const app = express(); 

// using the express.static middleware to serve the static files (css, html, frontend javascript etc.)
app.use(express.static(path.join(__dirname, 'public')));

// using the body-parser middleware to parse any incoming requests
app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));

// declaring out the port number for the server
app.listen(3000, () => {
    console.log("");
    console.log('Server is running on port 3000');
})

// configuration of the database
mongoose.connect('mongodb+srv://lee-vartha:hyp1ricuMLeuc5thoe@notepad.lrtnanc.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("");
    console.log('Connected to MongoDB!');
}) .catch(err => { // if the database doesnt work then it will print an error message
    console.error('Error:', err.message);
})

// const db = mongoose.connection;

const api = process.env.API_URL

//handlers for the routes
const noteRoute = require(`./routes/notes.js`);

// using the note route for the application
app.use('/', noteRoute);


// for the initialization, we are getting the notes.html file from the public folder and sending it to the user for them to access.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

// exporting the app module
module.exports = app;