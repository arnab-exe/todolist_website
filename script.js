// Task management class for better organization
class TodoApp {
    constructor() {
        this.initializeElements();
        // Load tasks from Local Storage first
        this.tasks = this.loadTasks();
        this.bindEvents();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.remainingCount = document.getElementById('remainingCount');
    }

    // Bind event listeners
    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.taskInput.focus();
    }

    // Add a new task
    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText === '') {
            this.showError('Please enter a task');
            return;
        }

        const newTask = {
            id: Date.now(), // Use timestamp for a unique ID
            text: this.escapeHtml(taskText),
            completed: false,
        };

        this.tasks.unshift(newTask);
        this.taskInput.value = '';
        this.taskInput.focus();
        this.saveTasks();
        this.render();
    }

    // Toggle task completion status
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    // Delete a task
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.render();
    }
    
    // Update task text after inline editing
    updateTaskText(taskId, newText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && newText.trim()) {
            task.text = this.escapeHtml(newText.trim());
            this.saveTasks();
        }
        // No re-render needed, as blur event handles UI change
    }

    // Show error message
    showError(message) {
        this.taskInput.style.borderColor = '#dc3545';
        this.taskInput.placeholder = message;
        setTimeout(() => {
            this.taskInput.style.borderColor = '#ddd';
            this.taskInput.placeholder = 'What needs to be done today?';
        }, 2000);
    }

    // Render all tasks and update UI
    render() {
        this.updateStats();

        if (this.tasks.length === 0) {
            this.showEmptyState();
            this.taskList.innerHTML = '';
            return;
        }

        this.hideEmptyState();
        this.taskList.innerHTML = ''; // Clear list before re-rendering
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    // Create a single task element
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskDiv.setAttribute('data-id', task.id);

        taskDiv.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        
        // --- Add event listeners directly to the elements ---
        
        taskDiv.querySelector('.task-checkbox').addEventListener('click', () => {
            this.toggleTask(task.id);
        });

        taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
            this.deleteTask(task.id);
        });

        const taskTextElement = taskDiv.querySelector('.task-text');
        const editBtn = taskDiv.querySelector('.edit-btn');
        
        editBtn.addEventListener('click', () => {
            // Enable editing and focus on the text
            taskTextElement.contentEditable = 'true';
            taskTextElement.focus();
            editBtn.style.display = 'none'; // Hide edit button during edit
        });

        taskTextElement.addEventListener('blur', () => {
            // When focus is lost, save the new text
            taskTextElement.contentEditable = 'false';
            this.updateTaskText(task.id, taskTextElement.innerText);
            editBtn.style.display = 'inline-block'; // Show edit button again
        });

        taskTextElement.addEventListener('keypress', (e) => {
            // Save on Enter key
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent new line
                taskTextElement.blur(); // Trigger the blur event to save
            }
        });

        return taskDiv;
    }

    // Escape HTML to prevent XSS attacks
    escapeHtml(text) {
        const map = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Update statistics
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
        this.remainingCount.textContent = total - completed;
    }

    // Show or hide the empty state message
    showEmptyState() { this.emptyState.style.display = 'block'; }
    hideEmptyState() { this.emptyState.style.display = 'none'; }

    // Load tasks from Local Storage
    loadTasks() {
        const tasksJson = localStorage.getItem('todoTasks');
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    // Save tasks to Local Storage
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});