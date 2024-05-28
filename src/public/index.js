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

    function fetchNotes() {
        fetch('/notes/list')
        .then(res => res.json())
        .then(notes => {
            renderNotes(notes);
        })
        .catch(err => console.error('Error:', err));
    }


    // function to render notes list - has been modified to adjust to the API structure
    // using the local storage was temporary, now we will fetch the notes from the API
    function renderNotes(notes) {
        notesList.innerHTML = '';
    
        if (notes.length === 0) {
            const emptyListItem = document.createElement('li');
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
    
    function showNoteDetails(note) {
        document.getElementById('view-note-title').textContent = note.title;
        document.getElementById('view-note-content').textContent = note.content;
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
            showToast('toast-add');
        })
        .catch(err => console.error('Error:', err));
    });
    
    editNoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('edit-note-title').value;
        const content = document.getElementById('edit-note-content').value;
    
        fetch(`/notes/${editingNoteId}`, {
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
    const title = document.getElementById('view-note-title').textContent;
    const content = document.getElementById('view-note-content').textContent;
    document.getElementById('edit-note-title').value = title;
    document.getElementById('edit-note-content').value = content;
    showEditNoteSection();
})





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