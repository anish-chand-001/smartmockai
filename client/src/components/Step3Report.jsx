import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// IMPORT FIX: Added AreaChart and XAxis
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Step3Report = ({ report }) => {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  const navigate = useNavigate();

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const questionScoreData = questionWiseScore.map((scoreObj, index) => ({
    name: `Q${index + 1}`,
    score: scoreObj.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  // Assigning text based on the final score
  if (finalScore >= 8) {
    shortTagline = "Excellent Job!";
    performanceText =
      "You demonstrated strong knowledge and great communication skills. You are highly prepared for this role.";
  } else if (finalScore >= 5) {
    shortTagline = "Good Effort!";
    performanceText =
      "You have a solid foundation, but there are a few areas that need refinement. Keep practicing to boost your confidence and accuracy.";
  } else {
    shortTagline = "Needs Improvement";
    performanceText =
      "You struggled with several core concepts during this session. Take some time to review the fundamentals and try again when you feel ready.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="p-3 rounded-full bg-white shadow hover:shadow-md text-gray-600 transition-all duration-300 flex-shrink-0"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Interview Analytics Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              AI powered performance insights
            </p>
          </div>
        </div>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base whitespace-nowrap">
          Download PDF
        </button>
      </div>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* LEFT COLUMN: OVERALL PERFORMANCE */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center"
          >
            <h3 className="text-gray-500 mb-6 font-medium text-sm sm:text-base">
              Overall Performance
            </h3>

            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "22px",
                  pathColor: "#10b981", // emerald-500
                  textColor: "#374151", // gray-700
                  trailColor: "#e5e7eb", // gray-200
                })}
              />
            </div>

            <div className="mt-8">
              <p className="font-semibold text-emerald-600 text-lg sm:text-xl mb-2">
                {shortTagline}
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {performanceText}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
          >
            {/* TYPO FIX: Changed <h> to <h3> and fixed tex-gray-700 */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
              Skill Evaluation
            </h3>
            {/* TYPO FIX: Changed spac-y-5 to space-y-5 */}
            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span>{s.label}</span>
                    <span className="font-semibold text-green-600">
                      {s.value}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: ADDITIONAL METRICS */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
              Performance Trend
            </h3>
            <div className="h-64 sm:h-72">
              {/* SYNTAX FIX: Width and height must be strings when using percentages */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* SYNTAX FIX: dataKey must be a string and camelCase */}
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6 ">
              Quesiton Breakdown
            </h3>
            <div className="space-y-6">
              {questionScoreData.map((q, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200"
                >

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 ">
                    <div >
                      <p className="text-xs text-gray-400"> Quesiton {i+1}</p>
                      <p className="font font-semibold text-gray-800 sm:text-base leading-relaxed">
                        {q.question || "Question not available "}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit ">
                      {q.score ?? 0 } /10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
