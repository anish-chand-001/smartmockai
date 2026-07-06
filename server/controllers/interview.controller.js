import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAI } from "./../services/openRouter.services.js";
import User from "../models/user.model.js";
import interview from "../models/interview.model.js";

/**
 * @desc    Analyze uploaded resume PDF and extract structured details
 * @route   POST /api/interview/resume  <-- Make sure this matches your Express router exactly!
 * @access  Private
 */
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    // Node environment patch for PDF.js legacy build if needed
    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;

    let resumeText = "";

    // Extract text from all pages cleanly
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `You are a data extraction assistant. Extract structured data from the provided resume.
        You MUST respond ONLY with a raw JSON object matching this schema. Do not include markdown code block formatting (no \`\`\`json).
        
        Schema:
        {
          "role": "string",
          "experience": "string",
          "projects": ["project1", "project2"],
          "skills": ["skill1", "skill2"]
        }`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAI(messages);

    // SAFE JSON PARSING: Strips out markdown ticks if the AI returns them anyway
    let cleanedResponse = aiResponse.trim();
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("AI did not return valid JSON. Raw output:", aiResponse);
      throw new Error("Failed to parse AI structure response.");
    }

    // File cleanup after processing completes successfully
    await fs.promises.unlink(filepath);

    return res.status(200).json({
      success: true,
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      resumeText,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);

    // Clean up file if an error occurs mid-process so server storage doesn't bloat
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch (unlinkError) {
        console.error(
          "Failed to delete file during error cleanup:",
          unlinkError,
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error during analysis.",
    });
  }
};

/**
 * @desc    Generate tailored interview questions based on profile details
 * @route   POST /api/interview/generate-questions
 * @access  Private
 */
export const generateQuestions = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, projects, skills } = req.body;

    if (!role || !experience || !mode) {
      return res.status(400).json({
        success: false,
        message: "Role, experience, and mode are required",
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Missing user session token.",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found in database.",
      });
    }

    if (user.credits < 50) {
      console.log("not credits");
      return res.status(403).json({
        success: false,
        message:
          "Not enough credits. Minimum 50 credits required to generate questions.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
    Role: ${role}
    Experience: ${experience}
    InterviewMode: ${mode}
    Projects: ${projectText}
    Skills: ${skillsText}
    Resume: ${safeResume}
    `;

    const messages = [
      {
        role: "system",
        content: `You are a real human interviewer conducting a professional interview.
Speak in simple, natural English as if you are directly talking to the candidate.
Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience, interviewMode, projects, skills, and resume details.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAI(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({
        success: false,
        message: "AI response is empty. Please try again.",
      });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.replace(/^\d+[\\.\\)]\s*/, "").trim()) // Extra fallback safety to clean up numbering if AI breaks rules
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length < 5) {
      return res.status(500).json({
        success: false,
        message: "AI did not return enough questions. Please try again.",
      });
    }

    // Deduct credits
    user.credits -= 50;
    await user.save();


    // Notice: altered inner array label from 'questions' to 'question' to maintain database standard structure integrity
    const newInterview = await interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      projects,
      skills,
      resumeText: safeResume,
      questions: questionsArray.map((question, index) => ({
        question,
        difficulty: ["Easy", "Easy", "Medium", "Medium", "Hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    

    return res.status(200).json({
      success: true,
      interviewId: newInterview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: newInterview.questions,
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
/**
 * @desc    Submit a candidate response for evaluation and feedback
 * @route   POST /api/interview/submit-answer
 * @access  Private
 */
export const submitAnswers = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;
    const currentInterview = await interview.findById(interviewId);

    if (!currentInterview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    const question = currentInterview.questions[questionIndex];

    if (!answer) {
      question.score = 0;
      question.feedback = "No answer provided.";
      question.answer = "";

      await currentInterview.save();
      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    // Check if time limit exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await currentInterview.save();
      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.questions}
Answer: ${answer}
`,
      },
    ];

    const aiResponse = await askAI(messages);
    const parsedResponse = JSON.parse(aiResponse);

    question.answer = answer;
    question.confidence = parsedResponse.confidence;
    question.communication = parsedResponse.communication;
    question.correctness = parsedResponse.correctness;
    question.score = parsedResponse.finalScore;
    question.feedback = parsedResponse.feedback;

    await currentInterview.save();

    return res.status(200).json({
      success: true,
      feedback: parsedResponse.feedback,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

/**
 * @desc    Finalize the interview session and lock results
 * @route   POST /api/interview/finish
 * @access  Private
 */
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const currentInterview = await interview.findById(interviewId);

    if (!currentInterview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    const totalQuestions = currentInterview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore =
      totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
    const avgConfidence =
      totalQuestions > 0 ? Math.round(totalConfidence / totalQuestions) : 0;
    const avgCommunication =
      totalQuestions > 0 ? Math.round(totalCommunication / totalQuestions) : 0;
    const avgCorrectness =
      totalQuestions > 0 ? Math.round(totalCorrectness / totalQuestions) : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await currentInterview.save();

    return res.status(200).json({
      success: true,
      finalScore,
      Confidence,
      Communication,
      Correctness,
      questionWiseScores: currentInterview.questions.map((q) => ({
        question: q.questions,
        score: q.score || 0,
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        feedback: q.feedback || "No feedback provided.",
      })),
    });
  } catch (error) {
    console.error("Error finishing interview:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
