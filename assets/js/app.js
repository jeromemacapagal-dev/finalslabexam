/* Shared StudyNest state and dashboard behavior. No server or account is required. */
(function () {
  'use strict';

  const TASKS_KEY = 'studynest.tasks.v1';
  const BOOKMARKS_KEY = 'studynest.bookmarks.v1';
  const DAY_MS = 24 * 60 * 60 * 1000;

  function dateOffset(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return toDateInputValue(date);
  }

  function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createDemoTasks() {
    return [
      { id: 'demo-1', title: 'Review JavaScript array methods', subject: 'Programming', priority: 'high', dueDate: dateOffset(0), notes: 'Practice map, filter, and reduce with a few examples.', completed: false, createdAt: Date.now() - 4000 },
      { id: 'demo-2', title: 'Sketch the homepage wireframe', subject: 'Web Design', priority: 'medium', dueDate: dateOffset(1), notes: 'Keep the layout clear on a phone screen.', completed: false, createdAt: Date.now() - 3000 },
      { id: 'demo-3', title: 'Read the prompt engineering notes', subject: 'Application Development', priority: 'low', dueDate: dateOffset(2), notes: '', completed: true, createdAt: Date.now() - 2000 },
      { id: 'demo-4', title: 'Outline the project reflection', subject: 'Research', priority: 'medium', dueDate: dateOffset(4), notes: 'List what worked, what changed, and what I learned.', completed: false, createdAt: Date.now() - 1000 }
    ];
  }

  function readStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn(`StudyNest could not read ${key}.`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`StudyNest could not save ${key}.`, error);
      return false;
    }
  }

  let tasks = readStorage(TASKS_KEY, null);
  if (!Array.isArray(tasks)) {
    tasks = createDemoTasks();
    writeStorage(TASKS_KEY, tasks);
  }
  let bookmarks = readStorage(BOOKMARKS_KEY, []);
  if (!Array.isArray(bookmarks)) bookmarks = [];

  const Store = {
    getTasks() { return tasks.map(task => ({ ...task })); },
    saveTasks(nextTasks) {
      if (!Array.isArray(nextTasks)) return false;
      tasks = nextTasks.map(task => ({ ...task }));
      return writeStorage(TASKS_KEY, tasks);
    },
    getBookmarks() { return [...bookmarks]; },
    saveBookmarks(nextBookmarks) {
      if (!Array.isArray(nextBookmarks)) return false;
      bookmarks = [...new Set(nextBookmarks.map(String))];
      return writeStorage(BOOKMARKS_KEY, bookmarks);
    },
    refreshDashboard() { renderDashboard(); }
  };

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function prettyDate(value) {
    if (!value) return 'No due date';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
  }

  function dateLabel(date = new Date()) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  }

  function showToast(message, title = 'StudyNest') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast show mb-2';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<div class="toast-header"><strong class="me-auto">${safeText(title)}</strong><button type="button" class="btn-close" aria-label="Dismiss notification"></button></div><div class="toast-body">${safeText(message)}</div>`;
    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3600);
  }

  function renderDashboard() {
    if (document.body.dataset.page !== 'dashboard') return;
    const allTasks = Store.getTasks();
    const openTasks = allTasks.filter(task => !task.completed);
    const completed = allTasks.filter(task => task.completed);
    const saved = Store.getBookmarks();
    const today = toDateInputValue(new Date());
    const openEl = document.getElementById('stat-open');
    const doneEl = document.getElementById('stat-completed');
    const savedEl = document.getElementById('stat-saved');
    if (openEl) openEl.textContent = String(openTasks.length);
    if (doneEl) doneEl.textContent = String(completed.length);
    if (savedEl) savedEl.textContent = String(saved.length);

    const total = allTasks.length;
    const percent = total ? Math.round((completed.length / total) * 100) : 0;
    const percentEl = document.getElementById('progress-percent');
    const fill = document.getElementById('progress-fill');
    const bar = document.getElementById('progress-bar');
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fill) fill.style.width = `${percent}%`;
    if (bar) bar.setAttribute('aria-valuenow', String(percent));
    const caption = document.getElementById('progress-caption');
    if (caption) caption.textContent = total ? `${completed.length} of ${total} tasks are complete.` : 'Add your first task to start tracking progress.';

    const list = document.getElementById('dashboard-task-list');
    if (list) {
      const todaysTasks = openTasks.filter(task => task.dueDate <= today).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
      const selected = todaysTasks.length ? todaysTasks : openTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3);
      if (!selected.length) {
        list.innerHTML = '<div class="empty-state"><span class="empty-icon" aria-hidden="true">✓</span><h3>You are all caught up</h3><p>Add a new goal whenever you are ready.</p></div>';
      } else {
        list.innerHTML = selected.map(task => {
          const dueText = task.dueDate < today ? `Overdue · ${prettyDate(task.dueDate)}` : task.dueDate === today ? 'Due today' : `Due ${prettyDate(task.dueDate)}`;
          return `<div class="focus-item"><span class="focus-indicator" aria-hidden="true">${task.priority === 'high' ? '!' : '↗'}</span><div class="focus-info"><p class="focus-title">${safeText(task.title)}</p><p class="focus-meta">${safeText(task.subject || 'General')} · ${safeText(dueText)}</p></div><span class="priority-tag priority-${safeText(task.priority || 'medium')}">${safeText((task.priority || 'medium').toUpperCase())}</span></div>`;
        }).join('');
      }
    }
    const footer = document.getElementById('focus-footer-text');
    if (footer) footer.textContent = `${openTasks.length} task${openTasks.length === 1 ? '' : 's'} still in progress. You have got this.`;
    const date = document.getElementById('today-date');
    if (date) date.textContent = dateLabel();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
    const plannerDate = document.getElementById('planner-date');
    if (plannerDate) plannerDate.textContent = dateLabel();
    renderDashboard();
  });

  window.StudyNest = { Store, safeText, prettyDate, dateLabel, toDateInputValue, showToast, renderDashboard };
})();
