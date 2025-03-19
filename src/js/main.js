
import { supabase } from './supabase.js'

const notesContainer = document.querySelector('.notes-container')
const createNoteModal = document.querySelector('.create-note-modal')
const openCreateNotePopoverModalBtn = document.getElementById('open_create_note_popover_modal_btn')
const createNoteForm = document.querySelector('#create_note_form')
const noteTitleInputField = document.querySelector('#note_title_input')
const noteTextInputField = document.querySelector('#note_body_text_input')
const editNoteModal = document.querySelector('#edit_note_modal')
const editNoteForm = document.querySelector('#edit_note_form')
const deleteNoteModal = document.querySelector('#delete_note_modal')
const deleteNoteModalButtonsContainer = document.querySelector('#delete_note_modal_buttons_container')
const deleteAllNotesModal = document.querySelector('#delete_all_notes_modal')
const deleteAllNotesModalOpenBtn = document.querySelector('#delete_all_notes_modal_btn')
const closeModalBtns = document.querySelectorAll('.modal-close-btn')
const cancelBtns = document.querySelectorAll('.cancel-btn')
const deleteAllNotesBtn = document.querySelector('#confirm_all_notes_deletion_btn')
const filterInput = document.querySelector('#filter_input')


// EVENT LISTENERS //
openCreateNotePopoverModalBtn.addEventListener('mouseenter', updateCreateNoteButtonBackgroundColor)
openCreateNotePopoverModalBtn.addEventListener('click', openCreateNoteModal)
openCreateNotePopoverModalBtn.addEventListener('mouseleave', resetCreateNoteButtonBackgroundColor)
createNoteForm.addEventListener('submit', (e) => validateSubmitForm(e))
deleteNoteModalButtonsContainer.addEventListener('click', (e) => confirmNoteDeleteAction(e))
editNoteForm.addEventListener('submit', (e) => validateEditForm(e))
closeModalBtns.forEach((closeModalBtn) => closeModalBtn.addEventListener('click', (e) => closeModal(e)))
deleteAllNotesModalOpenBtn.addEventListener('click', openDeleteAllNotesModal)
cancelBtns.forEach((cancelBtn) => cancelBtn.addEventListener('click', (e) => cancelModal(e)))
deleteAllNotesBtn.addEventListener('click', deleteAllNotes)
filterInput.addEventListener('input', filterNotes)

// FUNCTIONS //

// Display delete all notes button
function displayDeleteAllNotesButton()
{
    notesContainer.children.length >= 1 ? deleteAllNotesModalOpenBtn.classList.add('active') : deleteAllNotesModalOpenBtn.classList.remove('active')
}



// FIlter notes
async function filterNotes()
{
    const filterText = filterInput.value.trim().toLowerCase() // Get and normalize filter text

    if (!filterText)
    {
        // If the input is empty, fetch all notes
        fetchNotes()
        return
    }

    // Query Supabase to fetch notes where note_title contains the filterText
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .ilike('note_title', `%${filterText}%`)  // 'ilike' is case-insensitive
        .order('created_at', { ascending: true })

    if (error)
    {
        console.error("Error fetching filtered notes:", error)
        return
    }

    hideNotes(data)

    // Clear current notes and render the filtered ones
    notesContainer.innerHTML = ''
    data.forEach((note) => createNote(note.id, note.note_title, note.note_text, note.note_style))

    // Update the delete button state after filtering
    displayDeleteAllNotesButton()
}

function hideNotes(data, filterText)
{
    // Loop through each note and apply the filter logic
    notesContainer.innerHTML = '' // Clear the container before rendering

    data.forEach((note) =>
    {
        const noteElement = createNote(note.id, note.note_title, note.note_text, note.note_style)

        // If the note title doesn't match the filter text, add the 'hidden' class
        if (filterText && !note.note_title.toLowerCase().includes(filterText))
        {
            noteElement.classList.add('hidden')
        }

        // Append the note to the container (whether hidden or not)
        notesContainer.appendChild(noteElement)
    })
}


// Close Modal
function closeModal(e)
{
    const modal = e.target.closest('dialog')
    modal.close()
}

// Cancel Modal
function cancelModal(e)
{
    if (e.target.matches('.cancel-btn'))
    {
        closeModal(e)
    }
}

// Update Create Note Button Background Color
function updateCreateNoteButtonBackgroundColor()
{
    openCreateNotePopoverModalBtn.style.backgroundColor = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
}

// Reset Create Note Button Background Color
function resetCreateNoteButtonBackgroundColor()
{
    openCreateNotePopoverModalBtn.style.backgroundColor = null
}

// Open Note Modal
function openCreateNoteModal()
{
    createNoteModal.showModal()
}

// Open Delete All Notes Modal
function openDeleteAllNotesModal()
{
    deleteAllNotesModal.showModal()
}

// Create Note
function createNote(id, title, body, style)
{
    const note = createNoteContainer(`note ${style}-note`)
    note.setAttribute('data-id', id)
    const noteTitle = createNoteTitle('note-title')
    noteTitle.textContent = title

    const noteText = createNoteText('note-body')
    noteText.textContent = body

    const editNoteButton = createEditNoteButton('btn edit-note-btn')
    const deleteNoteButton = createDeleteNoteButton('btn delete-note-btn')

    // Create container for buttons and append buttons inside
    const noteButtonsContainer = createNoteButtonsContainer('note-buttons-container')
    noteButtonsContainer.append(editNoteButton, deleteNoteButton)

    // Append elements to the note
    note.append(noteTitle, noteText, noteButtonsContainer)
    notesContainer.appendChild(note)
}

