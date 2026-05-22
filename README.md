# Avidus Interactive — Task Management System

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

A full-stack role-based task management application with Admin dashboard, activity tracking, and protected routes.

---

## 🔗 Links

|                  | URL                                                                               |
| ---------------- | --------------------------------------------------------------------------------- |
| 🌐 Frontend Live | `https://avidus-interactive.vercel.app`                                           |
| ⚙️ Backend API   | `https://avidus-interactive.onrender.com`                                         |
| 📁 GitHub Repo   | `https://github.com/Shiakh0112/Avidus-Interactive/tree/feature/role-based-access` |
| 🔀 Clone URL     | `https://github.com/Shiakh0112/Avidus-Interactive.git`                            |

> ⚠️ Update these links after deployment.

---

## 🔐 Demo Credentials

### Admin Account

| Field    | Value                       |
| -------- | --------------------------- |
| Email    | `khatikashfaq992@gmail.com` |
| Password | `Shaikh0112`                |
| Role     | Admin                       |

### User Account

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `khanashfaq9423@gmail.com` |
| Password | `shaikh0112`               |
| Role     | User                       |

---

## ✨ Features

### Role-Based Access Control

- **Admin** — Full access: manage users, view all tasks, activity logs, analytics
- **User** — Restricted access: create, view, update, delete only their own tasks

### Backend

- ✅ JWT Authentication (Register / Login)
- ✅ Role-based middleware (`protect`, `adminOnly`)
- ✅ User roles in schema — `Admin` / `User`
- ✅ User status management — `Active` / `Inactive`
- ✅ Activity log system — tracks Login, Task Created, Updated, Deleted
- ✅ Admin APIs — view all users/tasks, delete users, manage status
- ✅ Input validation & sanitization
- ✅ Secure CORS configuration

### Frontend

- ✅ Login & Register with role selection
- ✅ User Dashboard — personal task CRUD
- ✅ Admin Dashboard — User Management, Task Monitoring, Activity Logs
- ✅ Analytics section — Total users, tasks, completed, pending
- ✅ Role-based navigation (Admin menu hidden from Users)
- ✅ Protected & Admin-only routes
- ✅ Professional UI with React Icons
- ✅ Responsive design

---

## 🗂️ Project Structure

```
Avidus-Interactive/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, Login
│   │   ├── taskController.js       # User task CRUD
│   │   └── adminController.js      # Admin APIs + stats
│   ├── middleware/
│   │   ├── auth.js                 # protect + adminOnly
│   │   └── logger.js               # Activity logger
│   ├── models/
│   │   ├── User.js                 # User schema (role, status)
│   │   ├── Task.js                 # Task schema
│   │   └── ActivityLog.js          # Activity log schema
│   ├── routes/
│   │   ├── auth.js                 # /api/auth
│   │   ├── tasks.js                # /api/tasks
│   │   └── admin.js                # /api/admin
│   ├── .env
│   ├── .gitignore
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.js            # Axios instance + interceptor
│       ├── components/
│       │   ├── Navbar.jsx          # Role-based navigation
│       │   └── ProtectedRoute.jsx  # Route guards
│       ├── context/
│       │   └── AuthContext.jsx     # Auth state management
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx       # User task manager
│           └── admin/
│               ├── AdminStats.jsx  # Analytics cards
│               ├── UserManagement.jsx
│               ├── TaskMonitoring.jsx
│               └── ActivityLogs.jsx
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Avidus-Interactive.git
cd Avidus-Interactive
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
```

Start backend:

```bash
node server.js
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`  
Backend runs at: `http://localhost:5000`

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint    | Access | Description           |
| ------ | ----------- | ------ | --------------------- |
| POST   | `/register` | Public | Register new user     |
| POST   | `/login`    | Public | Login & get JWT token |

### Task Routes — `/api/tasks`

| Method | Endpoint | Access | Description     |
| ------ | -------- | ------ | --------------- |
| GET    | `/`      | User   | Get own tasks   |
| POST   | `/`      | User   | Create task     |
| PUT    | `/:id`   | User   | Update own task |
| DELETE | `/:id`   | User   | Delete own task |

### Admin Routes — `/api/admin`

| Method | Endpoint            | Access | Description            |
| ------ | ------------------- | ------ | ---------------------- |
| GET    | `/stats`            | Admin  | Analytics data         |
| GET    | `/users`            | Admin  | All users              |
| DELETE | `/users/:id`        | Admin  | Delete user            |
| PATCH  | `/users/:id/status` | Admin  | Toggle Active/Inactive |
| GET    | `/tasks`            | Admin  | All tasks              |
| DELETE | `/tasks/:id`        | Admin  | Delete any task        |
| GET    | `/logs`             | Admin  | Activity logs          |

---

## 🛡️ Security

- Passwords hashed with **bcryptjs**
- Auth via **JWT Bearer tokens** (7 day expiry)
- CORS restricted to frontend origin only
- Input validation & sanitization on all endpoints
- Status field whitelist validation (`Pending` / `Completed` only)
- Admin-only routes protected by `adminOnly` middleware
- Inactive users blocked from login

---

## 🌿 Git Workflow

```
main
└── feature/role-based-access   ← current branch
```

```bash
# Branch created
git checkout -b feature/role-based-access

# Changes committed
git add .
git commit -m "feat: role-based access, admin dashboard, activity logs"

# Push & PR
git push origin feature/role-based-access
```

---

## 🧰 Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Frontend    | React 18, Vite, React Router v6, React Icons |
| Backend     | Node.js, Express.js                          |
| Database    | MongoDB Atlas, Mongoose                      |
| Auth        | JWT, bcryptjs                                |
| HTTP Client | Axios                                        |
| Styling     | CSS-in-JS (inline styles)                    |

---

## 👨‍💻 Author

**Shaikh Ashfaq**  
📧 khatikashfaq992@gmail.com  
🔗 GitHub: `https://github.com/your-username`

---

## 📄 License

This project is licensed under the MIT License.
