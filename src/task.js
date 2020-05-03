const taskFactory = (title, dueDate, priority, description) => {
    let status = "open";
    return {title, description, dueDate, priority, status};
}

export {taskFactory};