// To-Do App: DOM manipulation, event handling, Fetch API and localStorage

const STORAGE_KEY = "vanillaTodoTasks";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const statusMessage = document.querySelector("#status");
const taskCount = document.querySelector("#task-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const loadSamplesButton = document.querySelector("#load-samples");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasksFromStorage();
let currentFilter = "all";

function loadTasksFromStorage() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Could not read saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = tasks.length === 0
      ? "No tasks yet. Add your first task above!"
      : "No tasks in this filter.";
    list.appendChild(empty);
  }

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `todo-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as completed`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    list.appendChild(item);
  });

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
}

function addTask(title) {
  tasks.unshift({
    id: Date.now() + Math.random(),
    title: title.trim(),
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTask(title);
  input.value = "";
  input.focus();
  statusMessage.textContent = "Task added.";
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  statusMessage.textContent = "Completed tasks cleared.";
});

// Fetch API: loads example tasks from JSONPlaceholder.
// These examples are saved locally so they remain after refreshing the page.
loadSamplesButton.addEventListener("click", async () => {
  loadSamplesButton.disabled = true;
  statusMessage.textContent = "Loading sample tasks...";
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const sampleTasks = await response.json();

    const newTasks = sampleTasks.map(task => ({
      id: `api-${task.id}-${Date.now()}`,
      title: task.title,
      completed: task.completed
    }));

    tasks = [...newTasks, ...tasks];
    saveTasks();
    renderTasks();
    statusMessage.textContent = "Sample tasks loaded from the API.";
  } catch (error) {
    console.error("Fetch failed:", error);
    statusMessage.textContent = "Could not load sample tasks. Check your internet connection and try again.";
  } finally {
    loadSamplesButton.disabled = false;
  }
});

renderTasks();
