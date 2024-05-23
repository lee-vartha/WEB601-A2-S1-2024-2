document.addEventListener('DOMContentLoaded', function() {
    const notesListSection = document.getElementById('notes-list-section');
    const addNoteSection = document.getElementById('add-note-section');
    const backButton = document.getElementById('back-btn');
    const newNoteBtn = document.getElementById('new-note-btn');

    showNotesListSection();
    
    function showNotesListSection() {
        notesListSection.style.display = 'block';
        addNoteSection.style.display = 'none';
    }

    function showAddNoteSection() {
        notesListSection.style.display = 'none';
        addNoteSection.style.display = 'block';
    }

    
    newNoteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showAddNoteSection();
    })

     // Event listener for clicking on "back" button in add note section
     document.getElementById('backBtnAddNote').addEventListener('click', function(event) {
        event.preventDefault();
        showNotesListSection();
        editingIndex = -1; // Reset editing index when going back
    });
})