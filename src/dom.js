export {loadPage};

import {dbRead, dbWrite, dbReadTask, dbUpdate, dbDelete, updateStatus, dbCreateProject} from './database';
import {taskFactory} from './task';

let project = 'default';

const addButton = document.querySelector('#add');
addButton.addEventListener('click', function() {
    openForm();
});

const cancelButton = document.querySelector('#cancel');
cancelButton.addEventListener('click', function() {
    closeForm();
});

function loadPage() {
    closeForm();
    renderPage();
}

function renderPage() {
    dbRead().then(function(snapshot) {
        for (const property in snapshot.val()) {
            if (!document.getElementById(property)) {
                let option = document.createElement('option');
                option.text = property;
                option.value = property;
                option.id = property;
                document.querySelector('#project').appendChild(option);
            }
        }
    });

    let taskCards = document.querySelectorAll('.flexItem');
    taskCards.forEach(element => {
        if (element.draggable) {
            element.remove();
        }
    });

    dbRead(project).then(function(snapshot) {
        for (const property in snapshot.val()) {
            renderTask(property, snapshot.val()[property]);
        }
    });
}

const backlogSwimlane = document.querySelector('#backlog');
backlogSwimlane.addEventListener('dragover', function(e) {
    allowDrop(e, this);
});
backlogSwimlane.addEventListener('drop', function(e) {
    drop(e, this);
});
backlogSwimlane.addEventListener('dragleave', function() {
    leave(this);
});

const openSwimlane = document.querySelector('#open');
openSwimlane.addEventListener('dragover', function(e) {
    allowDrop(e, this);
    this.style.borderStyle = 'dashed';
});
openSwimlane.addEventListener('drop', function(e) {
    drop(e, this);
});
openSwimlane.addEventListener('dragleave', function() {
    leave(this);
});

const closedSwimlane = document.querySelector('#closed');
closedSwimlane.addEventListener('dragover', function(e) {
    allowDrop(e, this);
    this.style.borderStyle = 'dashed';
});
closedSwimlane.addEventListener('drop', function(e) {
    drop(e, this);
});
closedSwimlane.addEventListener('dragleave', function() {
    leave(this);
});

function allowDrop(event, element) {
    element.style.borderStyle = 'dashed';
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function leave(element) {
    element.style.borderStyle = 'none';
}

function drop(event, element) {
    event.preventDefault();
    element.style.borderStyle = 'none';
    let data = event.dataTransfer.getData('text');
    let taskCard = document.getElementById(data);

    let key = taskCard.id;
    let status = element.id;
    switch (status) {
        case 'backlog':
            addButton.insertAdjacentElement('afterend', taskCard);
            updateStatus(key, 'open');
            break;
        case 'open':
            openSwimlane.firstElementChild.insertAdjacentElement('afterend', taskCard);
            updateStatus(key, 'inProgress');
            break;
        case 'closed':
            closedSwimlane.firstElementChild.insertAdjacentElement('afterend', taskCard);
            updateStatus(key, 'closed');
            break;
    }
}

function renderTask(key, task) {
    let taskCard = document.createElement('div');
    taskCard.className = 'flexItem';
    taskCard.id = key;
    taskCard.draggable = 'true';

    taskCard.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text', e.target.id);
    });

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

    switch (task.status) {
        case 'open':
            addButton.insertAdjacentElement('afterend', taskCard);
            break;
        case 'inProgress':
            openSwimlane.firstElementChild.insertAdjacentElement('afterend', taskCard);
            break;
        case 'closed':
            closedSwimlane.firstElementChild.insertAdjacentElement('afterend', taskCard);
            break;
    }

    taskCard.addEventListener('click', function() {
        openTaskDetails();

        let taskDetailsName = document.querySelector('#taskDetailsName');
        let taskDetailsDate = document.querySelector('#taskDetailsDate');
        let taskDetailsPriority = document.querySelector('#taskDetailsPriority');
        let taskDetailsNotes = document.querySelector('#taskDetailsNotes');
        let taskDetailsStatus = document.querySelector('#taskDetailsStatus');
        let taskKey = document.querySelector('#taskKey');
        taskKey.value = this.id;

        dbReadTask(this.id).then(function(snapshot) {
            for (const property in snapshot.val()) {
                switch (property) {
                    case 'title':
                        taskDetailsName.value = snapshot.val()[property];
                        break;
                    case 'status':
                        taskDetailsStatus.value = snapshot.val()[property];
                        break;
                    case 'priority':
                        taskDetailsPriority.value = snapshot.val()[property];
                        break;
                    case 'dueDate':
                        taskDetailsDate.value = snapshot.val()[property];
                        break;
                    case 'description':
                        taskDetailsNotes.value = snapshot.val()[property];
                        break;
                }
            }
        });
    });
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
    let key = dbWrite(task);
    closeForm();
    renderTask(key, task);
});

const taskDetailsForm = document.querySelector('#taskDetailsForm');
taskDetailsForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh
    let taskDetailsName, taskDetailsDate, taskDetailsPriority, taskDetailsNotes, taskDetailsStatus, key;

    for (let i = 0; i < taskDetailsForm.length; i++) {
        switch (taskDetailsForm[i].name) {
            case 'taskDetailsName':
                taskDetailsName = taskDetailsForm[i].value;
                break;
            case 'taskDetailsDate':
                taskDetailsDate = taskDetailsForm[i].value;
                break;
            case 'taskDetailsPriority':
                taskDetailsPriority = taskDetailsForm[i].value;
                break;
            case 'taskDetailsNotes':
                taskDetailsNotes = taskDetailsForm[i].value;
                break;
            case 'taskDetailsStatus':
                taskDetailsStatus = taskDetailsForm[i].value;
                break;
            case 'taskKey':
                key = taskDetailsForm[i].value;
                break;
        }
    }

    if (e.submitter.id === 'delete') {
        taskDetailsForm.reset();
        dbDelete(key);
        closeTaskDetails();
        hideTask(key);
    }
    else {
        let task = taskFactory(taskDetailsName, taskDetailsDate, taskDetailsPriority, taskDetailsNotes);
        task.status = taskDetailsStatus;
        dbUpdate(task, key);
        closeTaskDetails();
        hideTask(key);
        renderTask(key, task);
    }
});

function openForm() {
    document.querySelector('#formPopup').style.display = 'block';
}
  
function closeForm() {
    newTaskForm.reset(); // Clear fields
    document.querySelector('#formPopup').style.display = 'none';
}

function openTaskDetails() {
    document.querySelector('#taskDetailsPopup').style.display = 'block';
}

function closeTaskDetails() {
    document.querySelector('#taskDetailsPopup').style.display = 'none';
}

const closeTaskDetailsButton = document.querySelector('#close');
closeTaskDetailsButton.addEventListener('click', function() {
    closeTaskDetails();
});

function hideTask(key) {
    let task = document.querySelector(`#${key}`)
    task.remove();
}

const deleteProjectButton = document.querySelector('#deleteProject');
deleteProjectButton.addEventListener('click', function() {
    alert("Are you sure you want to delete project?");
});

const newProjectForm = document.querySelector('#newProjectForm');
newProjectForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh

    name = newProjectForm.newProject.value;

    if (name !== undefined) {
        dbRead(name).then(function(snapshot) {
            if (!snapshot.exists()) {
                dbCreateProject(name);
                project = name;
                newProjectForm.reset();
                renderPage();
            }
            else {
                alert(`Project "${name}" already exists.`);
            }
        });
    }
});

const projectSelect = document.querySelector('#project');
projectSelect.addEventListener('change', function() {
    project = this.value;
    renderPage(project);
});