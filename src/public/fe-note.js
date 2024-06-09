document.addEventListener('DOMContentLoaded', function() {
    // defining the variables for each section of the notes and their components
    const notesListSection = document.getElementById('notes-list-section');
    const addNoteSection = document.getElementById('add-note-section');
    const viewNoteSection = document.getElementById('view-note-section');
    const editNoteSection = document.getElementById('edit-note-section');
    const newNoteBtn = document.getElementById('new-note-btn');
    const addNoteForm = document.getElementById('add-note-form');
    const editNoteForm = document.getElementById('edit-note-form');
    const notesList = document.getElementById('notes-list');


  // this is the id of the note that is being edited (says its null so that it is always a default that a note isnt edited (since the user JUST created it))
  let editingNoteId = null; 

    // function to show the section for the notes list
    function showNotesListSection() {
        notesListSection.style.display = 'block'; // we are making this section visible and making the others hidden
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'none';
    }

    // function to show the section to add a note
    function showAddNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'block'; // we are making this section visible and making the others hidden
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'none';
    }

    // function to show the section to view an existing note
    function showViewNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'block'; // we are making this section visible and making the others hidden
        editNoteSection.style.display = 'none';
    }

    // function to show the section to edit an existing note
    function showEditNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'block'; // we are making this section visible and making the others hidden
    }


    
    // when clicking on 'new note' button
    newNoteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showAddNoteSection(); // showing the note section
    })


    
     // clicking on "back" button in add note section
     document.getElementById('backBtnAddNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection(); // showing the list section
    });

    // clicking on "back" button in view note section
    document.getElementById('backBtnViewNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection(); // showing the list section
    }); 


    // clicking on "back" button in edit note section
    document.getElementById('backBtnEditNote').addEventListener('click', function(event) {
        event.preventDefault();
        showViewNoteSection(); // showing the view note section (since the user is editing a note)
    });



// function to fetch the notes from the database
function fetchNotes() {
    fetch('/notes/list') // referencing the endpoint that the notes load from
        .then(res => res.json())
        .then(notes => {
            renderNotes(notes); // once the notes are found in the database, it will then initialize the function to display them on the application
            console.log('List loaded');
        })
        .catch(err => console.error('Error:', err)); // if this doesnt work, then it will print an error
}

// function to render the notes (when the notes have been fetched from the database)
function renderNotes(notes) {
    notesList.innerHTML = ''; // this is to ensure that the list is empty before the notes are loaded

    if (notes.length === 0) { // if there arent any notes made by the user then the following will be done
        const emptyListItem = document.createElement('li');
        console.log('Notes list is empty')
        emptyListItem.textContent = 'You dont have any notes yet. Click on the icon to add one!'; // this is seen instead of any notes. once one is made, this will disappear
        notesList.appendChild(emptyListItem); // append child means to add the element to the list
    } else { // otherwise if there is 1 or more notes, then the following will happen
        notes.forEach(note => { // for each note that is there, it will be encapsulated in an 'li' (list) with the notes title.
            const noteItem = document.createElement('li');
            noteItem.textContent = note.title;
            noteItem.classList.add('note-item'); // this is to add a class to the note item
            noteItem.addEventListener('click', () => showNoteDetails(note)); // this means that when the note is clicked, it will show the details of the note
            notesList.appendChild(noteItem); // append child means to add the element to the list
        })
    }
}

// function to show the details when the note is clicked on
function showNoteDetails(note) {
    console.log(note); // in the inspect log, it will show the contents of the note
    document.getElementById('view-note-title').value = note.title; // get the title of the note
    document.getElementById('view-note-content').value = note.content; // get the content of the note
    editingNoteId = note._id; // the editing note id will be defined if the note will be edited
    showViewNoteSection(); // once all that is loaded, the 'view note' section will be shown
}

 // when the user clicks on the edit note button
 document.getElementById('edit-note-btn').addEventListener('click', function() {
    const title = document.getElementById('view-note-title').value; // getting the titles value of the note
    const content = document.getElementById('view-note-content').value; // getting the content value of the note
    document.getElementById('edit-note-title').value = title; // the title of the note will be shown in the edit note section
    document.getElementById('edit-note-content').value = content; // the content of the note will be shown in the edit note section
    showEditNoteSection(); // showing the edit note section
});

