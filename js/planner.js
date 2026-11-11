// planner.js - Academic Planner: add, complete, delete tasks
// Tasks live in an array of objects and are saved in localStorage.

(function () {
  "use strict";

  var STORAGE_KEY = "academicPlannerTasks_v2";
  var tasks = loadTasks();       // array of {id, title, subject, due, priority, done}
  var currentFilter = "all";

  var form = document.getElementById("task-form");
  var titleInput = document.getElementById("task-title");
  var subjectInput = document.getElementById("task-subject");
  var dueInput = document.getElementById("task-due");
  var priorityInput = document.getElementById("task-priority");
  var titleError = document.getElementById("task-error");
  var listEl = document.getElementById("task-list");
  var filterSelect = document.getElementById("task-filter");
  var clearBtn = document.getElementById("clear-completed");

  var totalEl = document.getElementById("stat-total");
  var doneEl = document.getElementById("stat-done");
  var pendingEl = document.getElementById("stat-pending");

  // ---------- Storage helpers ----------
  function loadTasks() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (e) { /* ignore corrupted / blocked storage */ }
    return [
            { id: 1, title: "Finish Web Development portfolio", subject: "GST 122", due: "", priority: "high", done: false },
            { id: 2, title: "Read Chapter 5 - Nigerian Peoples and Culture", subject: "GST 112", due: "", priority: "medium", done: false },
            { id: 3, title: "Submit General Physics (II) Assignment", subject: "PHY 102", due: "", priority: "low", done: true }
    ];
  }

  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
  }

  // ---------- Core functions ----------
  function addTask(title, subject, due, priority) {
    tasks.push({
      id: Date.now(),
      title: title,
      subject: subject,
      due: due,
      priority: priority,
      done: false
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks.forEach(function (t) {
      if (t.id === id) t.done = !t.done;
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }

  function formatDate(iso) {
    if (!iso) return "No due date";
    var d = new Date(iso + "T00:00:00");
    return "Due " + d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function isOverdue(t) {
    if (!t.due || t.done) return false;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(t.due + "T00:00:00") < today;
  }

  // ---------- Rendering (DOM manipulation) ----------
  function render() {
    listEl.innerHTML = "";

    var visible = tasks.filter(function (t) {
      if (currentFilter === "pending") return !t.done;
      if (currentFilter === "completed") return t.done;
      return true;
    });

    if (visible.length === 0) {
      var empty = document.createElement("li");
      empty.className = "empty-state";
      empty.textContent = tasks.length === 0
        ? "No tasks yet. Add your first task using the form."
        : "No tasks match this filter.";
      listEl.appendChild(empty);
    }

    visible.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "task priority-" + t.priority + (t.done ? " done" : "");
      li.dataset.id = t.id;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = t.done;
      checkbox.setAttribute("aria-label", "Mark \"" + t.title + "\" as completed");
      checkbox.addEventListener("change", function () { toggleTask(t.id); });

      var info = document.createElement("div");
      info.className = "task-info";

      var title = document.createElement("div");
      title.className = "task-title";
      title.textContent = t.title;

      var meta = document.createElement("div");
      meta.className = "task-meta";
      var parts = [];
      if (t.subject) parts.push(t.subject);
      parts.push(formatDate(t.due));
      parts.push(t.priority.charAt(0).toUpperCase() + t.priority.slice(1) + " priority");
      if (isOverdue(t)) parts.push("\u26A0 Overdue");
      meta.textContent = parts.join(" \u2022 ");

      info.appendChild(title);
      info.appendChild(meta);

      var del = document.createElement("button");
      del.type = "button";
      del.className = "btn btn-danger";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete task " + t.title);
      del.addEventListener("click", function () {
        li.classList.add("removing");
        setTimeout(function () { deleteTask(t.id); }, 280);
      });

      li.appendChild(checkbox);
      li.appendChild(info);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    updateStats();
  }

  function updateStats() {
    var done = tasks.filter(function (t) { return t.done; }).length;
    totalEl.textContent = tasks.length;
    doneEl.textContent = done;
    pendingEl.textContent = tasks.length - done;
  }

  // ---------- Event handling ----------
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = titleInput.value.trim();

    if (title === "") {
      titleError.textContent = "Please enter a task description.";
      titleInput.focus();
      return;
    }
    titleError.textContent = "";

    addTask(title, subjectInput.value.trim(), dueInput.value, priorityInput.value);
    form.reset();
    titleInput.focus();
  });

  titleInput.addEventListener("input", function () {
    if (titleInput.value.trim() !== "") titleError.textContent = "";
  });

  filterSelect.addEventListener("change", function () {
    currentFilter = filterSelect.value;
    render();
  });

  clearBtn.addEventListener("click", function () {
    var hasDone = tasks.some(function (t) { return t.done; });
    if (!hasDone) return;
    if (confirm("Remove all completed tasks?")) {
      tasks = tasks.filter(function (t) { return !t.done; });
      saveTasks();
      render();
    }
  });

  render();
})();