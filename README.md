# StudyNest — Student Academic Hub

> A responsive, frontend-only student workspace built for the CC211 – Application Development and Emerging Technologies Finals Laboratory Examination (A.Y. 2025–2026).

## Project overview

**StudyNest** brings a student's everyday academic planning into one simple space. Students can keep track of assignments, organize work by subject and priority, and bookmark useful learning websites without needing to create an account.

### Problem being addressed

Students often keep due dates, reminders, and learning links in separate places. This makes it easy to overlook a task or lose a useful reference. StudyNest provides one lightweight place to organize those items.

### Target users

- College students managing multiple subjects and deadlines.
- Learners who want a simple assignment checklist and a small collection of study references.

### Objectives

1. Make it easy to record and prioritize academic tasks.
2. Show a quick overview of pending and completed work.
3. Help students find and save relevant learning resources.
4. Demonstrate responsive UI design and browser-based data persistence using HTML, CSS, JavaScript, and Bootstrap.

## Pages and main features

| Page | What it does |
|---|---|
| **Overview** (`index.html`) | Date-aware welcome area, task and bookmark counts, today's focus list, and task-completion progress. |
| **Study planner** (`pages/planner.html`) | Add tasks with validation; choose a subject, due date, and priority; add notes; search, filter, and sort tasks; mark tasks complete; delete tasks; clear completed tasks. |
| **Resource library** (`pages/library.html`) | Browse curated coding, web design, and study-skills links; search and filter resources; sort alphabetically; save or remove bookmarks. |

### Meaningful JavaScript functionality

- **Task CRUD:** create tasks, mark them complete or pending, and delete them.
- **Search, filter, and sort:** locate tasks by title, subject, or notes; view pending/completed tasks; sort by date, priority, or title.
- **Resource discovery:** search resources, filter by category, sort A–Z, and switch to saved-only view.
- **Browser storage:** task records and saved resource IDs persist in `localStorage` on the current browser/device.
- **Live dashboard summaries:** task counts and completion progress update when data changes.
- **Form validation and feedback:** required title and due date checks, length constraints, inline errors, and accessible status toasts.

## Technologies

- HTML5 for semantic page structure.
- CSS3 for the StudyNest visual system and responsive layouts.
- JavaScript (ES6+) for application behavior and `localStorage`.
- Bootstrap 5.3.3 for the responsive navbar, grid, form controls, and component styling.
- Google Fonts (DM Sans and Manrope) for typography.

No backend, account system, database, or build step is required. The application is a **frontend demonstration**. Data is stored only in the browser where the app is opened.

## How to open and use the application

### Option A — Open locally

1. Download or clone this repository.
2. Keep the project folder structure unchanged.
3. Open `index.html` in a modern browser.
4. For the most reliable local experience, use a simple static server (Option B), particularly if the browser restricts local-file behavior.

### Option B — Run with a local server

If Python is installed, open a terminal in the project folder and run:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

### Using StudyNest

- **Overview:** review the summary cards and choose an action.
- **Study planner:** complete the required task title and due date, select a subject and priority, then choose **Save task**. Use the search and dropdown controls to find tasks. Tick a task to change its completion state; use the × control to delete it.
- **Resource library:** search by a topic or provider, choose a category, and select the heart to save a link. Use **Saved** to see bookmarked links only. External resources open in a new tab.

The first visit seeds a few sample tasks so the interface can be demonstrated immediately. Changes made after that are retained in the browser. Clearing the browser's site data removes those local records. Use a fresh browser profile or clear the `studynest.*.v1` localStorage entries to restore the first-visit sample state.

## Student information

- **Student name:** `[Enter your full name]`
- **Section:** `[Enter your section]`
- **Course:** CC211 – Application Development and Emerging Technologies
- **Examination:** Finals Laboratory Examination, A.Y. 2025–2026

Replace the student name and section placeholders before submission.

## AI tools and contributions

- **ChatGPT (OpenAI):** assisted with project scoping, interface planning, HTML/CSS/JavaScript drafting, accessibility considerations, prompt-log preparation, and code review.
- **Student responsibility:** review the source code, test the app on the target device, personalize the student details, and be prepared to explain every feature. The application is a frontend demo, not a production student information system.

See [`PROMPT_LOG.md`](PROMPT_LOG.md) for the recorded prompt techniques, prompts, evaluations, and refinements. The exam handout does not enumerate the prompt-engineering frameworks taught in class; compare the recorded techniques with the instructor's list and add any missing class-specific frameworks.

## Testing performed and corrections made

The project was reviewed against the exam checklist. The following checks are included in the verification workflow:

| Area | Check / correction |
|---|---|
| Navigation | Static inspection found that all local navigation and asset paths resolve; click through all three pages in your browser before submission. |
| Task form | Validation logic is implemented for required title/date, whitespace-only and too-short titles, title length, and past dates. Run the valid/invalid form cases in your browser before submission. |
| Task interactions | Add, complete/reopen, delete, clear-completed, search, status filter, and three sort modes are implemented. Complete the interaction smoke test in a browser. |
| Resource interactions | Search, category chips, A–Z sorting, saved-only view, and bookmark toggles are implemented. Confirm the flow in a browser. |
| Browser storage | Tasks and bookmarks use separate versioned `localStorage` keys. Shared storage helpers passed a mocked-storage test; confirm real browser persistence after refresh. |
| Responsive layout | Breakpoints are defined for desktop, tablet, and mobile widths. Inspect the live pages at phone, tablet, and desktop widths to confirm no overflow. |
| Accessibility | Source review confirms semantic landmarks, skip link, label/input associations, live regions, button names, visible focus styling, and reduced-motion handling. Test keyboard focus and screen-reader announcements on your device. |
| Content safety | Static code review confirms user-entered task text is HTML-escaped before rendering and external resource links use `rel="noopener noreferrer"`. |

