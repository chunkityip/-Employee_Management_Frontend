# Employee Management System

A full-stack Angular application for managing employee records within an organization. The app provides user authentication, an employee directory with CRUD operations, domain-based filtering, and search functionality.

## Features

- **User Authentication** -- Secure sign-in with email and password. Displays a success message and redirects upon login.
- **Employee Directory** -- View all employees in a paginated table displaying ID, name, date of birth, phone, email, experience, and domain.
- **Add / Edit / Delete Employees** -- Full CRUD operations accessible from the directory via action buttons.
- **Domain Filtering** -- Filter employees by domain (Backend, DevOps, Frontend, Fullstack, QA) using a dropdown selector.
- **Search** -- Quickly find employees through the search feature in the navigation bar.
- **Export** -- Export employee data from the directory.
- **Dashboard Summary** -- At-a-glance stats showing total employees and number of departments.

## Screenshots

### Sign In
Secure login page with email and password fields.

![Sign In](screenshots/login.png)

### Employee Directory
Main dashboard showing employee count, departments, and a full employee table with edit/delete actions.

![Employee Directory](screenshots/dashboard.png)

### Domain Filter
Dropdown filter to view employees by domain (Backend, DevOps, Frontend, Fullstack, QA) with paginated results.

![Domain Filter](screenshots/domain-filter.png)

## Tech Stack

- **Frontend:** Angular 14
- **UI Components:** Angular Material, AG Grid
- **Styling:** CSS with glassmorphism design
- **Testing:** Karma + Jasmine

## Getting Started

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng test --code-coverage` to generate a coverage report at `coverage/manage-employees/index.html`.
