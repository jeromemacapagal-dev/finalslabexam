# StudyNest — Prompt Engineering Log

This log records the prompt techniques used to plan, produce, evaluate, and refine the project. The prompts below are the project-specific task prompts used to direct the AI-assisted work in this build. They are written out in full so the development decisions can be reviewed and explained.

> **Class-framework note:** The examination handout requires the techniques/frameworks discussed in class but does not list their names. This log therefore records broadly recognized techniques (role prompting, context-rich prompting, task decomposition, constraint-based prompting, iterative refinement, and rubric-based evaluation). Compare this list with your actual class notes and add any instructor-taught framework that is missing. Do not claim that an unlisted classroom framework was applied without evidence.

---

## Entry 1 — Project scoping and persona prompting

**Technique or framework:** Role prompting + context-rich prompting + goal definition.

**Purpose:** Ask the AI to choose and scope a student-centered project that is useful, demonstrable within an exam, frontend-only, and capable of meeting the brief's required pages and features.

**Exact prompt:**

```text
Act as a senior frontend developer and practical UI/UX designer helping with a CC211 finals laboratory examination. Create a project plan for a frontend-only student application named StudyNest, a Student Academic Hub. The target users are college students who need a simple way to organize assignment deadlines and keep useful learning links. The exam requires HTML, CSS, JavaScript, Bootstrap, at least three distinct pages or substantial sections with working navigation, at least three meaningful JavaScript features, one validated form, local browser storage where appropriate, accessible labels and focus states, responsive mobile/tablet/desktop layouts, README.md, and PROMPT_LOG.md. Keep the scope realistic for a laboratory demonstration. Return the project problem, target users, objectives, main features, three-page information architecture, data model, and a short acceptance checklist. Do not introduce a backend, login, payment, or features that cannot be demonstrated locally.
```

**Result summary:** The project was scoped into three pages: Overview, Study Planner, and Resource Library. Tasks and resource bookmarks are stored in browser localStorage. The feature plan covers task management, search/filter/sort, date-aware dashboard metrics, resource search/category filters, and saved resources.

**Evaluation:** The scope directly addresses a student need and covers all minimum functional requirements. It avoids backend dependencies and gives the examiner a visible path through each feature. A potential weakness was that the class-specific prompt frameworks were not supplied in the exam handout.

**Improvement:** Keep the three-page boundary and use the assignment rubric as the acceptance checklist. Add a note in this log instructing the student to cross-check the techniques against the actual class framework list rather than assuming completeness.

---

## Entry 2 — Task decomposition and structured planning

**Technique or framework:** Task decomposition / stepwise task planning + structured output constraints.

**Purpose:** Break the project into independently implementable files and features so the pages share a consistent visual language and state model.

**Exact prompt:**

```text
Using the approved StudyNest project scope, decompose implementation into a small, maintainable static website. Use this file structure: index.html; pages/planner.html; pages/library.html; assets/css/styles.css; assets/js/app.js; assets/js/planner.js; assets/js/library.js; assets/images/; docs/screenshots/; README.md; PROMPT_LOG.md. Define the responsibility of each file, the shared localStorage keys and task fields, page navigation paths, and the initialization order for shared and page-specific JavaScript. Keep HTML, CSS, and JavaScript separate. Return a concise implementation checklist and identify path mistakes to avoid on nested pages.
```

**Result summary:** The code was separated into page markup, one shared stylesheet, a shared storage/dashboard script, and separate planner and library scripts. Nested pages use `../assets/...` and `../index.html` paths.

**Evaluation:** The structure matches the suggested exam organization and avoids duplicating state logic. One risk is loading a page-specific script on the wrong page; initialization is guarded by the `data-page` attribute.

**Improvement:** Use a shared `window.StudyNest` interface for storage, escaping, date formatting, notifications, and dashboard refresh; keep page behavior inside its own script.

---

## Entry 3 — Constraint-based implementation prompt

**Technique or framework:** Constraint-based prompting + explicit acceptance criteria + context preservation.

**Purpose:** Direct implementation of the task planner with measurable behavior instead of a decorative checklist.

**Exact prompt:**

```text
Implement the StudyNest Study Planner using vanilla JavaScript and the existing Bootstrap-based visual system. Requirements: (1) add tasks with title, subject, priority, due date, and optional notes; (2) reject a blank/whitespace title, title shorter than 3 characters or longer than 80 characters, a missing due date, and a due date earlier than today; (3) show inline validation and clear user feedback; (4) save tasks in the versioned localStorage key studynest.tasks.v1; (5) allow a user to mark a task complete or pending and delete it; (6) search across title, subject, and notes; (7) filter all/pending/completed; (8) sort by due date, priority, or title; (9) update summary counters; (10) safely render user-entered text so it cannot become HTML. Include empty states, accessible names, keyboard focus, and a graceful message when storage is unavailable. Do not add a server, authentication, or unrelated features.
```

