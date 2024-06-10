const addNoteBtn = document.getElementById("addNoteBtn");
const saveBtn = document.getElementById("saveBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const captureArea = document.getElementById("captureArea");
const body = document.body;
let colors = ["yellow", "blue", "pink", "green"]; // posits colors
let noteCount = 1;

addNoteBtn.addEventListener("click", () => {
    const newNote = document.createElement("div");
    newNote.className = `box stickynote ${colors[noteCount % colors.length]} captureArea`;
    newNote.style.top = `${noteCount * 30}px`;
    newNote.style.left = `${noteCount * 30}px`;

    const textarea = document.createElement("textarea");
    textarea.className = "content";
    textarea.placeholder = "Escribe aquí...";
    newNote.appendChild(textarea);

    captureArea.appendChild(newNote);
    makeDraggable(newNote);
    noteCount++;
});

saveBtn.addEventListener("click", () => {
    html2canvas(captureArea, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scale: 2,
    }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg");
        link.download = "stickynotes.jpg";
        link.click();
    });
});

toggleModeBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
});

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("stickynotes"));
    if (savedNotes) {
        savedNotes.forEach((noteData) => {
            const newNote = document.createElement("div");
            newNote.className = `box stickynote ${noteData.color}`;
            newNote.style.top = noteData.top;
            newNote.style.left = noteData.left;

            const textarea = document.createElement("textarea");
            textarea.className = "content";
            textarea.value = noteData.content;
            newNote.appendChild(textarea);

            captureArea.appendChild(newNote);
            makeDraggable(newNote);
        });
    }
}

function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "TEXTAREA") return;
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}

document.querySelectorAll(".stickynote").forEach(makeDraggable);
loadNotes();
