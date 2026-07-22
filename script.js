const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const startTime = document.getElementById('startTime');
const endTime = document.getElementById('endTime');
const taskList = document.getElementById('taskList');
const taskStats = document.getElementById('taskStats');
const progressBarFill = document.getElementById('progressBarFill');
const filterBtns = document.querySelectorAll('.filterBtn');

let tasks = [];
let currentFilter = 'all';

taskForm.addEventListener('submit', function(e){
e.preventDefault();

const newTask = {
id: Date.now(),
title:taskTitle.value,
startTime: startTime.value,
endTime: endTime.value,
completed: false
};

tasks.push(newTask);
saveTasksToStorage();
renderTasks();
taskForm.reset();
taskTitle.focus();
})

function renderTasks() {
    taskList.innerHTML = '';

    updateStats();

    const filteredTasks = tasks.filter(task => {
        if(currentFilter === 'active') return !task.completed;
        if(currentFilter === 'completed')  return task.completed;
        return true;
    });

    
    if (filteredTasks.length === 0){
        taskList.innerHTML = `<p class="emptySpace">No ${currentFilter === 'all' ? '' : currentFilter} tasks Scheduled Yet. Add one above.</p>`;
        return;
    }

    filteredTasks.sort((a,b) => a.startTime.localeCompare(b.startTime));

    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = `taskCard ${task.completed ? 'completed' : ''}`;

        taskCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">

            <div class="taskInfo">
            <h3>${escapeHtml(task.title)}</h3>
            <p class="taskTime">${task.startTime} -${task.endTime}</p>
            </div>
            <button type="button" id="deleteBtn" onclick="deleteTask(${task.id}, this.parentElement)">X</button>
        `;
        taskList.appendChild(taskCard);
    });
}

function deleteTask(id, cardElement) {
    const userConfirmed = confirm("Are you sure, you want to delete the selected item?")
    if (!userConfirmed){
        return;
    }

    if (id) {
        cardElement.classList.add('fade-out');
        setTimeout(()=>{
            tasks = tasks.filter(task => task.id !== id);
            saveTasksToStorage();
            renderTasks();
        }, 250);
    } else {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage();
        renderTasks();
    }
    

    s
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

function toggleTask(id){
tasks = tasks.map(task => 
    task.id === id ? {...task, completed: !task.completed} : task
);
saveTasksToStorage();
renderTasks();
}

function updateStats(){
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (taskStats) {
        taskStats.textContent = `${completed} of ${total} completed (${percentage}%)`;
    }

    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
    }
}

filterBtns.forEach(btn =>{
    btn.addEventListener('click', () =>{
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}

document.addEventListener('DOMContentLoaded', loadTasksFromStorage);
