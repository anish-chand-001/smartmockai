# Client Setup Guide

## Prerequisites

Before starting, ensure the following are installed:

* Node.js (v18+ recommended)
* npm or yarn
* Git

Verify installation:

```bash
node -v
npm -v
```

---

## 1. Create Vite React Application

```bash
npm create vite@latest client -- --template react
```

Navigate into the project:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

---

## 2. Install Tailwind CSS

Install Tailwind CSS and Vite plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## 3. Configure Vite

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 4. Configure CSS

Replace the contents of `src/index.css`:

```css
@import "tailwindcss";
```

---

## 5. Install Additional Dependencies

### Routing

```bash
npm install react-router-dom
```

### HTTP Requests

```bash
npm install axios
```

### Icons

```bash
npm install react-icons
```

### Notifications

```bash
npm install react-hot-toast
```

### State Management (Optional)

```bash
npm install zustand
```

---

## 6. Environment Variables

Create a `.env` file in the client root:

```env
VITE_API_URL=http://localhost:5000/api
```

Access environment variables:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 7. Run Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## 8. Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Project Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios

---
