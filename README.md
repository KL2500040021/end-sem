# Vanilla JavaScript To-Do App

A simple task manager built with HTML, CSS and vanilla JavaScript.

## Features
- Add and delete tasks
- Mark tasks as completed
- Filter all, active and completed tasks
- Clear completed tasks
- Save tasks in browser `localStorage`
- Load five sample tasks using the Fetch API from JSONPlaceholder

## How to run
1. Extract the ZIP file.
2. Open the `vanilla-todo-app` folder.
3. Open `index.html` in a modern browser.

For best results with Fetch API and browser security rules, run it with a local server:
- In VS Code, install/use the Live Server extension and click **Go Live**.
- Or run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## Main concepts used
- DOM manipulation: `createElement`, `appendChild`, `textContent`, `innerHTML`
- Event handling: `addEventListener`
- Fetch API: `fetch()` with `async/await`
- Local storage: `localStorage.getItem()` and `localStorage.setItem()`
