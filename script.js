const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const taskList = document.getElementById('taskList');

let tasks = [];

taskForm.addEventListener('submit', function(e){
e.preventDefault();

const newTask = {
id: Date.now(),
title:taskTitle.value,
startTime: startTime.value,
endTime: endTime.value
};

tasks.push(newTask);
saveTasksToStorage();
renderTasks();
taskForm.reset();

})

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0){
        taskList.innerHTML = '<p class="emptySpace">No tasks Scheduled Yet. Add one above.</p>';
        return;
    }

    tasks.sort((a,b) => a.startTime.localeCompare(b.startTime));

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'taskCard';

        taskCard.innerHTML = `
            <div class="taskInfo">
            <h3>${task.title}</h3>
            <p class="taskTime">${task.startTime} -${task.endTime}</p>
            </div>
            <button type="button" id="deleteBtn" onclick="deleteTask(${task.id})">X</button>
        `;
        taskList.appendChild(taskCard);
    });
}

function deleteTask(id) {
    const userConfirmed = confirm("Are you sure, you want to delete the selected item?")
    if (!userConfirmed){
        return;
    }
    tasks = tasks.filter(task => task.id !== id);

    saveTasksToStorage();
    renderTasks();
}

function saveTasksToStorage() {
    localStorage.setItem('my_scheduler_tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const savedData = localStorage.getItem('my_scheduler_tasks');
    if (savedData){
        tasks = JSON.parse(savedData);
        renderTasks();
    }
}

document.addEventListener('DOMContentLoaded', loadTasksFromStorage);