import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { ServerUrl } from "./../App";
import { BsArrowLeft } from "react-icons/bs";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, userName } = interviewData;

  // --- STAGE & PHASE STATES ---
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  // --- SPEECH TO TEXT ---
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);

  // --- INTERVIEW CORE LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  // --- TEXT TO SPEECH ---
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subTitle, setSubTitle] = useState("");
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  // Keep mic state in a ref to avoid stale closures in SpeechSynthesis events
  const isMicOnRef = useRef(isMicOn);
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  // --- EFFECT: DETECT LOCAL SYSTEM VOICES ---
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("heera") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("ravi") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // --- HELPER: SPEECH UTTERANCE ENGINE ---
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ",...").replace(/\./g, ". ...");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMicEngine();
        videoRef.current
          ?.play()
          .catch((err) => console.log("Video play interrupted:", err));
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOnRef.current) {
          startMicEngine();
        }

        setTimeout(() => {
          setSubTitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOnRef.current) startMicEngine();
        setSubTitle("");
        resolve();
      };

      setSubTitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  // --- EFFECT: RUN TIME PIPELINE ---
  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you are feeling confident and ready.`,
        );
        await speakText(
          "I'll ask a few questions. Just answer naturally, and take your time. Let's begin.",
        );
        setIsIntroPhase(false);
      } else if (currentQuestion && !feedback) {
        await new Promise((r) => setTimeout(r, 800));
        if (currentIndex === questions.length - 1 && questions.length > 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  // --- EFFECT: TIMER (FIXED INSTANCE CLEARDOWN) ---
  useEffect(() => {
    // Do not run timer during onboarding, validation subroutines, or feedback views
    if (isIntroPhase || !currentQuestion || isSubmitting || !!feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting, !!feedback, currentQuestion]);

  // --- EFFECT: SPEECH TO TEXT SETUP ---
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMicEngine = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log("startMicEngine error: " + error);
      }
    }
  };

  const stopMicEngine = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("stopMicEngine error: " + error);
      }
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMicEngine();
    } else {
      startMicEngine();
    }
    setIsMicOn(!isMicOn);
  };

  // --- SUBMIT ANSWER (FIXED BUTTON FREEZE) ---
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMicEngine();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${ServerUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      // Reset submitting status immediately so the UI is free to act
      setIsSubmitting(false);

      // Handle the speech narration seamlessly without trapping button state
      await speakText(result.data.feedback);
    } catch (error) {
      console.log("Submit answer error: " + error);
      setIsSubmitting(false);
    }
  };

  // --- HANDLE NEXT QUESTION 
  const handleNextQuestion = async () => {
    try {
      const nextIndex = currentIndex + 1; // Moved to the top of the scope

      if (nextIndex >= questions.length) {
        finishInterview();
        return;
      }

      // Synchronize input buffers and clean up variables safely BEFORE moving on
      await speakText("Alright, let's move to the next question.");
      setAnswer("");
      setFeedback("");
      setTimeLeft(questions[nextIndex]?.timeLimit || 60);
      setCurrentIndex(nextIndex);

      setTimeout(() => {
        if (isMicOnRef.current) startMicEngine();
      }, 500);
    } catch (error) {
      console.log("handleNextQuestion error: " + error);
    }
  };


  const finishInterview = async () => {
    try {
      stopMicEngine();
      setIsMicOn(false);
      const result = await axios.post(
        `${ServerUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true },
      );
      const reportData = result.data.report || result.data;

      if (onFinish) {
        onFinish(reportData);
      }
    } catch (error) {
      console.log("finishInterview error: ", error);
    }
  };

  // Trigger auto-submit when timeout hits 0
  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  // Clean up component on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-7xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT RAIL */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-video flex items-center justify-center">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>

          {subTitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subTitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              <span className="text-sm font-semibold text-emerald-600">
                {isAIPlaying ? "AI Speaking" : "Ready"}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-center">
              <Timer
                TimerLeft={timeLeft}
                TotalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs block text-gray-400">
                  Current Question
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </span>
                <span className="text-xs block text-gray-400">
                  Total Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <textarea
            placeholder="Type or speak your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            disabled={isAIPlaying || isSubmitting}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 min-h-[200px]"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                type="button"
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 sm:w-14 flex items-center justify-center rounded-full shadow-lg transition-colors ${
                  isMicOn
                    ? "bg-emerald-600 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying || !answer.trim()}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-br from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:from-gray-400 disabled:to-gray-500"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4 ">{feedback}</p>
              <button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-br from-emerald-600 to-teal-500 text-white py-3 rounded-xl 
                shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                Next question <BsArrowLeft className="rotate-180" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Interview;