**Verification limitation:** Chromium in the build environment blocked navigation to both local files and the local static server, so a live browser interaction test and browser-console inspection could not be completed here. The three JavaScript files passed Node syntax checks; HTML local-path/ID/label checks passed; CSS parsing passed; and the shared storage/date/escaping helpers passed a mocked-`localStorage` test. The screenshots in `docs/screenshots/` are static HTML/CSS render previews populated with example content, not interactive browser captures.

**Manual checks to complete on your own device before submission:** test at least one valid and two invalid form submissions; add/search/filter/sort/complete/delete tasks; bookmark a resource and refresh; test a phone-sized viewport; inspect the browser console; and verify real browser storage persistence. Capture real application screenshots (desktop, mobile, and a working feature) for submission. Record any device-specific issues below.

### Issues found and corrections made during review

- Replaced purely decorative dashboard placeholders with summaries derived from saved task and bookmark data.
- Added inline validation and useful feedback for empty/short task titles and missing or past due dates.
- Added empty states for searches and filters that return no results.
- Added HTML escaping for task text and safe attributes for third-party resource links.
- Added responsive breakpoints, keyboard focus styles, a skip link, live status regions, and reduced-motion support.
- Kept sample content clearly labeled as demonstration data; no authentication or backend is implied.

## Known limitations

- Data is local to the browser and device. It does not synchronize between devices or users.
- There is no authentication, server, database, cloud backup, or real student-record integration.
- Sample tasks are generated for demonstration on first visit; dates are relative to the date the app is first opened.
- Resource links lead to third-party websites and may change outside this project.
- Bootstrap and Google Fonts are loaded from CDNs, so those parts require an internet connection. The custom stylesheet and application logic are local.
- `localStorage` may be unavailable in some private-browsing or restricted browser environments; the application logs storage failures and can continue for the current page session, but persistence may not work.

## External resource credits

- [Bootstrap 5.3](https://getbootstrap.com/) — responsive framework and component styles.
- [Google Fonts](https://fonts.google.com/) — DM Sans and Manrope typefaces.
- [MDN Web Docs](https://developer.mozilla.org/) — JavaScript, HTML, and CSS learning links listed in the resource library.
- [freeCodeCamp](https://www.freecodecamp.org/), [Python Documentation](https://docs.python.org/3/), [Git SCM](https://git-scm.com/book/en/v2), [web.dev](https://web.dev/), [W3Schools](https://www.w3schools.com/), [Coursera](https://www.coursera.org/), [Anki](https://apps.ankiweb.net/), and [Purdue OWL](https://owl.purdue.edu/) — third-party learning links.
- `assets/images/study-desk.svg` — original vector illustration created for this project.

## Screenshots

Static page-render previews (desktop overview, planner, library, and mobile overview) are stored in [`docs/screenshots/`](docs/screenshots/). They are visual previews generated from the HTML/CSS with representative sample content, not interactive browser captures. Before class submission, capture your own screenshots from the application running in your browser at desktop and mobile sizes, and include a screenshot of a working feature. Add the two required Git screenshots after pushing from Git Bash or CMD:

- `git-successful-push.png` — terminal showing a successful `git push`.
- `git-commit-history.png` — terminal showing the commit history (`git log --oneline`).

Do not use mock screenshots for these Git deliverables; capture your own terminal after the commands complete successfully.

## Git and GitHub command-line workflow

The assignment requires a command-line upload, at least three meaningful commits, and an instructor-accessible repository. Create an empty repository on GitHub, then open Git Bash or CMD in this project folder. Replace `YOUR-USERNAME` with your GitHub username.

```bash
git init
git add .gitignore index.html pages/ assets/css/ assets/images/
git commit -m "chore: create StudyNest pages and visual foundation"

git add assets/js/app.js assets/js/planner.js
git commit -m "feat: add dashboard and interactive study planner"

git add assets/js/library.js README.md PROMPT_LOG.md docs/
git commit -m "feat: add saved resource library and project documentation"

git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/studynest-student-hub.git
git push -u origin main
```

Verify the repository contents and commit history:

```bash
git status
git log --oneline
```

Capture the required terminal screenshots and confirm that the repository visibility/access settings allow your instructor to view it. If Git reports that a remote named `origin` already exists, inspect it with `git remote -v` and update it with `git remote set-url origin https://github.com/YOUR-USERNAME/studynest-student-hub.git` rather than adding a duplicate.

## Suggested demonstration flow

1. Open the Overview page and explain how task totals and completion progress are calculated.
2. Open the Study planner, add a valid task, then demonstrate an invalid submission and the inline feedback.
3. Search for the task, filter to pending tasks, change the sort mode, mark it complete, and delete another task.
4. Refresh the page to demonstrate browser persistence.
5. Open the Resource library, filter to Coding, bookmark a resource, switch to Saved, and open one external link.
6. Resize the browser to show the responsive layout and explain the known frontend-only limitations.
