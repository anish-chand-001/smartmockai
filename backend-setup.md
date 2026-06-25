# Backend Setup Guide

## 1. Initialize Project

```bash
npm init -y
```

---

## 2. Install Production Dependencies

```bash
npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs
```

### Package Purpose

| Package       | Purpose                         |
| ------------- | ------------------------------- |
| express       | Backend framework               |
| mongoose      | MongoDB ODM                     |
| dotenv        | Environment variable management |
| cors          | Cross-Origin Resource Sharing   |
| cookie-parser | Parse cookies from requests     |
| jsonwebtoken  | JWT authentication              |
| bcryptjs      | Password hashing                |

---

## 3. Install Development Dependencies

```bash
npm install --save-dev nodemon
```

### Package Purpose

| Package | Purpose                                          |
| ------- | ------------------------------------------------ |
| nodemon | Automatically restarts server during development |

---

## 4. Configure Scripts

Add the following scripts to `package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

---

## 5. Create Environment File

Create a `.env` file in the project root:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

NODE_ENV=development
```

---

## 6. Start Development Server

```bash
npm run dev
```

---

## 7. Start Production Server

```bash
npm start
```
