import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAI } from "./../services/openRouter.services.js";
import User from "../models/user.model.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer); // Fixed capitalization from uint8Array to Uint8Array

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let resumeText = "";

    // Extract text from all pages
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
        content: `
          Extract structured data from resume.
          Return strictly valid JSON:
          {
            "role": "string",
            "experience": "string",
            "projects": ["project1", "project2"],
            "skills": ["skill1", "skill2"]
          }
        `, // Fixed syntax assignment error (= to :) and fixed missing closing quote on "skills"
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAI(messages);
    const parsed = JSON.parse(aiResponse);

    // Non-blocking asynchronous file deletion
    await fs.promises.unlink(filepath);

    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);

    // Clean up file if an error occurs mid-process
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

    return res.status(500).json({ message: error.message });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, projects, skills } = req.body;

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, experience, and mode are required",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 50) {
      return res.status(403).json({
        message:
          "Not enough credits. minimum 50 credits required to generate questions.",
      });
    }

    const projectTexT =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
       Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

      
  } catch (error) {
    console.error("Error generating questions:", error);
    return res.status(500).json({ message: error.message });
  }
};
