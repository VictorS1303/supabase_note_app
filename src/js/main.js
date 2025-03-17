
const notesContainer = document.querySelector('.notes-container');
const noteTitle = document.querySelector('.note-title');
const noteBody = document.querySelector('.note-body');
const createNoteModal = document.querySelector('.create-note-modal');
const openCreateNotePopoverModalBtn = document.getElementById('open_create_ote_popover_modal_btn');
const submitCreateNoteButton = document.querySelector('#submit_create_note_btn');
const createNoteForm = document.querySelector('#create_note_form');
const noteTitleInputField = document.querySelector('#note_title_input')
const noteTextInputField = document.querySelector('#note_body_text_input')
const editNoteModal = document.querySelector('#edit_note_modal')
const editNoteForm = document.querySelector('#edit_note_form')
const deleteNoteModal = document.querySelector('#delete_note_modal')
const deleteNoteModalCloseBtn = document.querySelector('#delete_note_modal_close_btn')
const deleteNoteModalButtonsContainer = document.querySelector('#delete_note_modal_buttons_container')


// EVENT LISTENERS //
openCreateNotePopoverModalBtn.addEventListener('mouseenter', updateCreateNoteButtonBackgroundColor);
openCreateNotePopoverModalBtn.addEventListener('click', openCreateNoteModal);
openCreateNotePopoverModalBtn.addEventListener('mouseleave', resetCreateNoteButtonBackgroundColor);
createNoteForm.addEventListener('submit', (e) => validateSubmitForm(e));
deleteNoteModalButtonsContainer.addEventListener('click', (e) => confirmNoteDeleteAction(e))
deleteNoteModalCloseBtn.addEventListener('click', closeDeleteNoteModal)
editNoteForm.addEventListener('submit', (e) => validateEditForm(e))




// FUNCTIONS //

// Update Create Note Button Background Color
function updateCreateNoteButtonBackgroundColor()
{
    openCreateNotePopoverModalBtn.style.backgroundColor = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}

// Reset Create Note Button Background Color
function resetCreateNoteButtonBackgroundColor()
{
    openCreateNotePopoverModalBtn.style.backgroundColor = null;
}

// Open Note Modal
function openCreateNoteModal()
{
    createNoteModal.showModal();
}

// Close Note Modal
function closeCreateNoteModal()
{
    createNoteModal.close();
}

// Create Note
function createNote(title, body)
{
    const note = createNoteContainer(`note ${randomNoteStyle()}-note`);
    const noteTitle = createNoteTitle('note-title');
    noteTitle.textContent = title;

    const noteText = createNoteText('note-body');
    noteText.textContent = body;

    const editNoteButton = createEditNoteButton('btn edit-note-btn');
    const deleteNoteButton = createDeleteNoteButton('btn delete-note-btn');

    // Create container for buttons and append buttons inside
    const noteButtonsContainer = createNoteButtonsContainer('note-buttons-container');
    noteButtonsContainer.append(editNoteButton, deleteNoteButton);

    // Append elements to the note
    note.append(noteTitle, noteText, noteButtonsContainer);
    notesContainer.appendChild(note);
}

function randomNoteStyle()
{
    const noteClasses = ['primary', 'secondary', 'tertiary', 'quaternary'];
    const randomNoteClass = noteClasses[Math.floor(Math.random() * noteClasses.length)];
    return randomNoteClass;
}

function createNoteContainer(noteContainerClasses)
{
    const noteContainer = document.createElement('article');
    noteContainer.className = noteContainerClasses;
    return noteContainer;
}

function createNoteTitle(noteTitleClasses)
{
    const noteTitle = document.createElement('h3');
    noteTitle.className = noteTitleClasses;
    return noteTitle;
}

function createNoteText(noteTextClasses)
{
    const noteText = document.createElement('p');
    noteText.className = noteTextClasses;
    return noteText;
}

function createNoteButtonsContainer(noteButtonsContainerClasses)
{
    const noteButtonsContainer = document.createElement('div');
    noteButtonsContainer.className = noteButtonsContainerClasses;
    noteButtonsContainer.addEventListener('click', (e) => updateNote(e))

    return noteButtonsContainer;
}

