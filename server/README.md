# SmartMock.AI Server

The SmartMock.AI server is the backend engine for authentication, interview generation, resume analysis, AI scoring, payment verification, credit management, and report retrieval. It exposes a cookie-authenticated Express API used by the React/Vite client and persists user, interview, and payment records in MongoDB through Mongoose models.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Node.js | JavaScript runtime for the API service |
| Framework | Express 5 | HTTP routing, middleware composition, and API handlers |
| Database ODM | Mongoose | MongoDB schema modeling and document persistence |
| Database | MongoDB | Stores users, interviews, questions, scores, and payments |
| Auth | JSON Web Tokens | Signed session token stored in an HTTP-only cookie |
| File Uploads | Multer | Resume upload handling for interview setup |
| Resume Parsing | pdfjs-dist | Extracts text from uploaded PDF resumes |
| AI Provider | OpenRouter | Resume analysis, question generation, and answer evaluation |
| Payments | Razorpay SDK | Order creation and payment verification |
| Verification | Node Crypto | HMAC SHA-256 Razorpay signature validation |

## Database Schema

```mermaid
erDiagram
  User ||--o{ Interview : owns
  User ||--o{ Payment : purchases

  User {
    ObjectId _id PK
    string name
    string email UK
    number credits
    date createdAt
    date updatedAt
  }

  Interview {
    ObjectId _id PK
    ObjectId userId FK
    string role
    string experience
    string mode
    string resumeText
    string[] projects
    string[] skills
    Question[] questions
    number finalScore
    string status
    date createdAt
    date updatedAt
  }

  Question {
    string question
    string answer
    string difficulty
    number timeLimit
    string feedback
    number score
    number confidence
    number communication
    number correctness
    date createdAt
    date updatedAt
  }

  Payment {
    ObjectId _id PK
    ObjectId userId FK
    string razorpayOrderId
    string razorpayPaymentId
    string razorpaySignature
    string planId
    number amount
    string status
    number credits
    date createdAt
    date updatedAt
  }
```

## Environment Variables

Create `server/.env` with the following keys.

| Key | Required | Example | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | Port used by `server.js`. Defaults to `5000` when omitted. |
| `MONGO_URI` | Yes | `mongodb+srv://user:password@cluster.mongodb.net/smartmockai` | MongoDB connection string used by `config/db.js`. |
| `JWT_SECRET` | Yes | `replace-with-a-long-random-secret` | Secret used to sign 7-day JWT session cookies. |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_xxxxxxxxxxxxxx` | Razorpay public key ID used by the server SDK to create orders. |
| `RAZORPAY_KEY_SECRET` | Yes | `xxxxxxxxxxxxxxxxxxxxxxxx` | Razorpay secret used to create orders and verify payment signatures. |
| `OPENROUTER_API_KEY` | Yes | `sk-or-v1-xxxxxxxxxxxxxxxx` | OpenRouter API key used for AI resume analysis, question generation, and answer scoring. |

## API Reference

All private routes expect the JWT cookie set by `POST /api/auth/google`. Requests from the client should include credentials.

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/google` | Public | Authenticates a Google user, creates the user if needed, and sets an HTTP-only JWT cookie. |
| `GET` | `/api/auth/logout` | Public | Clears the auth cookie and ends the session. |
| `GET` | `/api/user/current-user` | Private | Returns the current authenticated user's profile and credits. |
| `POST` | `/api/interview/resume` | Private | Accepts a PDF resume upload, extracts text, and returns AI-structured role, experience, projects, and skills. |
| `POST` | `/api/interview/generate-questions` | Private | Uses profile and resume data to generate five AI interview questions and deducts credits. |
| `POST` | `/api/interview/submit-answer` | Private | Stores an answer and uses AI evaluation to score confidence, communication, correctness, and feedback. |
| `POST` | `/api/interview/finish` | Private | Marks an interview complete and calculates the final interview score. |
| `GET` | `/api/interview/get-interview` | Private | Lists the authenticated user's interview history. |
| `GET` | `/api/interview/report/:id` | Private | Returns a specific interview report for the authenticated user. |
| `POST` | `/api/payment/order` | Private | Creates a Razorpay order and stores a pending payment record with plan and credit details. |
| `POST` | `/api/payment/verify` | Private | Verifies the Razorpay signature, marks the payment as paid, and increments user credits. |

## Setup

Install dependencies:

```bash
npm install
```

Create `server/.env` manually using the environment variable table above.

Start the development server:

```bash
npm run dev
```

The server starts from `server.js`, loads environment variables with `dotenv`, connects to MongoDB, and mounts the API routers from `app.js`.

## Operational Notes

- Authentication is cookie-based. Cross-origin clients must send `withCredentials: true`.
- Razorpay verification uses the exact `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` returned by Razorpay Checkout.
- Resume uploads are parsed as PDFs and cleaned up after processing.
- AI calls are centralized through `services/openRouter.services.js` and currently use `openai/gpt-4o-mini` through OpenRouter.
- MongoDB model names are `User`, `Interview`, and `Payment`; keep route documentation and schema changes aligned.
