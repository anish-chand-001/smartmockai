import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { analyzeResume } from "../controllers/interview.controller.js";
import { upload } from "../middlewares/multer.js";

const interviewRouter = express();

interviewRouter.get(
  "/resume",
  verifyToken,
  upload.single("resume"),
  analyzeResume,
);



export default interviewRouter;
