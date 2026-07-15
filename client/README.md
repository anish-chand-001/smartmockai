# SmartMock.AI Client

The SmartMock.AI client is the React/Vite frontend for AI-powered interview preparation. It provides the candidate-facing experience for Google authentication, resume-driven interview setup, timed AI mock interviews, performance analytics, pricing, Razorpay checkout, interview history, and downloadable PDF reports.

## UI/UX Stack

| Technology | Purpose |
| --- | --- |
| React 19 | Component-driven user interface and page composition |
| Vite 8 | Fast local development server and production build pipeline |
| Tailwind CSS 4 | Utility-first styling and responsive layout system |
| Motion / Framer Motion | Page transitions, micro-interactions, and animated UI feedback |
| Redux Toolkit | Global user state and authenticated session context |
| React Router | Client-side routing for interview, history, pricing, auth, and report pages |
| Recharts | Visual analytics for performance and score breakdowns |
| react-circular-progressbar | Score rings, timers, and progress indicators |
| jsPDF + jspdf-autotable | Downloadable interview reports in PDF format |
| Firebase Auth | Google sign-in flow before backend session synchronization |
| Razorpay Checkout | Client-side payment collection for Starter and Pro credit plans |

## Features

### Interview Interface

The interview flow guides candidates from setup to completion:

- Upload a resume PDF for AI-assisted profile extraction.
- Review inferred role, experience, projects, and skills.
- Select Technical or HR interview mode.
- Generate five role-aware questions with increasing difficulty.
- Answer each question inside a timed interview interface.
- Receive AI-generated scoring and feedback for each response.

### Analytics Dashboard

The reporting experience turns completed interviews into preparation insights:

- Final score overview for the interview attempt.
- Per-question confidence, communication, and correctness scoring.
- Feedback summaries for targeted improvement.
- Visual score presentation with charts and circular progress indicators.
- Interview history for reviewing previous attempts.

### Pricing and Payment Flow

The pricing page connects frontend plan selection to the backend Razorpay flow:

- Free, Starter, and Pro plan presentation.
- Razorpay order creation through `/api/payment/order`.
- Razorpay Checkout initialization with `VITE_RAZORPAY_KEY_ID`.
- Payment verification through `/api/payment/verify`.
- Credit balance refresh after successful payment verification.

### PDF Report Downloads

Completed reports can be exported as structured PDF files using `jsPDF` and `jspdf-autotable`. The report export is designed for offline review, interview coaching, and tracking progress across practice sessions.

## Environment Variables

Create `client/.env` with the following keys.

| Key | Required | Example | Description |
| --- | --- | --- | --- |
| `VITE_RAZORPAY_KEY_ID` | Yes | `rzp_test_xxxxxxxxxxxxxx` | Razorpay Checkout key used by `Pricing.jsx` to open the payment widget. |
| `VITE_API_URL` | Yes | `https://smartmockai.onrender.com` | Backend API base URL for deployed environments. The current app exports the backend URL from `src/App.jsx`; keep this value aligned with that server origin. |
| `VITE_FIREBASE_APIKEY` | Yes | `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Firebase API key used by `src/utils/Firebase.jsx` for Google authentication. |

## Run and Build Commands

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the configured linter:

```bash
npm run lint
```

## Application Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `Home.jsx` | Landing and authenticated dashboard entry point |
| `/auth` | `Auth.jsx` | Google sign-in flow |
| `/interview` | `InterviewPage.jsx` | Multi-step mock interview workflow |
| `/history` | `InterviewHistory.jsx` | Previous interview attempts |
| `/pricing` | `Pricing.jsx` | Credit plans and Razorpay payment flow |
| `/report/:id` | `InterviewReport.jsx` | Detailed report view for a completed interview |

## Build Output

Vite emits static assets into `client/dist/`. The output is suitable for static hosting platforms such as Vercel, Netlify, Render static sites, or any CDN-backed static file host.

## Deployment Checks

Before pushing to Linux-based platforms such as Render, Vercel, Netlify, or CI runners, verify import paths exactly match filesystem casing. Windows and some macOS setups may allow imports that fail in production.

Required checks:

1. Confirm every relative import uses the exact file and folder casing from `client/src`.
2. Keep `src/utils/Firebase.jsx` imported as `../utils/Firebase`, not `../utils/firebase`.
3. Confirm asset imports match case-sensitive filenames such as `HR.png`, `Videos/male-ai.mp4`, and `Videos/female-ai.mp4`.
4. Run a production build before deployment:

```bash
npm run build
```

5. If a deployment fails with `Could not resolve`, inspect the reported import string first; most Vite production resolver failures are caused by casing or incorrect `../` traversal.

## Production Notes

- The client sends authenticated API requests with cookies, so the backend must allow the deployed frontend origin and credentials.
- Razorpay Checkout requires the public key in `VITE_RAZORPAY_KEY_ID` and the Razorpay browser script to load successfully.
- Firebase authentication requires the deployed domain to be authorized in the Firebase console.
- Keep API base URLs, CORS origin, cookie settings, and deployment domains aligned across client and server.
