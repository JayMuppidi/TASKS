# Task Management System

This is a web-based task management system developed using the MERN stack (MongoDB, Express, React, Node.js). The system allows users to create, update, and delete tasks, while providing user authentication and authorization. It also includes an admin dashboard with task visualization using D3.js.

## Features

- **User Authentication**: Users can sign up and log in to access the task management system. Authentication ensures that only authenticated users can perform CRUD operations on tasks.

- **Task CRUD Operations**: Users can create, read, update, and delete tasks. Each task includes the following information:
  - Title: A brief title describing the task.
  - Description: Additional details or instructions for the task.
  - Due Date: The deadline or due date for the task.
  - Status: The current status of the task (e.g., Pending, In Progress, Completed).
  - Assigned User: The user assigned to the task.

- **Admin Dashboard**: The system includes an admin dashboard where administrators can view and manage tasks for all users. The dashboard provides options to filter, sort, and search for tasks based on various criteria, such as status, due date, or assigned user. The tasks are also visualized using D3.js to provide a graphical representation of task data.


## Technologies Used

- MongoDB: A NoSQL database used for storing task and user data.
- Express: A web application framework for building the server-side API.
- React: A JavaScript library for building the user interface.
- Node.js: A JavaScript runtime environment used for server-side development.
- D3.js: A JavaScript library for data visualization used in the admin dashboard.
- JWT (JSON Web Tokens): Used for user authentication and authorization.
- Chakra UI: A flexible UI component library for styling the application.