function createEditNoteButton(editNoteButtonClasses)
{
    const editNoteButton = document.createElement('button');
    editNoteButton.className = editNoteButtonClasses;

    // Create the pencil icon element
    const editNoteButtonIcon = document.createElement('i');
    editNoteButtonIcon.className = "fas fa-pencil-alt"; // FontAwesome class

    // Append icon to button
    editNoteButton.appendChild(editNoteButtonIcon);

    return editNoteButton;
}

function createDeleteNoteButton(deleteNoteButtonClasses)
{
    const deleteNoteButton = document.createElement('button');
    deleteNoteButton.className = deleteNoteButtonClasses;
    
    // Create the trash icon element
    const deleteNoteButtonIcon = document.createElement('i');
    deleteNoteButtonIcon.className = "fas fa-trash-alt"; // FontAwesome class

    // Append icon to button
    deleteNoteButton.appendChild(deleteNoteButtonIcon);

    return deleteNoteButton;
}

function validateSubmitForm(e)
{
    e.preventDefault()

    if(noteTitleInputField.value.trim() === '' || noteTextInputField.value.trim() == '')
    {
        alert('Please fill out both fields correctly')
        return
    }
    else
    {
        submitNoteForm(e)
    }
}

// Submit Note Form
function submitNoteForm(e)
{
    e.preventDefault()

    const formData = new FormData(createNoteForm)
    const noteTitle = formData.get('note-title')
    const noteBody = formData.get('note-body')

    // Create Note with form data
    createNote(noteTitle, noteBody)

    // Close create note modal on submit
    closeCreateNoteModal()

    // Clear create note form inputs on submit
    clearOpenDialogInputs()

}

function updateNote(e)
{
    if(e.target.matches('.edit-note-btn'))
    {
       editNote(e)
    }
    else if(e.target.matches('.delete-note-btn'))
    {
        showDeleteNoteModal(e.target.closest('.note'))
    }
}

function clearOpenDialogInputs()
{
    const createNoteFormInputs = createNoteForm.querySelectorAll('input, textarea')
    createNoteFormInputs.forEach(input => input.value = '')
}


function deleteNote(e)
{
    closeDeleteNoteModal()
    e.target.closest('.note').remove()
}

function showDeleteNoteModal(note)
{
    // Store reference to the note, from within which the delete note modal is triggered
    noteToDelete = note
    deleteNoteModal.showModal()
}

function closeDeleteNoteModal()
{
    deleteNoteModal.close()
}

let noteToDelete

function confirmNoteDeleteAction(e)
{
    if(e.target.matches('.cancel-deletion-btn'))
    {
        closeDeleteNoteModal()
    }
    else if(e.target.matches('.confirm-deletion-btn'))
    {
        checkIfNoteToDeleteExists()
    }
}

// Check if note to delete exists
function checkIfNoteToDeleteExists()
{
    if(noteToDelete)
    {
        noteToDelete.remove()
        noteToDelete = null
        closeDeleteNoteModal()
    }
}

let noteToEdit
function editNote(e)
{
    noteToEdit = e.target.closest('.note')

    if(!noteToEdit)
    {
        return
    }
    else
    {
        editNoteModal.showModal()
        checkIfNoteToEditExists()
    }
}

// Check if note to edit exists
function checkIfNoteToEditExists()
{
    const noteTitle = noteToEdit.querySelector('.note-title').textContent
    const noteBody = noteToEdit.querySelector('.note-body').textContent

    document.querySelector('#edit_note_title_input').value = noteTitle
    document.querySelector('#edit_note_body_text_input').value = noteBody


}

let editedNote
// Submit edited note
function validateEditForm(e)
{
    e.preventDefault()
    
    if (!noteToEdit)
    {
        return
    }

    // Get new input values
    const updatedTitle = document.querySelector('#edit_note_title_input').value.trim()
    const updatedBody = document.querySelector('#edit_note_body_text_input').value.trim()

    if (updatedTitle === '' || updatedBody === '') {
        alert('Both fields must be filled out!')
        return
    }

    // Update the existing note's title and body
    noteToEdit.querySelector('.note-title').textContent = updatedTitle
    noteToEdit.querySelector('.note-body').textContent = updatedBody

    // Close edit modal after updating
    editNoteModal.close()

    // Clear modal inputs
    document.querySelector('#edit_note_title_input').value = ''
    document.querySelector('#edit_note_body_text_input').value = ''

    // Reset reference
    noteToEdit = null
}