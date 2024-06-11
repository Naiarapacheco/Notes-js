// Elementos
const notesContainer = document.getElementById("notes-container");
const noteInput = document.getElementById("note-content");
const addNoteBtn = document.querySelector(".add-note");
const exportCSV = document.querySelector("#export-notes");

// Funções
function showNotes() {
  cleanNotes();

  getNotes().forEach((note) => {
    const noteElement = createNote(
      note.id,
      note.content,
      note.fixed,
      note.urgent
    );

    notesContainer.appendChild(noteElement);
  });
}

function cleanNotes() {
  notesContainer.replaceChildren([]);
}

function addNote() {
  const notes = getNotes();

  const noteObj = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
    urgent: false,
  };
  const noteElement = createNote(noteObj.id, noteObj.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObj);

  saveNotes(notes);

  noteInput.value = "";
}

function generateId() {
  return Math.floor(Math.random() * 5000);
}

function createNote(id, content, fixed = false, urgent = false) {
  const element = document.createElement("div");
  element.classList.add("note");

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Adicione algum texto...";
  textarea.id = `note-${id}`; // id único ao textarea

  element.appendChild(textarea);

  // Icones
  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["ri", "ri-pushpin-2-line"]);
  element.appendChild(pinIcon);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["ri", "ri-delete-bin-line"]);
  element.appendChild(deleteIcon);

  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["ri", "ri-file-add-line"]);
  element.appendChild(duplicateIcon);

  const urgentIcon = document.createElement("i");
  urgentIcon.classList.add(...["ri", "ri-file-warning-fill"]);
  element.appendChild(urgentIcon);

  if (fixed) {
    element.classList.add("fixed");
  }

  if (urgent) {
    element.classList.add("urgent");
  }

  //Eventos do Elemento
  //Pin
  element.querySelector(".ri-pushpin-2-line").addEventListener("click", () => {
    toggleFixNote(id);
  });

  //Delete
  element.querySelector(".ri-delete-bin-line").addEventListener("click", () => {
    deleteNote(id, element);
  });

  //Copiar
  element.querySelector(".ri-file-add-line").addEventListener("click", () => {
    copyNote(id);
  });

  //Urgência
  element
    .querySelector(".ri-file-warning-fill")
    .addEventListener("click", () => {
      toggleImportantNote(id, element);
    });

  return element;
}

// Fixar Note
function toggleFixNote(id) {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  targetNotes.fixed = !targetNotes.fixed;

  saveNotes(notes);

  showNotes();
}

//Fixar Note Importante
function toggleImportantNote(id) {
  const notes = getNotes();

  const importantNotes = notes.filter((note) => note.id === id)[0];

  importantNotes.urgent = !importantNotes.urgent;

  saveNotes(notes);

  showNotes();
}

// Deletar Note
function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNotes(notes);

  notesContainer.removeChild(element);
}

// Copiar Note
function copyNote(id) {
  const notes = getNotes();
  const targetNotes = notes.filter((note) => note.id === id)[0];

  const textarea = document.getElementById(`note-${id}`); //textarea id
  const updatedContent = textarea.value;

  const noteObj = {
    id: generateId(),
    content: updatedContent,
    fixed: targetNotes.fixed,
    urgent: targetNotes.urgent,
  };
  const noteElement = createNote(
    noteObj.id,
    noteObj.content,
    noteObj.fixed,
    noteObj.urgent
  );

  notesContainer.appendChild(noteElement);

  notes.push(noteObj);

  saveNotes(notes);
}

// Salvar no localStorage
function getNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Função para exportar notas como CSV
function exportNotesToCSV() {
  const notes = getNotes();
  if (notes.length === 0) {
    alert("Não há notas para exportar.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Content,Urgent\n"; //cabeçalho

  notes.forEach((note) => {
    const row = [
      note.id,
      note.content.replace(/\n/g, " "),
      note.fixed,
      note.urgent,
    ].join(",");
    csvContent += row + "\n";
  });

  const encodeUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodeUri);
  link.setAttribute("download", "notes.csv");
  document.body.appendChild(link); // Requerido para o firefox
  link.click();
  document.body.removeChild(link); // Remover o link após o clique
}

// Eventos
addNoteBtn.addEventListener("click", () => addNote());
exportCSV.addEventListener("click", () => exportNotesToCSV());

// Adicionar nota ao pressionar Enter
noteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

// Inicialização
showNotes();
