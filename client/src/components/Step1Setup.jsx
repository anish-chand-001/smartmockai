import React from "react";
import { motion, scale } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { useState } from "react";

const Step1Setup = ({ onstart }) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 "
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden ">
        {/*  left side */}
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

        {/* right side */}
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

                  {resumeFile && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800
                      transition"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}

            </div>
              <div className="relative">

              <motion.button
                disabled={!role || !experience}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                className=" w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 
                rounded-full text-lg font-semibold transition duration-300 shadow-md"
                >
                Start Interview
              </motion.button>
                </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1Setup;
