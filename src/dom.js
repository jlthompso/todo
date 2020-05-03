import {dbRead, dbWrite} from './database';
import {taskFactory} from './task';

const backlogSwimlane = document.querySelector('#backlog');
const openSwimlane = document.querySelector('#open');
const closedSwimlane = document.querySelector('#closed');

const addButton = document.querySelector('#add');
addButton.addEventListener('click', function() {
    openForm();
});

const cancelButton = document.querySelector('#cancel');
cancelButton.addEventListener('click', function() {
    closeForm();
});

document.addEventListener('load', function() {
    closeForm();
    console.log("Rendering page...");
    renderPage();
});

function renderPage() {
    dbRead();
}

function renderTask(task) {
    let taskCard = document.createElement('div');
    taskCard.className = 'flexItem';

    let date = document.createElement('div');
    date.className = 'taskDueDate';
    date.innerHTML = formatDate(task.dueDate);
    taskCard.appendChild(date);

    let icon = document.createElement('img');
    icon.className = 'taskPriority';
    let imgPath = './images/';
    switch (task.priority) {
        case 'highest':
            imgPath += 'highestPriority.png';
            break;
        case 'high':
            imgPath += 'highPriority.png';
            break;
        case 'normal':
            imgPath += 'mediumPriority.png';
            break;
        case 'low':
            imgPath += 'lowPriority.png';
            break;
        case 'lowest':
            imgPath += 'lowestPriority.png';
            break;
    }
    icon.src = imgPath;
    taskCard.appendChild(icon);

    let summary = document.createElement('div');
    summary.className = 'taskName';
    summary.innerHTML = task.title;
    taskCard.appendChild(summary);

    addButton.insertAdjacentElement('afterend', taskCard);
}

function formatDate(date) {
    let ret = "";
    if (date !== "") {
        let s = date.split("-");
        let year = s[0];
        let month = s[1];
        let day = s[2];
        ret = `${month}/${day}/${year}`;
    }
    return ret;
}

const newTaskForm = document.querySelector('#newTaskForm');
newTaskForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh
    let formName, formDate, formPriority, formNotes;
    for (let i = 0; i < newTaskForm.length; i++) {
        switch (newTaskForm[i].name) {
            case 'formName':
                formName = newTaskForm[i].value;
                break;
            case 'formDate':
                formDate = newTaskForm[i].value;
                break;
            case 'formPriority':
                formPriority = newTaskForm[i].value;
                break;
            case 'formNotes':
                formNotes = newTaskForm[i].value;
                break;
        }
    }
    let task = taskFactory(formName, formDate, formPriority, formNotes);
    if (dbWrite(task)) {
        closeForm();
        renderTask(task);
    }
});

function openForm() {
    document.querySelector('#formPopup').style.display = 'block';
}
  
function closeForm() {
    newTaskForm.reset(); // Clear fields
    document.querySelector('#formPopup').style.display = 'none';
}