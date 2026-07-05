import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "smartmockai.firebaseapp.com",
  projectId: "smartmockai",
  storageBucket: "smartmockai.firebasestorage.app",
  messagingSenderId: "267491705089",
  appId: "1:267491705089:web:f1a7ac079c8d6b79d99b00",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export { auth, provider };