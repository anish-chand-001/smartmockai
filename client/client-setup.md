# Client Setup Guide

## Prerequisites

Before setting up the client, make sure the following software is installed:

* Node.js (v18 or later recommended)
* npm (comes with Node.js)
* Git

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# 1. Create the React Application

Create a new React application using Vite.

```bash
npm create vite@latest client -- --template react
```

Navigate into the project:

```bash
cd client
```

Install the default dependencies:

```bash
npm install
```

---

# 2. Install Project Dependencies

Install all production dependencies used in this project.

```bash
npm install react react-dom react-router-dom axios firebase react-icons motion @reduxjs/toolkit react-redux @tailwindcss/vite
```

Install development dependencies.

```bash
npm install -D vite @vitejs/plugin-react oxlint
```

---

# 3. Configure Tailwind CSS

This project uses **Tailwind CSS v4** with the Vite plugin.

Update `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

# 4. Configure Global CSS

Replace the contents of `src/index.css`

```css
@import "tailwindcss";
```

---

# 5. Configure Environment Variables

Create a `.env` file inside the client root.

```env
VITE_API_URL=http://localhost:8000/api

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Access variables anywhere inside the project.

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

# 6. Firebase Setup

Create a file:

```
src/config/firebase.js
```

Example configuration:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
```

---

# 7. Project Dependencies

## React

Used for building reusable user interface components.

Package:

```bash
npm install react react-dom
```

---

## React Router DOM

Provides client-side routing for navigation between pages.

Package:

```bash
npm install react-router-dom
```

Example uses:

* Login
* Register
* Dashboard
* Profile
* Protected Routes

---

## Axios

HTTP client for communicating with the backend API.

Package:

```bash
npm install axios
```

Example:

```javascript
axios.get("/api/users");
```

---

## Firebase

Used for Google Authentication and other Firebase services.

Package:

```bash
npm install firebase
```

Current usage:

* Google Sign-In
* Authentication

---

## Motion

Animation library for React applications.

Package:

```bash
npm install motion
```

Used for:

* Page transitions
* Fade animations
* Hover effects
* Loading animations

---

## React Icons

Provides thousands of SVG icons.

Package:

```bash
npm install react-icons
```

Example:

```javascript
import { FcGoogle } from "react-icons/fc";
```

---

## Redux Toolkit

Official state management library for React.

Package:

```bash
npm install @reduxjs/toolkit react-redux
```

Used for:

* User authentication state
* Global application state
* API response management

---

## Tailwind CSS

Utility-first CSS framework.

Installed using:

```bash
npm install @tailwindcss/vite
```

Used for:

* Responsive layouts
* Utility classes
* Fast UI development

---

## Oxlint

Fast JavaScript/TypeScript linter.

Package:

```bash
npm install -D oxlint
```

Run:

```bash
npm run lint
```

---

# 8. Run the Development Server

Start the Vite development server.

```bash
npm run dev
```

By default, the application runs at:

```
http://localhost:5173
```

---

# 9. Production Build

Create an optimized production build.

```bash
npm run build
```

Preview the production build locally.

```bash
npm run preview
```

---

# 10. Project Structure (Recommended)

```
client/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── utils/
│   │   └── firebase.js
│   ├── pages/
│   ├── redux/
│   ├── services/
│   ├── hooks/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

# Tech Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 19         | Frontend Library        |
| Vite             | Build Tool              |
| Tailwind CSS v4  | Styling                 |
| React Router DOM | Routing                 |
| Axios            | API Requests            |
| Firebase         | Google Authentication   |
| Redux Toolkit    | Global State Management |
| React Redux      | Redux Integration       |
| Motion           | Animations              |
| React Icons      | Icons                   |
| Oxlint           | Code Linting            |

---

# Available Scripts

Start development server

```bash
npm run dev
```

Build production bundle

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

Run linter

```bash
npm run lint
```
