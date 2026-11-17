/* Curated learning links with search, category filters, sorting, and local bookmarks. */
(function () {
  'use strict';
  const RESOURCES = [
    { id: 'mdn-js', title: 'JavaScript Guide', provider: 'MDN Web Docs', category: 'coding', symbol: 'JS', description: 'A detailed guide to JavaScript concepts, syntax, objects, functions, and browser APIs.', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
    { id: 'freecodecamp', title: 'FreeCodeCamp', provider: 'freeCodeCamp', category: 'coding', symbol: '⌘', description: 'Practice programming through hands-on lessons and project-based learning paths.', url: 'https://www.freecodecamp.org/learn/' },
    { id: 'python-docs', title: 'Python Tutorial', provider: 'Python Documentation', category: 'coding', symbol: 'Py', description: 'The official tutorial for learning Python fundamentals and core language features.', url: 'https://docs.python.org/3/tutorial/' },
    { id: 'git-book', title: 'Pro Git Book', provider: 'Git SCM', category: 'coding', symbol: '⑂', description: 'Learn version control concepts, branching, commits, and everyday Git workflows.', url: 'https://git-scm.com/book/en/v2' },
    { id: 'bootstrap', title: 'Bootstrap Documentation', provider: 'Bootstrap', category: 'web', symbol: 'B', description: 'Explore responsive layout, components, utilities, and accessible UI patterns.', url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/' },
    { id: 'mdn-html', title: 'HTML Learning Area', provider: 'MDN Web Docs', category: 'web', symbol: 'H5', description: 'Build a strong foundation in semantic HTML, forms, and document structure.', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    { id: 'mdn-css', title: 'CSS Learning Area', provider: 'MDN Web Docs', category: 'web', symbol: '#', description: 'Understand styling, layout, responsive design, and visual presentation.', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' },
    { id: 'web-dev', title: 'web.dev Learn', provider: 'Google web.dev', category: 'web', symbol: '↗', description: 'Study practical guidance for performance, accessibility, and modern web development.', url: 'https://web.dev/learn/' },
    { id: 'w3schools', title: 'HTML, CSS & JS Reference', provider: 'W3Schools', category: 'web', symbol: 'W3', description: 'Quick examples and references for common frontend development tasks.', url: 'https://www.w3schools.com/' },
    { id: 'learning-how-to-learn', title: 'Learning How to Learn', provider: 'Coursera', category: 'study', symbol: '✦', description: 'Explore learning strategies such as focused practice, recall, and chunking.', url: 'https://www.coursera.org/learn/learning-how-to-learn' },
    { id: 'anki', title: 'Anki Flashcards', provider: 'Anki', category: 'study', symbol: '▤', description: 'Use spaced repetition to review information and strengthen long-term recall.', url: 'https://apps.ankiweb.net/' },
    { id: 'purdue-owl', title: 'Writing Lab', provider: 'Purdue OWL', category: 'study', symbol: 'Aa', description: 'Find writing, citation, research, and academic communication guidance.', url: 'https://owl.purdue.edu/' }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'library' || !window.StudyNest) return;
    const { Store, safeText, showToast, renderDashboard } = window.StudyNest;
    const grid = document.getElementById('resource-grid');
    const search = document.getElementById('resource-search');
    const sort = document.getElementById('resource-sort');
    const savedToggle = document.getElementById('saved-toggle');
    const resultText = document.getElementById('resource-result-text');
    let category = 'all';
    let savedOnly = false;

    function currentBookmarks() { return Store.getBookmarks(); }

    function getResources() {
      const query = search.value.trim().toLocaleLowerCase();
      let resources = RESOURCES.filter(resource => {
        const matchesCategory = category === 'all' || resource.category === category;
        const matchesSaved = !savedOnly || currentBookmarks().includes(resource.id);
        const searchable = `${resource.title} ${resource.provider} ${resource.description} ${resource.category}`.toLocaleLowerCase();
        return matchesCategory && matchesSaved && (!query || searchable.includes(query));
      });
      if (sort.value === 'az') resources.sort((a, b) => a.title.localeCompare(b.title));
      return resources;
    }

    function render() {
      const bookmarks = currentBookmarks();
      const resources = getResources();
      savedToggle.setAttribute('aria-pressed', String(savedOnly));
      savedToggle.innerHTML = `<span aria-hidden="true">${savedOnly ? '♥' : '♡'}</span> Saved <span class="saved-count" id="saved-count">${bookmarks.length}</span>`;
      if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state surface-card" style="grid-column:1/-1"><span class="empty-icon" aria-hidden="true">⌕</span><h3>No resources found</h3><p>Try another keyword, category, or saved filter.</p></div>';
      } else {
        grid.innerHTML = resources.map(resource => {
          const isSaved = bookmarks.includes(resource.id);
          const symbolClass = resource.category === 'web' ? 'web' : resource.category === 'study' ? 'study' : '';
          const categoryLabel = resource.category === 'web' ? 'WEB DESIGN' : resource.category === 'study' ? 'STUDY SKILLS' : 'CODING';
          return `<article class="resource-card"><div class="resource-top"><span class="resource-symbol ${symbolClass}" aria-hidden="true">${safeText(resource.symbol)}</span><button class="resource-bookmark ${isSaved ? 'saved' : ''}" type="button" data-bookmark="${safeText(resource.id)}" aria-label="${isSaved ? 'Remove' : 'Save'} ${safeText(resource.title)} ${isSaved ? 'from' : 'to'} saved resources" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button></div><span class="resource-category">${categoryLabel} · ${safeText(resource.provider)}</span><h3>${safeText(resource.title)}</h3><p>${safeText(resource.description)}</p><a class="resource-link" href="${safeText(resource.url)}" target="_blank" rel="noopener noreferrer">Visit resource <span aria-hidden="true">↗</span></a></article>`;
        }).join('');
      }
      resultText.textContent = `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'} ${savedOnly ? 'in your saved list' : 'to explore'}.`;
      renderDashboard();
    }

    document.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        category = button.dataset.category;
        document.querySelectorAll('[data-category]').forEach(chip => {
          const active = chip === button;
          chip.classList.toggle('active', active);
          chip.setAttribute('aria-pressed', String(active));
        });
        render();
      });
    });
    search.addEventListener('input', render);
    sort.addEventListener('change', render);
    savedToggle.addEventListener('click', () => { savedOnly = !savedOnly; render(); });
    grid.addEventListener('click', event => {
      const button = event.target.closest('[data-bookmark]');
      if (!button) return;
      const resourceId = button.dataset.bookmark;
      const bookmarks = currentBookmarks();
      const alreadySaved = bookmarks.includes(resourceId);
      Store.saveBookmarks(alreadySaved ? bookmarks.filter(id => id !== resourceId) : [...bookmarks, resourceId]);
      const resource = RESOURCES.find(item => item.id === resourceId);
      showToast(alreadySaved ? 'Removed from your saved list.' : 'Added to your saved list.', alreadySaved ? 'Bookmark removed' : 'Resource saved');
      render();
    });

    render();
  });
})();
