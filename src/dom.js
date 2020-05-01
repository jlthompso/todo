import {openForm, closeForm} from './form';

function initDOM() {
    const addButton = document.querySelector('#add');
    addButton.addEventListener('click', function() {
        openForm();
    });
    
    const cancelButton = document.querySelector('#cancel');
    cancelButton.addEventListener('click', function() {
        closeForm();
    });
}

export {initDOM};