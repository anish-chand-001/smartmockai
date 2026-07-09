import React from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "./../App";
import { linkWithCredential } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Step1Setup = ({ onstart }) => {
  // --- REDUX STATE & DISPATCH ---
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // --- FORM STATE ---
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");

  // --- RESUME UPLOAD & ANALYSIS STATE ---
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false); // Controls the "Start Interview" loading state
  const [projects, setProjects] = useState([]);   // Stores extracted projects from resume
  const [skills, setSkills] = useState([]);       // Stores extracted skills from resume
  const [resumeText, setResumeText] = useState(""); // Stores raw text from parsed resume
  const [analysisDone, setAnalysisDone] = useState(false); // Toggles view from upload dropzone to result box
  const [analyzing, setAnalyzing] = useState(false); // Controls the "Analyze Resume" loading state

  // --- HANDLER: UPLOAD AND PARSE RESUME ---
  const handleUploadResume = async () => {
    // Prevent execution if no file is chosen or if an upload is already in progress
    if (!resumeFile || analyzing) {
      return;
    }
    setAnalyzing(true);
    
    // Append the file data into standard FormData for backend parsing
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume",
        formData,
        {
          withCredentials: true, // Required if your backend handles sessions via cookies
        },
      );
      console.log("File being sent:", resumeFile);
      console.log(result.data);

      // Auto-fill state fields using AI extracted data from the server response
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false); 
    }
  };

  // --- HANDLER: INITIALIZE INTERVIEW & FETCH QUESTIONS ---
  const handleStartInterview = async (req, res) => {
    setLoading(true);
    try {
      // Send setup preferences to backend to generate tailored interview questions
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          resumeText,
          projects,
          skills,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result.data);

      // If user profile exists, update credit count balance in Redux store
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      
      // Callback to parent component supplying the generated interview bundle data
      onstart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    // Outer Container (Page Wrapper with Framer-Motion Fade-In Animation)
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 "
    >
      {/* Main Split-Screen Panel (Grid Layout) */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden ">
        
        {/* === LEFT SIDE: INFORMATION & BRANDING PANEL === */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold  text-gray-800 mb-6">
            Start Your Ai Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenario powered by AI. Improve
            communication, technical skills and confidence
          </p>

          {/* Feature List Items with Staggered Slide-In Animations */}
          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                Text: "Choose Role and Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                Text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                Text: "Performance Analytics",
              },
            ].map((items, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className=" flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {items.icon}
                <span className="text-gray-700 font-medium">{items.Text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* === RIGHT SIDE: INTERVIEW CONFIGURATION FORM === */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 ">
            Interview SetUp
          </h2>
          <div className="space-y-6">
            
            {/* Input: Target Role */}
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Role"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
            
            {/* Input: Target Experience level */}
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>
            
            {/* Dropdown: Interview Type (Technical vs HR) */}
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition "
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>
            </div>
            
            {/* Upload Zone: Hidden native file input triggered by a styled wrapper div */}
            <div className="relative">
              {!analysisDone && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 
                hover:bg-green-50 transition"
                >
                  <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3 " />
                  <input
                    type="file"
                    id="resumeUpload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p className="text-gray-600 font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload resume (optional)"}
                  </p>

                  {/* Analyze Trigger Button: Only renders once a valid file is queued */}
                  {resumeFile && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents clicking the button from re-triggering file picker dialog
                        handleUploadResume();
                      }}
                      className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800
                      transition"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Results Panel: Conditionally maps parsed payload data dynamically after successful analysis */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 bordre border-gray-200 rounded-xl p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Resume Analysis Result
                </h3>
                
                {/* List Extracted Projects */}
                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1 ">Projects:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {projects.map((project, index) => (
                        <li key={index}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Badge Pills for Extracted Skills */}
                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1 ">skills:</p>
                    <ul className="flex flex-wrap gap-2 ">
                      {skills.map((skills, index) => (
                        <li
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skills}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* CTA Button: Submits payload to initiate global session flow */}
            <div className="relative">
              <motion.button
                onClick={handleStartInterview}
                disabled={!role || !experience || loading} // Simple form validation guardrail
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                className=" w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 
                rounded-full text-lg font-semibold transition duration-300 shadow-md"
              >
                {loading ? "Starting..." : "Start Interview"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1Setup;