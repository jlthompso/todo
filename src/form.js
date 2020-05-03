import {dbWrite} from './database';
import {taskFactory} from './task';

function initForm() {
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
        newTaskForm.reset(); // Clear fields
        closeForm();
        let task = taskFactory(formName, formDate, formPriority, formNotes);
        dbWrite(task);
    });
}

function openForm() {
    document.querySelector('#formPopup').style.display = 'block';
}
  
function closeForm() {
    document.querySelector('#formPopup').style.display = 'none';
}

export {initForm, openForm, closeForm};