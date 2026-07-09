import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- State Management ---
import { useSelector } from "react-redux";

// --- Animation Libraries ---
import { motion } from "motion/react";

// --- React Icons Ecosystem ---
import {
  BsRobot,
  BsMic,
  BsClock,
  BsClockHistory,
  BsShieldCheck,
  BsCreditCard,
  BsBarChart,
  BsFileEarmarkText,
  BsPeople,
  BsCpu,
  BsFileEarmarkPdf,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

// --- Core Application Layout Components ---
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModel from "../components/AuthModel";

// --- Static Asset Pipeline (Feature & Capability Media) ---
import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/HR.png";
import techlImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

/**
 * Home Component
 * Serves as the primary marketing and feature discovery landing page for SmartMock.AI.
 * Orchestrates dynamic navigation guards dependent on user session states, highlights 
 * application platform milestones, and renders decoupled responsive grids for core platform capabilities.
 */
const Home = () => {
  // Extract global authenticated user payload from Redux slice
  const { userData } = useSelector((state) => state.user);
  
  // Local state flag to toggle access control authentication modal
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  /**
   * Universal programmatic route guard.
   * If an active authenticated session is not found, blocks navigation and forces 
   * fallback auth modal context; otherwise seamlessly routes to designated destination parameter.
   * @param {string} routeTarget - Target URL matching a registered routing path string.
   */
  const handleProtectedNavigation = (routeTarget) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate(routeTarget);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      {/* Primary Global Navigation Bar */}
      <Navbar />

      {/* Main Feature Layout Canvas */}
      <div className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Visual Platform Accent Subheading */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
              <HiSparkles size={16} className="bg-green-50 text-green-600" />
              AI powered smart Interview Platform
            </div>
          </div>

          {/* Hero Content Section */}
          <div className="text-center mb-28">
            <motion.h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto">
              Practice Interview with{" "}
              <span className="relative inline-block">
                <span className="bg-green-100 text-green-600 px-5 py-1 rounded-full">
                  AI Intelligence
                </span>
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role based mock interview with smart follows ups, adaptive
              difficulty and real time performance evaluation
            </motion.p>

            {/* Core Action CTAs with Embedded Route Guards */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => handleProtectedNavigation("/interview")}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md"
              >
                Start Interview
              </motion.button>
              
              <motion.button
                onClick={() => handleProtectedNavigation("/history")}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="border border-gray-500 hover:bg-gray-100 px-10 py-3 rounded-full transition"
              >
                View History
              </motion.button>
            </div>
          </div>

          {/* Step-by-Step Interactive Workflow Pipeline */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role and experience selection",
                desc: "AI adjuts difficulty based on selected job role",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow up questions based on selected job role",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real Interview pressure with time tracking",
              },
            ].map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                key={index}
                // Applies calculated rotation offsets and visual variance across steps
                className={`relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500
                p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300
                ${index === 0 ? "rotate-[-4deg]" : ""}
                ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
                ${index === 2 ? "rotate-[-3deg]" : ""}
                `}
              >
                {/* Absolutely Positioned Step Icon badge */}
                <div className="absolute bg-white -top-8 left-1/2 -translate-x-1/2 border border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>
                <div className="pt-10 text-center">
                  <div className="text-xs text-green-600 font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Section: Platform Capabilities Grid */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Advanced AI <span className="text-green-600">capabilities</span>
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  description: "Score communication, technical accuracy, and confidence metrics.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  description: "Project specific question based on the uploaded resume",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkPdf size={20} />,
                  title: "PDF Report Generation",
                  description: "Export detailed performance breakdowns and shareable feedback records.",
                },
                {
                  image: analyticsImg,
                  icon: <BsClockHistory size={20} />,
                  title: "Analytics & History",
                  description: "Track progress with performance graphs and topic analysis",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  key={index}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Media Node */}
                    <div className="w-full md:w-1/2 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                    {/* Copy/Descriptive Node */}
                    <div className="w-full md:w-1/2">
                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold mb-3 text-xl">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section: Interview Evaluation Modalities */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Multiple Interview <span className="text-green-600">Modes</span>
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: hrImg,
                  icon: <BsPeople size={20} />,
                  title: "HR Round Simulation",
                  description: "Experience behavioral questions designed to test cultural fit and soft skills.",
                },
                {
                  image: techlImg,
                  icon: <BsCpu size={20} />,
                  title: "Technical Assessment",
                  description: "Deep dive into domain-specific queries, coding logic, and system design.",
                },
                {
                  image: confidenceImg,
                  icon: <BsShieldCheck size={20} />,
                  title: "Confidence & Delivery Tracking",
                  description: "Analyze tone, pacing, and speech clarity for an impactful presentation.",
                },
                {
                  image: creditImg,
                  icon: <BsCreditCard size={20} />,
                  title: "Token & Credit Management",
                  description: "Keep track of mock interview credits and seamless subscription usage.",
                },
              ].map((mode, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  key={index}
                  className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between gap-6">
                    {/* Content Section */}
                    <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3">{mode.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {mode.description}
                      </p>
                    </div>
                    {/* Floating Graphical/Illustration Component */}
                    <div className="w-1/2 flex justify-end">
                      <img
                        src={mode.image}
                        alt={mode.title}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Conditionally rendered Portal Authentication overlay intercept */}
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

      {/* Primary Global Page Footer */}
      <Footer />
    </div>
  );
};

export default Home;