// the event listener when the user presses the submit button to add a note
addNoteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // the note will contain title and content:
    const title = document.getElementById('add-note-title').value;
    const content = document.getElementById('add-note-content').value;

    // referencing the endpoint to add the note
    fetch('/notes', {
        method: 'POST', // showing the method of the request
        headers: {
            'Content-Type': 'application/json' // saying what type of content is being sent
        }, 
        body: JSON.stringify({title, content}) // the body of the request will contain the title and content of the note in a stringified JSON format
    }) 
    .then(res => res.json()) // then the response will be converted to JSON
    .then(note => {
        fetchNotes(); // the notes will be fetched and added to the database which will then be sent to the note list
        showNotesListSection(); // the screen will then show the notes list section
        addNoteForm.reset(); // the form will be reset so it is fresh when the user wants to add a new one
        console.log('Note added:', note); // in the inspect log, it will say a note is added
        showToast('toast-add'); // toast notification will popup to say a note is added
    })
    .catch(err => console.error('Error:', err)); // if none of this works, then the inspect log will say theres been an error
});


// the event listener when the user presses the submit button to edit a note
editNoteForm.addEventListener('submit', function(event) { 
    event.preventDefault();
    const title = document.getElementById('edit-note-title').value;
    const content = document.getElementById('edit-note-content').value;

    // referencing the endpoint to edit the note
    fetch(`/notes/edit/${editingNoteId}`, {
        method: 'PUT', // showing the method of the request
        headers: {
            'Content-Type': 'application/json' // saying what type of content is being sent
        },
        body: JSON.stringify({ title, content }) // the body of the request will contain the title and content of the note in a stringified JSON format
    })
    .then(res => res.json())
    .then(note => {
        fetchNotes(); // the updated note will be fetched and added to the database which will then be sent to the note list
        showNotesListSection(); // the screen will then show the notes list section
        console.log('Note updated:', note); // in the inspect log, it will say a note is updated
        showToast('toast-edit'); // toast notification will popup to say a note is updated
    })
    .catch(err => console.error('Error:', err)); // if none of this works, then the inspect log will say theres been an error
});


// event listener when the user presses the delete button on a note
    document.getElementById('delete-note-btn').addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this?")) { // a confirm alert will popup to say the note will be deleted
            fetch(`/notes/${editingNoteId}`, {method: 'DELETE'}) // mentioning which endpoint this will be referenced to and the method
            .then(res => res.json())
            .then(() => {
                fetchNotes(); // then once the note is deleted, all notes will be fetched and then shown on the list, which will then be shown.
                showNotesListSection(); // show the notes list section
                console.log('Note deleted'); // in the inspect log, it will say a note is deleted
                showToast('toast-delete'); // toast notification will popup to say a note is deleted
            })
            .catch(err => console.error('Error:', err)); // if none of this works, then the inspect log will say theres been an error
        }
    });

    

// function to filter notes based on search input
function filterNotes() {
    var input = document.getElementById('search-note').value.toLowerCase();
    var notes = document.querySelectorAll('.note-item');  
    notes.forEach(note => {  // for each note 
        const title = note.textContent.toLowerCase();  // the title of the note will be converted to lowercase while searched
        note.style.display = title.includes(input) ? '' : 'none'; // if the title includes the input, then the note will be shown, otherwise it will be hidden
    });
    
}

// event listener for search input
document.getElementById('search-note').addEventListener('input', filterNotes);


// function to show the toast notifications
function showToast(toastId) {
    const toast = document.getElementById(toastId);
    toast.classList.add('show'); 
    setTimeout(() => { // setting how long the notification should last
        toast.classList.remove('show');
    }, 2000); // 2000 means 2 seconds
}


// this should always happen when the application is run (even before the user interacts with it)
fetchNotes();
// show the notes list section by default
showNotesListSection();
});