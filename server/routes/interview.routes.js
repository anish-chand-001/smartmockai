  import express from "express";
  import { verifyToken } from "../middlewares/verifyToken.js";
  import { analyzeResume } from "../controllers/interview.controller.js";
  import { upload } from "../middlewares/multer.js";

  const interviewRouter = express.Router();

  interviewRouter.post(
    "/resume",
    upload.single("resume"),
    verifyToken, 
    analyzeResume,
  );

export default interviewRouter;
