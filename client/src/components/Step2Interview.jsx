import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { scale } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  //--------------------------------------------
  //  speech recognition
  //--------------------------------------------
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);

  //--------------------------------------------
  //  Interview States
  //--------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  //--------------------------------------------
  //  Voice states
  //--------------------------------------------
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subTitle, setSubTitle] = useState("");
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      voices.forEach((voice) => {
        console.log(voice.name);
      });
      if (!voices.length) return;

      // Try Known female voices first
      const femaleVoice = voices.find((v) => {
        return (
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("heera") ||
          v.name.toLowerCase().includes("female")
        );
      });

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      //   Try Known male voices
      const maleVoice = voices.find((v) => {
        return (
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("ravi") ||
          v.name.toLowerCase().includes("male")
        );
      });

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      //  Fallback : first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    console.log("Selected:", selectedVoice?.name);
    console.log("Gender:", voiceGender);
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // -------------Speak Function

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      //----------------add natural pauses after commas and periods

      const humanText = text.replace(/,/g, ",...").replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      //----------------  human like pacing
      utterance.rate = 0.92; // slightly slower than normal
      utterance.pitch = 1.05; // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        setTimeout(() => {
          setSubTitle("");
          resolve();
        }, 300);
      };

      setSubTitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName} its great to meet you today . I hope you are feeling confident and ready `,
        );

        await speakText(
          "I'll ask a few questions. Just answer naturally, and take your time. Let's begin  ",
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        //  if last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging ");
        }
        await speakText(currentQuestion.question);
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  return (
    <div
      className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 
    flex  items-center justify-center p-4 sm:p-6"
    >
      <div
        className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl
      border border-gray-200 flex flex-col lg:flex-row overflow-hidden"
      >
        {/* video section  */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/*  subtitle pending */}
          {subTitle && (
            <div className="w-full max-w-md bg-gray-50 border-gray-200  rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subTitle}
              </p>
            </div>
          )}

          {/*  timer area */}
          <div className="w-full max-w-md  bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center ">
              <span className="text-sm  text-gray-500 ">Interview Status</span>
              <span className="text-sm font-semibold text-emerald-600 ">
                {isAIPlaying ? "AI Speaking" : ""}
              </span>
            </div>
            <div className="h-px bg-gray-200  "></div>
            <div className="flex justify-center">
              <Timer TimerLeft="30" TotalTime="60" />
            </div>
            <div className="h-px bg-gray-200 "></div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="">
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">Current questions</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </span>
                <span className="text-xs text-gray-400">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text section  */}

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border  border-gray-200 shadow-sm ">
            <p className="text-xs sm:text-sm text-gray-400 mb-2 ">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQuestion?.question}
            </div>
          </div>
          <textarea
            placeholder="Type your answer here..."
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none
            outline-none border border-gray-200 focus:ring-2  focus:ring-emerald-500 transition text-gray-800"
          />

          <div className="flex items-center gap-4 mt-6 ">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 sm:w-14 flex items-center justify-center rounded-full
               bg-black text-white shadow-lg "
            >
              <FaMicrophone size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-500 text-white 
              py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold "
            >
              Submit Answer
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