**Result summary:** The planner implements task creation, validation, notes, priority, due date, completion toggling, deletion, clearing completed tasks, search, status filtering, three sort modes, summary counters, empty states, and local persistence.

**Evaluation:** These interactions are meaningful project features and can be demonstrated. Validation is applied before storing data, and task text is escaped before insertion into rendered markup. Browser storage may still be blocked by private or restricted browser settings.

**Improvement:** Keep storage reads/writes inside guarded functions, use a separate storage key version, set a minimum date on the date input, and provide an explicit note that the app is a frontend demonstration.

---

## Entry 4 — Responsive design and accessibility prompt

**Technique or framework:** Requirement-driven prompting + accessibility checklist + responsive-first refinement.

**Purpose:** Ensure that the interface is usable beyond a desktop screenshot and that interactive controls can be understood and operated with assistive technology and a keyboard.

**Exact prompt:**

```text
Review the StudyNest interface as a responsive UI/UX and accessibility specialist. Preserve the existing purple, mint, warm-neutral visual identity and avoid changing the project's scope. Check the Overview, Study Planner, and Resource Library at mobile (approximately 375 px), tablet (approximately 768 px), and desktop (approximately 1280 px) widths. Ensure navigation collapses cleanly, cards and grids reflow without horizontal overflow, forms remain readable, labels are associated with inputs, buttons have accessible names, focus is visible, page landmarks are semantic, status changes are announced, external links are safe, and reduced-motion preferences are respected. Propose concrete CSS/HTML changes, not general advice.
```

**Result summary:** The shared layout includes desktop/tablet/mobile breakpoints, a collapsing Bootstrap navbar, responsive card and resource grids, semantic landmarks, a skip link, form labels, accessible button names, live regions, visible focus styles, and reduced-motion support.

**Evaluation:** The implementation addresses the exam's explicit accessibility and responsive requirements. A final manual check is still needed on the student's target browser/device, particularly for the actual browser console and any CDN/network restrictions.

**Improvement:** Capture the application at desktop and mobile sizes, run the app through a local static server, and test form interactions and layout overflow in a real browser before submission.

---

## Entry 5 — Iterative refinement and rubric-based self-evaluation

**Technique or framework:** Iterative prompting / self-critique + rubric-based evaluation + error correction.

**Purpose:** Evaluate the application against the exam's scoring categories and identify practical corrections before delivery.

**Exact prompt:**

```text
Act as a strict CC211 laboratory examiner. Evaluate the completed StudyNest project against these rubric weights: Prompt Engineering Techniques and Frameworks (25), Functionality and JavaScript (25), UI/UX and Responsive Design (20), Code Organization and Quality (10), Git and GitHub Workflow (10), Documentation and Demonstration (10). Check whether there are at least three navigable pages, three meaningful JavaScript features, a validated form, localStorage behavior, responsive layouts, accessible labels and focus, working links/buttons, separated HTML/CSS/JavaScript, README.md, and PROMPT_LOG.md. Identify specific defects or unverifiable requirements. Do not award credit for an action that has not actually been performed, such as a GitHub push or a browser test that was not run. Return prioritized corrections and a submission checklist.
```

**Result summary:** The review checklist led to explicit empty states, escaped task text, clearer date validation, storage error handling, safe external-link attributes, dynamic dashboard counters, responsive breakpoints, and documentation of limitations and uncompleted GitHub evidence.

**Evaluation:** The deliverable includes the source, documentation, and static HTML/CSS render previews. Node syntax checks, static HTML path/ID/label checks, CSS parsing, and shared storage-helper tests passed. A live browser interaction pass could not be run because the build environment blocked local-page navigation. A successful GitHub push, instructor-accessible repository, and terminal screenshots cannot be honestly claimed until the student runs the command-line workflow using their own GitHub account.

**Improvement:** Keep the GitHub steps in the README, create the required repository, make at least three meaningful commits from Git Bash or CMD, push to `main`, verify remote contents, and save the actual terminal screenshots in `docs/screenshots/`.

---

## Final prompt-quality checklist

- [x] Role and project context are stated.
- [x] Intended users and the problem are explicit.
- [x] Required technology and frontend-only constraint are named.
- [x] Functional behavior is described with acceptance criteria.
- [x] Expected output and file structure are specified.
- [x] Accessibility, responsiveness, and data persistence are included.
- [x] Evaluation and improvement are documented.
- [ ] Class-specific frameworks have been cross-checked against the student's actual lecture notes.