// Fetch notes
async function fetchNotes()
{
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: true })

    notesContainer.innerHTML = ''
    data.forEach((note) => createNote(note.id, note.note_title, note.note_text, note.note_style))

    // Ensure the delete button state is correct after fetching notes
    displayDeleteAllNotesButton()
}
fetchNotes()


function randomNoteStyle()
{
    const noteClasses = ['primary', 'secondary', 'tertiary', 'quaternary']
    const randomNoteClass = noteClasses[Math.floor(Math.random() * noteClasses.length)]
    return randomNoteClass
}

function createNoteContainer(noteContainerClasses)
{
    const noteContainer = document.createElement('article')
    noteContainer.className = noteContainerClasses
    return noteContainer
}

function createNoteTitle(noteTitleClasses)
{
    const noteTitle = document.createElement('h3')
    noteTitle.className = noteTitleClasses
    return noteTitle
}

function createNoteText(noteTextClasses)
{
    const noteText = document.createElement('p')
    noteText.className = noteTextClasses
    return noteText
}

function createNoteButtonsContainer(noteButtonsContainerClasses)
{
    const noteButtonsContainer = document.createElement('div')
    noteButtonsContainer.className = noteButtonsContainerClasses
    noteButtonsContainer.addEventListener('click', (e) => updateNote(e))

    return noteButtonsContainer
}

function createEditNoteButton(editNoteButtonClasses)
{
    const editNoteButton = document.createElement('button')
    editNoteButton.className = editNoteButtonClasses

    // Create the pencil icon element
    const editNoteButtonIcon = document.createElement('i')
    editNoteButtonIcon.className = "fas fa-pencil-alt" // FontAwesome class

    // Append icon to button
    editNoteButton.appendChild(editNoteButtonIcon)

    return editNoteButton
}

function createDeleteNoteButton(deleteNoteButtonClasses)
{
    const deleteNoteButton = document.createElement('button')
    deleteNoteButton.className = deleteNoteButtonClasses

    // Create the trash icon element
    const deleteNoteButtonIcon = document.createElement('i')
    deleteNoteButtonIcon.className = "fas fa-trash-alt" // FontAwesome class

    // Append icon to button
    deleteNoteButton.appendChild(deleteNoteButtonIcon)

    return deleteNoteButton
}

function validateSubmitForm(e)
{
    e.preventDefault()

    if (noteTitleInputField.value.trim() === '' || noteTextInputField.value.trim() == '')
    {
        alert('Please fill out both fields correctly')
        return
    }
    else
    {
        submitNoteForm(e)
        closeModal(e)
        fetchNotes()
    }
}

// Submit Note Form
async function submitNoteForm(e)
{
    e.preventDefault()

    const formData = new FormData(createNoteForm)
    const noteTitle = formData.get('note-title')
    const noteBody = formData.get('note-body')
    const noteStyle = randomNoteStyle()

    const { data, error } = await supabase.from('notes').insert({
        note_title: noteTitle,
        note_text: noteBody,
        note_style: noteStyle,
    }).select()

    if (error)
    {
        console.error("Error inserting note:", error)
        return
    }

    // ✅ Use returned data to get the inserted note ID
    createNote(data.id, noteTitle, noteBody, noteStyle)

    clearOpenDialogInputs()
    fetchNotes()
}

function updateNote(e)
{
    if (e.target.matches('.edit-note-btn'))
    {
        editNote(e)
    }
    else if (e.target.matches('.delete-note-btn'))
    {
        showDeleteNoteModal(e.target.closest('.note'))
    }
}

function clearOpenDialogInputs()
{
    const createNoteFormInputs = createNoteForm.querySelectorAll('input, textarea')
    createNoteFormInputs.forEach(input => input.value = '')
}


async function deleteNote(note, e)
{
    const noteId = note.getAttribute('data-id')

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

    if (error)
    {
        console.error("Error deleting note:", error)
        return
    }

    note.remove()
    closeModal(e)

    // Update the delete button state
    displayDeleteAllNotesButton()

    noteToDelete = null
}

function showDeleteNoteModal(note)
{
    // Store reference to the note, from within which the delete note modal is triggered
    noteToDelete = note
    deleteNoteModal.showModal()
}


let noteToDelete

function confirmNoteDeleteAction(e)
{
    if (e.target.matches('.confirm-deletion-btn'))
    {
        if (noteToDelete, e)
        {
            deleteNote(noteToDelete, e)
        }
    }

    closeModal(e)
}


let noteToEdit
function editNote(e)
{
    noteToEdit = e.target.closest('.note')

    if (!noteToEdit)
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
async function validateEditForm(e)
{
    e.preventDefault()



    // Get the new values from input fields
    const updatedTitle = document.querySelector('#edit_note_title_input').value.trim()
    const updatedBody = document.querySelector('#edit_note_body_text_input').value.trim()

    // Check if both fields are filled
    if (!updatedTitle || !updatedBody)
    {
        alert('Both fields must be filled out!')
        return
    }

    // Extract the note ID (assuming it's stored as a data attribute in the note row)
    const noteId = noteToEdit.dataset.id


    // Update the note in the database
    const { error } = await supabase
        .from('notes')
        .update({ note_title: updatedTitle, note_text: updatedBody })
        .eq('id', noteId)  // Ensure the update is applied to the correct note

    // Close the edit modal
    closeModal(e)

    // Clear modal input fields
    document.querySelector('#edit_note_title_input').value = ''
    document.querySelector('#edit_note_body_text_input').value = ''

    // Reset the reference to the edited note
    noteToEdit = null

    fetchNotes()
}

// Delete all notes
async function deleteAllNotes(e)
{
    const { data, error } = await supabase
        .from('notes')
        .delete()
        .neq('id', 0)

    fetchNotes()
    closeModal(e)
}