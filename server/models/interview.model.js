import mongoose from "mongoose";

// ------------------------------------------------------
//                  Question Schema
// ------------------------------------------------------

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      trim: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    correctness: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// ------------------------------------------------------
//                  Interview Schema
// ------------------------------------------------------

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    experience: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    mode: {
      type: String,
      enum: ["Technical", "HR"],
      default: "Technical",
      required: true,
      trim: true, // Automatically trims whitespace
    },
    resumeText: {
      type: String,
      required: true,
      trim: true,
    },
    question: [questionSchema],
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Incompleted", "completed"], // Fixed the string typo into distinct array values
      default: "Incompleted",
      trim: true,
    },
  },
  { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;