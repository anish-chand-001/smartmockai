import React from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5"; // Checked import
import { FcGoogle } from "react-icons/fc";     // Common standard addition for auth

const Auth = () => {
  // Example handler for industry-grade auth integration
  const handleGoogleLogin = () => {
    // Redirect to your backend OAuth route
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };

  return (
    <div className="w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg tracking-tight">SmartMock.AI</h2>
        </div>

        {/* Dynamic Catchphrase */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-8 flex flex-col items-center gap-3">
          <span>Continue with</span>
          <span className="bg-green-100 text-green-700 text-base md:text-lg px-4 py-1.5 rounded-full inline-flex items-center gap-2 font-medium">
            <IoSparkles size={16} className="text-green-600" />
            AI Smart Interview
          </span>
        </h1>

        {/* Action Buttons (What was missing) */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200 active:scale-[0.98]"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>
        </div>

        {/* Footer Disclaimers */}
        <p className="text-xs text-center text-gray-400 mt-6 px-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Auth;