import React from "react";

// --- Third-Party Icons & UI Utilities ---
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";

// --- Firebase Authentication SDK ---
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

// --- API Client & Configuration ---
import axios from "axios";
import { ServerUrl } from "../App";

// --- State Management & Routing (Redux & React Router) ---
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

/**
 * Auth Component
 * * Handles federated identity authentication via Google OAuth (Firebase) 
 * and synchronizes the session with the internal backend database.
 * * @param {boolean} props.isModel - Flag to toggle styling between a standalone full-screen page or a nested modal viewport.
 */
const Auth = ({ isModel = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Orchestrates the Google OAuth flow.
   * 1. Launches client-side Firebase Popup authentication.
   * 2. Extracts client identity information (Name, Email).
   * 3. Dispatches payload to the backend server to register/authenticate and establish HttpOnly session cookies.
   * 4. Updates global state (Redux) and redirects the user upon a successful handshake.
   */
  const handleGoogleAuth = async () => {
    try {
      // Step 1: Initiate OAuth popup with Google providers
      const response = await signInWithPopup(auth, provider);
      const { displayName: name, email } = response.user;

      // Step 2: Forward token data to backend to establish server-side session management
      const result = await axios.post(
        `${ServerUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true } // Crucial for storing Secure/HttpOnly session cookies
      );

      // Step 3: Global state hydration and routing post-authorization
      if (result.data?.success) {
        dispatch(setUserData(result.data.user));
        navigate("/");
      }
    } catch (error) {
      // Graceful degradation for user-initiated cancellation
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Authentication aborted: User closed the OAuth popup interface.");
        // Note: Implement localized toast notifications here if UX mandates visible feedback
        return;
      }

      // Operational error fallback: Log anomaly and reset vulnerable state parameters
      console.error("Critical Authentication failure occurred:", error);
      dispatch(setUserData(null));
    }
  };

  return (
    // Dynamic Layout Container: Switches seamlessly between full-bleed viewport and constrained modal layouts
    <div
      className={`w-full ${
        isModel 
          ? "py-4" 
          : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"
      }`}
    >
      {/* Animated Card Container via Framer Motion for premium perceived performance/UX */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full bg-white shadow-2xl border border-gray-200 ${
          isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"
        }`}
      >
        {/* Brand Architecture Identity */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg tracking-tight">SmartMock.AI</h2>
        </div>

        {/* Dynamic Contextual Marketing Header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-8 flex flex-col items-center gap-3">
          <span>Continue with</span>
          <span className="bg-green-100 text-green-700 text-base md:text-lg px-4 py-1.5 rounded-full inline-flex items-center gap-2 font-medium">
            <IoSparkles size={16} className="text-green-600" />
            AI Smart Interview
          </span>
        </h1>

        {/* Actionable Call-To-Actions (CTAs) */}
        <div className="space-y-4">
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ opacity: 0.9, scale: 1.03 }}
            whileTap={{ opacity: 1, scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white shadow-md font-medium py-3 px-4 rounded-xl transition duration-200 active:scale-[0.98]"
          >
            <FcGoogle size={22} />
            Continue with Google
          </motion.button>
        </div>

        {/* Compliance and Legal Disclaimers */}
        <p className="text-xs text-center text-gray-400 mt-6 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;