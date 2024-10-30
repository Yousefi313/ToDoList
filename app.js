// Referenzen zu den DOM-Elementen
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Laden der Aufgaben aus localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Aufgabe hinzufügen
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        addTaskToList(taskText);
        saveTask(taskText);
        taskInput.value = ''; // Eingabefeld zurücksetzen
    }
});

// Filter-Tasten-Event hinzufügen
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTasks(btn.getAttribute('data-filter'));
        setActiveFilter(btn);
    });
});

// Aufgaben zur Liste hinzufügen
function addTaskToList(taskText, isCompleted = false) {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true'); // Für Drag & Drop
    if (isCompleted) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span>${taskText}</span>
        <button>X</button>
    `;

    // Aufgabe als erledigt markieren
    li.querySelector('input').addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTaskStatus(taskText, li.classList.contains('completed'));
    });

    // Aufgabe löschen
    li.querySelector('button').addEventListener('click', () => {
        removeTask(taskText);
        taskList.removeChild(li);
    });

    // Drag & Drop-Funktionalität
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    
    taskList.appendChild(li);
}

// Aufgaben im localStorage speichern
function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Laden der Aufgaben aus localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task.text, task.completed));
}

// Aufgabe aktualisieren (Erledigt/Nicht erledigt)
function updateTaskStatus(taskText, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            task.completed = isCompleted;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Aufgabe aus localStorage löschen
function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filterfunktion zum Anzeigen von Aufgaben
function filterTasks(filter) {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'open':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });
}

// Setzt den aktiven Filter hervor
function setActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Drag & Drop-Funktionalität
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
}

function handleDragOver(e) {
    e.preventDefault(); // Notwendig, um Drop zu ermöglichen
}

function handleDrop() {
    if (draggedItem !== this) {
        let allTasks = Array.from(taskList.children);
        let draggedIndex = allTasks.indexOf(draggedItem);
        let targetIndex = allTasks.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            taskList.insertBefore(draggedItem, this.nextSibling);
        } else {
            taskList.insertBefore(draggedItem, this);
        }
        // Aktualisiere die Reihenfolge im localStorage nach Drag & Drop
        updateTaskOrder();
    }
}

// Funktion zum Aktualisieren der Aufgabenreihenfolge im localStorage
function updateTaskOrder() {
    let updatedTasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        updatedTasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Access the audio element
let backgroundMusic = document.getElementById('backgroundMusic');

// Play the music when the app loads
window.onload = function() {
  backgroundMusic.play();
};

// Add buttons to play or pause music
document.getElementById('playMusic').addEventListener('click', function() {
  backgroundMusic.play();
});

document.getElementById('pauseMusic').addEventListener('click', function() {
  backgroundMusic.pause();
});

// Function to update the clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("clock").innerHTML = timeString;
}

// Call updateClock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately on page load
updateClock();


