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

    let editingIndex = -1;

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


    // when clicking on 'new note' button
    newNoteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showAddNoteSection();
        editingIndex = -1; 
    })

     // Event listener for form submission (adding note)
     addNoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        saveOrUpdateNote();
        editingIndex = -1; 
    });


     // event listener for form submission (editing note)
     editNoteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        saveOrUpdateNote();
    });


    // when clicking on 'edit' button in the view note section
    document.getElementById('edit-note-btn').addEventListener('click', function(event) {
        event.preventDefault();
        showEditNoteSection();

        var title = document.getElementById('view-note-title').value;
        var content = document.getElementById('view-note-content').value;
        document.getElementById('edit-note-title').value = title;
        document.getElementById('edit-note-content').value = content;
    });

    // when clicking on 'delete' button in the view note section
    document.getElementById('delete-note-btn').addEventListener('click', function(event) {
        event.preventDefault();
        var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        alert("Are you sure you want to delete this note?");
        storedNotes.splice(editingIndex, 1);
        localStorage.setItem('notes', JSON.stringify(storedNotes));
        showNotesListSection();
        renderNotes();
        editingIndex = -1;
    });


     // clicking on "back" button in add note section
     document.getElementById('backBtnAddNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection();
        editingIndex = -1; 
    });

    // clicking on "back" button in view note section
    document.getElementById('backBtnViewNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection();
        editingIndex = -1;
    });


    // clicking on "back" button in edit note section
    document.getElementById('backBtnEditNote').addEventListener('click', function(event) {
    event.preventDefault();
    showViewNoteSection();
    editingIndex = -1;
});


    // function to render notes list
function renderNotes() {
    var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    notesList.innerHTML = '';

    if (storedNotes.length === 0) {
        var emptyListItem = document.createElement('li');
        emptyListItem.textContent = 'You dont have any notes yet. Click on the icon to add one!';
        
    
        // Append the list item to the notes list
        notesList.appendChild(emptyListItem);
    }
    
        
    
    storedNotes.forEach(function(note, index) {
        var listItem = document.createElement('li');
        listItem.classList.add('note-item'); 

        // creating a container div for note title
        var noteContainer = document.createElement('div');
        noteContainer.classList.add('note-container');

        // creating a span for note title
        var titleSpan = document.createElement('span');
        titleSpan.textContent = note.title;
        noteContainer.appendChild(titleSpan);

        listItem.appendChild(noteContainer);

        // event listener to display note content on click
        listItem.addEventListener('click', function() {
            showViewNoteSection();
            document.getElementById('view-note-title').value = note.title;
            document.getElementById('view-note-content').value = note.content;
            editingIndex = index; 
        });

        

        notesList.appendChild(listItem); 
    });
}

showNotesListSection();
renderNotes();



    // Function to handle adding or updating a note
    function saveOrUpdateNote() {
        var title, content;

        if (editingIndex !== -1) {
            title = document.getElementById('edit-note-title').value;
            content = document.getElementById('edit-note-content').value;
        } else {
            title = document.getElementById('add-note-title').value;
            content = document.getElementById('add-note-content').value;
        }

        if (title.trim() !== '' && content.trim() !== '') {
            var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];

            if (editingIndex === -1) {
                storedNotes.push({ title: title, content: content });
            } else {
                storedNotes[editingIndex] = { title: title, content: content };
            }

            
            localStorage.setItem('notes', JSON.stringify(storedNotes));
            showNotesListSection(); 
            renderNotes(); 
            addNoteForm.reset(); 
            editNoteForm.reset(); 
            editingIndex = -1; 
        }
    }


    // Function to filter notes based on search input
function filterNotes() {
    var input = document.getElementById('search-note').value.toLowerCase();
    var notes = document.querySelectorAll('.note-item'); 
    notes.forEach(function(note) { 
        var title = note.textContent.toLowerCase(); 
        if (title.includes(input)) { 
            note.style.display = ''; 
        } else {
            note.style.display = 'none'; 
            
        }
    });
}

// Event listener for search input
document.getElementById('search-note').addEventListener('input', filterNotes);


})