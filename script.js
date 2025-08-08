class TodoApp {
  constructor() {
    this.initializeElements();
    this.tasks = this.loadTasks();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addBtn = document.getElementById('addBtn');
    this.taskList = document.getElementById('taskList');
    this.emptyState = document.getElementById('emptyState');
    this.totalCount = document.getElementById('totalCount');
    this.completedCount = document.getElementById('completedCount');
    this.remainingCount = document.getElementById('remainingCount');
  }

  bindEvents() {
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask();
      }
    });
    this.taskInput.focus();
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    if (taskText === '') {
      this.showError('Please enter a task');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: this.escapeHtml(taskText),
      completed: false,
    };

    this.tasks.unshift(newTask);
    this.taskInput.value = '';
    this.taskInput.focus();
    this.saveTasks();
    this.render();
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.render();
  }

  updateTaskText(taskId, newText) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && newText.trim()) {
      task.text = this.escapeHtml(newText.trim());
      this.saveTasks();
    }
  }

  showError(message) {
    this.taskInput.style.borderColor = '#ef476f';
    this.taskInput.placeholder = message;
    setTimeout(() => {
      this.taskInput.style.borderColor = '#e0e6ed';
      this.taskInput.placeholder = 'What needs to be done today?';
    }, 2000);
  }

  render() {
    this.updateStats();

    if (this.tasks.length === 0) {
      this.showEmptyState();
      this.taskList.innerHTML = '';
      return;
    }

    this.hideEmptyState();
    this.taskList.innerHTML = '';
    this.tasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskList.appendChild(taskElement);
    });
  }

  createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
  taskDiv.setAttribute('data-id', task.id);

  // Base innerHTML always has the checkbox and text
  let innerHTML = `
    <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
  `;

  // If not completed, include Edit button
  if (!task.completed) {
    innerHTML += `<button class="edit-btn">Edit</button>`;
  }

  // Always include Delete button
  innerHTML += `<button class="delete-btn">Delete</button>`;

  taskDiv.innerHTML = innerHTML;

  // Toggle completion
  taskDiv.querySelector('.task-checkbox').addEventListener('click', () => {
    this.toggleTask(task.id);
  });

  // Delete
  taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
    this.deleteTask(task.id);
  });

  // If Edit exists (only for incomplete tasks), bind editing
  const taskTextElement = taskDiv.querySelector('.task-text');
  const editBtn = taskDiv.querySelector('.edit-btn');

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      taskTextElement.contentEditable = 'true';
      taskTextElement.focus();
      editBtn.style.display = 'none';
    });

    taskTextElement.addEventListener('blur', () => {
      taskTextElement.contentEditable = 'false';
      this.updateTaskText(task.id, taskTextElement.innerText);
      editBtn.style.display = 'inline-block';
    });

    taskTextElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        taskTextElement.blur();
      }
    });
  }

  return taskDiv;
}
  
  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    this.totalCount.textContent = total;
    this.completedCount.textContent = completed;
    this.remainingCount.textContent = total - completed;
  }

  showEmptyState() {
    this.emptyState.style.display = 'block';
  }

  hideEmptyState() {
    this.emptyState.style.display = 'none';
  }

  loadTasks() {
    const tasksJson = localStorage.getItem('todoTasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
