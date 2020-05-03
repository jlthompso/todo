import {openForm, closeForm} from './form';

const backlogSwimlane = document.querySelector('#backlog');
const openSwimlane = document.querySelector('#open');
const closedSwimlane = document.querySelector('#closed');
const addButton = document.querySelector('#add');
const cancelButton = document.querySelector('#cancel');

function initDOM() {
    addButton.addEventListener('click', function() {
        openForm();
    });
    
    cancelButton.addEventListener('click', function() {
        closeForm();
    });
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

export {initDOM, renderTask};