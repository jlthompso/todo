const newTaskForm = document.querySelector('#newTaskForm');

newTaskForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh
    for (let i = 0; i < newTaskForm.length; i++) {
        console.log(newTaskForm[i]);
    }
    newTaskForm.reset(); // Clear fields
    closeForm();
});

export function openForm() {
    document.querySelector('#formPopup').style.display = 'block';
}
  
export function closeForm() {
    document.querySelector('#formPopup').style.display = 'none';
}