import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { signInWithPopup } from "firebase/auth";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />

      <div className="flex-1 px-6 py-20">
        <div className="flex justify-center mb-6 ">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <HiSparkles size={16} className="bg-green-50 text-green-600 " />
            AI powered smart Interview Platform
          </div>
        </div>
        <div className="text-center mb-28">
          <motion.h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto">
            Practice Interview with
            <span className="relative inline-block">
              <span className="bg-green-100 text-green-600 px-5 py-1 rounded-full">
                AI intelligence
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
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate('/interview')
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="bg-black text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md "
            >
              Start Interview
            </motion.button>
             <motion.button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate('/history')
              }}
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              className="border border-gray-500 hover:bg-gray-100 px-10 py-3 rounded-full transition"
            >View History
              
            </motion.button>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Home;
