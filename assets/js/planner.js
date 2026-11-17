/* Study planner: validated task creation, search, filtering, sorting, completion, and deletion. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'planner' || !window.StudyNest) return;
    const { Store, safeText, prettyDate, toDateInputValue, showToast, renderDashboard } = window.StudyNest;
    const form = document.getElementById('task-form');
    const titleInput = document.getElementById('task-title');
    const dueInput = document.getElementById('task-due');
    const notesInput = document.getElementById('task-notes');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('task-search');
    const filterInput = document.getElementById('task-filter');
    const sortInput = document.getElementById('task-sort');
    const clearButton = document.getElementById('clear-completed');
    const today = toDateInputValue(new Date());
    dueInput.min = today;
    dueInput.value = today;

    function priorityRank(priority) { return ({ high: 0, medium: 1, low: 2 })[priority] ?? 1; }

    function getVisibleTasks() {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const filter = filterInput.value;
      const sort = sortInput.value;
      let tasks = Store.getTasks().filter(task => {
        const matchesText = !query || `${task.title} ${task.subject} ${task.notes || ''}`.toLocaleLowerCase().includes(query);
        const matchesStatus = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
        return matchesText && matchesStatus;
      });
      tasks.sort((a, b) => {
        if (sort === 'priority') return priorityRank(a.priority) - priorityRank(b.priority) || a.dueDate.localeCompare(b.dueDate);
        if (sort === 'title') return a.title.localeCompare(b.title);
        return a.dueDate.localeCompare(b.dueDate) || priorityRank(a.priority) - priorityRank(b.priority);
      });
      return tasks;
    }

    function renderSummary() {
      const tasks = Store.getTasks();
      const done = tasks.filter(task => task.completed).length;
      document.getElementById('summary-total').textContent = String(tasks.length);
      document.getElementById('summary-pending').textContent = String(tasks.length - done);
      document.getElementById('summary-done').textContent = String(done);
      document.getElementById('visible-count').textContent = String(getVisibleTasks().length);
      document.getElementById('board-footer-text').textContent = tasks.length ? `${done} of ${tasks.length} tasks completed.` : 'A fresh list is a fresh start.';
    }

    function renderTasks() {
      const tasks = getVisibleTasks();
      document.getElementById('visible-count').textContent = String(tasks.length);
      if (!tasks.length) {
        const isFiltering = Boolean(searchInput.value.trim()) || filterInput.value !== 'all';
        taskList.innerHTML = `<div class="empty-state"><span class="empty-icon" aria-hidden="true">${isFiltering ? '⌕' : '✧'}</span><h3>${isFiltering ? 'No matching tasks' : 'Your list is taking shape'}</h3><p>${isFiltering ? 'Try another search or change the filter.' : 'Add a task to see it here.'}</p></div>`;
        return;
      }
      taskList.innerHTML = tasks.map(task => {
        const dueDate = task.dueDate || '';
        const dueLabel = dueDate < today && !task.completed ? `Overdue · ${prettyDate(dueDate)}` : `Due ${prettyDate(dueDate)}`;
        const notes = task.notes ? `<p class="task-notes">${safeText(task.notes)}</p>` : '';
        return `<article class="task-row ${task.completed ? 'is-complete' : ''}" data-task-id="${safeText(task.id)}">
          <input class="task-check" type="checkbox" data-action="toggle" aria-label="Mark ${safeText(task.title)} as ${task.completed ? 'pending' : 'complete'}" ${task.completed ? 'checked' : ''}>
          <div class="task-main"><p class="task-title">${safeText(task.title)}</p><div class="task-details"><span class="task-subject">◈ ${safeText(task.subject || 'General')}</span><span>◷ ${safeText(dueLabel)}</span></div>${notes}</div>
          <span class="priority-tag priority-${safeText(task.priority || 'medium')}">${safeText((task.priority || 'medium').toUpperCase())}</span>
          <div class="task-actions"><button class="task-action" type="button" data-action="delete" aria-label="Delete ${safeText(task.title)}" title="Delete task">×</button></div>
        </article>`;
      }).join('');
    }

    function refresh() { renderTasks(); renderSummary(); renderDashboard(); }

    function setInvalid(input, invalid, messageId) {
      input.classList.toggle('is-invalid', invalid);
      input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      const message = document.getElementById(messageId);
      if (message) message.style.display = invalid ? 'block' : '';
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const title = titleInput.value.trim();
      const dueDate = dueInput.value;
      const titleValid = title.length >= 3 && title.length <= 80;
      const dateValid = Boolean(dueDate) && dueDate >= toDateInputValue(new Date());
      setInvalid(titleInput, !titleValid, 'title-error');
      setInvalid(dueInput, !dateValid, 'due-error');
      if (!titleValid || !dateValid) {
        showToast('Please correct the highlighted fields before saving.', 'Check your task');
        (!titleValid ? titleInput : dueInput).focus();
        return;
      }
      const tasks = Store.getTasks();
      const newTask = {
        id: (window.crypto && typeof window.crypto.randomUUID === 'function') ? window.crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        subject: document.getElementById('task-subject').value,
        priority: document.getElementById('task-priority').value,
        dueDate,
        notes: notesInput.value.trim(),
        completed: false,
        createdAt: Date.now()
      };
      tasks.push(newTask);
      const saved = Store.saveTasks(tasks);
      form.reset();
      dueInput.value = toDateInputValue(new Date());
      document.getElementById('task-subject').value = 'General';
      document.getElementById('task-priority').value = 'medium';
      document.getElementById('notes-count').textContent = '0';
      titleInput.classList.remove('is-invalid'); dueInput.classList.remove('is-invalid');
      titleInput.setAttribute('aria-invalid', 'false'); dueInput.setAttribute('aria-invalid', 'false');
      refresh();
      showToast(saved ? 'Your new task has been added.' : 'Task added for this session, but browser storage may be unavailable.', 'Task saved');
      titleInput.focus();
    });

    [titleInput, dueInput].forEach(input => input.addEventListener('input', () => {
      input.classList.remove('is-invalid'); input.setAttribute('aria-invalid', 'false');
    }));
    notesInput.addEventListener('input', () => { document.getElementById('notes-count').textContent = String(notesInput.value.length); });
    [searchInput, filterInput, sortInput].forEach(input => input.addEventListener(input === searchInput ? 'input' : 'change', refresh));

    taskList.addEventListener('change', event => {
      const input = event.target.closest('[data-action="toggle"]');
      if (!input) return;
      const row = input.closest('[data-task-id]');
      const tasks = Store.getTasks();
      const task = tasks.find(item => item.id === row.dataset.taskId);
      if (!task) return;
      task.completed = input.checked;
      Store.saveTasks(tasks);
      refresh();
      showToast(task.completed ? 'Nice work. Task marked complete.' : 'Task moved back to your pending list.', 'Progress updated');
    });

    taskList.addEventListener('click', event => {
      const button = event.target.closest('[data-action="delete"]');
      if (!button) return;
      const row = button.closest('[data-task-id]');
      const tasks = Store.getTasks();
      const task = tasks.find(item => item.id === row.dataset.taskId);
      if (!task) return;
      Store.saveTasks(tasks.filter(item => item.id !== task.id));
      refresh();
      showToast('The task was removed from your list.', 'Task deleted');
    });

    clearButton.addEventListener('click', () => {
      const tasks = Store.getTasks();
      const remaining = tasks.filter(task => !task.completed);
      if (remaining.length === tasks.length) {
        showToast('There are no completed tasks to clear.', 'Nothing to clear');
        return;
      }
      Store.saveTasks(remaining);
      refresh();
      showToast('Completed tasks have been cleared.', 'List updated');
    });

    refresh();
  });
})();
