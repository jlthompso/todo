export const taskFactory = (title, description, dueDate, priority) => {
    let status = "open";
    return {title, description, dueDate, priority, status};
}