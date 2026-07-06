import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestions,
  submitAnswers,
} from "../controllers/interview.controller.js";
import { upload } from "../middlewares/multer.js";

const interviewRouter = express.Router();

interviewRouter.post(
  "/resume",
  upload.single("resume"),
  verifyToken,
  analyzeResume,
);

interviewRouter.post("/generate-questions", verifyToken, generateQuestions);

interviewRouter.post("/submit-answer", verifyToken, submitAnswers);

interviewRouter.post("/finish", verifyToken, finishInterview);

export default interviewRouter;
