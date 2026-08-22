let allNotes = [];


// =========================
// SAVE NOTE
// =========================

async function saveNote() {

    const input = document.getElementById("noteInput");

    const content = input.value.trim();


    if (!content) {

    showCatMessage(
        "/static/cat6.png",
        "Please write something first!"
    );

    return;
}


    try {

        const response = await fetch("/notes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                content: content
            })

        });


        if (!response.ok) {

            throw new Error("Failed to save note");

        }


        input.value = "";

        await loadNotes();

    }

    catch (error) {

        console.error(error);

        alert("😿 Something went wrong while saving your note.");

    }
}



// =========================
// LOAD NOTES
// =========================

async function loadNotes() {

    try {

        const response = await fetch("/notes");

        allNotes = await response.json();

        displayNotes(allNotes);

    }

    catch (error) {

        console.error(error);

    }
}



// =========================
// DISPLAY NOTES
// =========================

function displayNotes(notes) {

    const notesDiv = document.getElementById("notes");

    notesDiv.innerHTML = "";


   if (notes.length === 0) {

    notesDiv.innerHTML = `
        <div class="empty">

            <img
                src="/static/cat5.png"
                alt="Cute cat"
                class="empty-cat"
            >

            <div class="empty-text">
                No notes yet... 🐾
            </div>

            <small>
                Write your first note above! 💗
            </small>

        </div>
    `;

    return;
}


    notes.forEach((note, index) => {

        const div = document.createElement("div");

        div.className = "note";


        
      // Different cat image for each note
const cats = [
    "cat7.png",
    "cat8.png",
    "cat9.png",
    "cat10.png"
];

const cat = cats[index % cats.length];


        div.innerHTML = `

           <div class="note-cat">
    <img
        src="/static/${cat}"
        alt="Cute cat"
        class="saved-cat-image"
    >
</div>

            <div class="note-content">

                <div class="note-text">
                    ${escapeHTML(note.content)}
                </div>

                <div class="note-date">
                    🕐 ${note.created_at}
                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteNote(${note.id})"
                title="Delete note"
            >
                🗑️
            </button>

        `;


        notesDiv.appendChild(div);

    });

}



// =========================
// DELETE NOTE
// =========================

async function deleteNote(id) {

    const confirmDelete = confirm(
        "🐱 Are you sure you want to delete this note?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(`/notes/${id}`, {

            method: "DELETE"

        });


        if (!response.ok) {

            throw new Error("Failed to delete note");

        }


        await loadNotes();

    }

    catch (error) {

        console.error(error);

        alert("😿 Could not delete the note.");

    }

}



// =========================
// SEARCH NOTES
// =========================

function searchNotes() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const filteredNotes = allNotes.filter(note =>

        note.content.toLowerCase().includes(search)

    );


    displayNotes(filteredNotes);

}



// =========================
// SECURITY
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}



// =========================
// LOAD WHEN PAGE OPENS
// =========================

loadNotes();
function showCatMessage(image, message) {

    const oldMessage = document.querySelector(".cat-message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const box = document.createElement("div");

    box.className = "cat-message";

    box.innerHTML = `
        <img src="${image}" alt="Cute cat">

        <div class="cat-message-text">
            ${message}
        </div>

        <button onclick="this.parentElement.remove()">
            Okay 🐾
        </button>
    `;

    document.body.appendChild(box);
}