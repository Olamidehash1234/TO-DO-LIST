// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const reminderInput = document.getElementById('reminder-time');
    const addTaskBtn = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter');
    const searchTaskInput = document.getElementById('search-task');
    const searchIcon = document.getElementById('search-icon');
    const searchContainer = document.querySelector('.search-container');

    // Load tasks from local storage
    loadTasks();

    // Add task
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterTasks(this.dataset.filter);
        });
    });

    // Search tasks
    searchTaskInput.addEventListener('input', searchTasks);

    // Toggle search input
    searchIcon.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchTaskInput.focus();
        }
    });

    searchTaskInput.addEventListener('blur', function() {
        searchContainer.classList.remove('active');
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const reminderTime = reminderInput.value;

        if (taskText !== '') {
            const li = createTaskElement(taskText, reminderTime);
            taskList.appendChild(li);
            saveTasks();
            taskInput.value = '';
            reminderInput.value = '';
        }
    }

    function createTaskElement(taskText, reminderTime) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            saveTasks();
        });

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;
        span.contentEditable = true;
        span.addEventListener('blur', saveTasks);

        const reminderSpan = document.createElement('span');
        reminderSpan.className = 'reminder-time';
        reminderSpan.textContent = reminderTime ? `Reminder: ${new Date(reminderTime).toLocaleString()}` : '';
        
        if (reminderTime) {
            const reminderDate = new Date(reminderTime);
            setReminder(reminderDate, taskText);
        }

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'x';
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(reminderSpan);
        li.appendChild(deleteBtn);
        return li;
    }

    function setReminder(reminderDate, taskText) {
        const now = new Date();
        const timeUntilReminder = reminderDate - now;
        
        if (timeUntilReminder > 0) {
            setTimeout(() => {
                alert(`Reminder: ${taskText}`);
            }, timeUntilReminder);
        }
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                reminderTime: li.querySelector('.reminder-time').textContent.replace('Reminder: ', '')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task.text, task.reminderTime);
            if (task.completed) {
                li.classList.add('completed');
                li.querySelector('input[type="checkbox"]').checked = true;
            }
            taskList.appendChild(li);
        });
    }

    function filterTasks(filter) {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = '';
                    break;
                case 'active':
                    task.style.display = task.classList.contains('completed') ? 'none' : '';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? '' : 'none';
                    break;
            }
        });
    }

    function searchTasks() {
        const searchText = searchTaskInput.value.toLowerCase();
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            const taskText = task.querySelector('.task-text').textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }
});
