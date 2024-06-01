document.addEventListener('DOMContentLoaded', function() {
    const notesListSection = document.getElementById('notes-list-section');
    const addNoteSection = document.getElementById('add-note-section');
    const viewNoteSection = document.getElementById('view-note-section');
    const editNoteSection = document.getElementById('edit-note-section');
    const newNoteBtn = document.getElementById('new-note-btn');
    const addNoteForm = document.getElementById('add-note-form');
    const editNoteForm = document.getElementById('edit-note-form');
    const backButton = document.getElementById('back-btn');
    const notesList = document.getElementById('notes-list');
    const viewNoteForm = document.getElementById('view-note-form');

    let editingNoteId = null;

    function showNotesListSection() {
        notesListSection.style.display = 'block';
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'none';
    }

    function showAddNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'block';
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'none';
    }

    function showViewNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'block';
        editNoteSection.style.display = 'none';
    }

    function showEditNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'none';
        viewNoteSection.style.display = 'none';
        editNoteSection.style.display = 'block';
    }

// Ensure that this function fetches the notes list correctly
function fetchNotes() {
    fetch('/notes/list')
        .then(res => res.json())
        .then(notes => {
            renderNotes(notes);
            console.log('List loaded');
        })
        .catch(err => console.error('Error:', err));
}

// Verify that this function properly renders the notes list
function renderNotes(notes) {
    notesList.innerHTML = '';

    if (notes.length === 0) {
        const emptyListItem = document.createElement('li');
        console.log('Notes list is empty')
        emptyListItem.textContent = 'You dont have any notes yet. Click on the icon to add one!';
        notesList.appendChild(emptyListItem);
    } else {
        notes.forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.textContent = note.title;
            noteItem.classList.add('note-item');
            noteItem.addEventListener('click', () => showNoteDetails(note));
            notesList.appendChild(noteItem);
        })
    }
}

// Ensure that this function properly shows the details of a selected note
function showNoteDetails(note) {
    console.log(note);
    document.getElementById('view-note-title').value = note.title;
    document.getElementById('view-note-content').value = note.content;
    editingNoteId = note._id;
    showViewNoteSection();
}

    addNoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('add-note-title').value;
        const content = document.getElementById('add-note-content').value;
    
        fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, content})
        })
        .then(res => res.json())
        .then(note => {
            fetchNotes();
            showNotesListSection();
            addNoteForm.reset();
            console.log('Note added:', note);
            showToast('toast-add');
        })
        .catch(err => console.error('Error:', err));
    });
    
    editNoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('edit-note-title').value;
        const content = document.getElementById('edit-note-content').value;
    
        fetch(`/notes/edit/${editingNoteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(res => res.json())
        .then(note => {
            fetchNotes();
            showNotesListSection();
            console.log('Note updated:', note);
            showToast('toast-edit');
        })
        .catch(err => console.error('Error:', err));
    });


    document.getElementById('delete-note-btn').addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm("Are you sure you want to delete this?")) {
            fetch(`/notes/${editingNoteId}`, {method: 'DELETE'})
            .then(res => res.json())
            .then(() => {
                fetchNotes();
                showNotesListSection();
                console.log('Note deleted');
                showToast('toast-delete');
            })
            .catch(err => console.error('Error:', err));    
        }
    });


    // when clicking on 'new note' button
    newNoteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showAddNoteSection();
    })


    
     // clicking on "back" button in add note section
     document.getElementById('backBtnAddNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection();
    });

    // clicking on "back" button in view note section
    document.getElementById('backBtnViewNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection();
    });


    // clicking on "back" button in edit note section
    document.getElementById('backBtnEditNote').addEventListener('click', function(event) {
    event.preventDefault();
    showViewNoteSection();
});


  document.getElementById('edit-note-btn').addEventListener('click', function() {
    const title = document.getElementById('view-note-title').value;
    const content = document.getElementById('view-note-content').value;
    document.getElementById('edit-note-title').value = title;
    document.getElementById('edit-note-content').value = content;
    showEditNoteSection();
});





// function to filter notes based on search input
function filterNotes() {
    var input = document.getElementById('search-note').value.toLowerCase();
    var notes = document.querySelectorAll('.note-item'); 
    notes.forEach(note => { 
        const title = note.textContent.toLowerCase(); 
        note.style.display = title.includes(input) ? '' : 'none';
    });
}

// event listener for search input
document.getElementById('search-note').addEventListener('input', filterNotes);


function showToast(toastId) {
    const toast = document.getElementById(toastId);
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}


// Initial fetch of notes when the page loads
fetchNotes();
// Show the notes list section by default
showNotesListSection();
});