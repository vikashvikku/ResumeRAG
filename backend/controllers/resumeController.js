const Resume = require("../models/Resume");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// Upload and parse resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let parsedText = "";

    if (req.file.mimetype === "application/pdf") {
      const pdfFile = fs.readFileSync(path.join(uploadsDir, req.file.filename));
      const pdfData = await pdfParse(pdfFile);
      parsedText = pdfData.text;
    }

    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
    const phoneRegex = /(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g;

    const email = parsedText.match(emailRegex)?.[0] || req.body.email || "";
    const phone = parsedText.match(phoneRegex)?.[0] || req.body.phone || "";

    const commonSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "HTML",
      "CSS",
      "Python",
      "Java",
    ];
    const skills = commonSkills.filter((skill) =>
      parsedText.toLowerCase().includes(skill.toLowerCase())
    );

    const resume = new Resume({
      name: req.body.name || "Unknown",
      email,
      phone,
      skills,
      resumeFile: req.file.path,
      parsedText,
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error("Error getting resumes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    console.error("Error getting resume:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.searchResumes = async (req, res) => {
  try {
    const query = req.params.query;
    const resumes = await Resume.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.json(resumes);
  } catch (error) {
    console.error("Error searching resumes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.matchResumeToJob = async (req, res) => {
  try {
    const Job = require("../models/Job");
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const searchTerms = [job.title, ...job.skills, ...job.requirements].join(
      " "
    );

    const matchingResumes = await Resume.find(
      { $text: { $search: searchTerms } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    const results = matchingResumes.map((resume) => {
      const matchedSkills = resume.skills.filter((skill) =>
        job.skills.some(
          (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      const skillMatchPercentage =
        job.skills.length > 0
          ? (matchedSkills.length / job.skills.length) * 100
          : 0;
      return {
        resume,
        matchPercentage: Math.min(Math.round(skillMatchPercentage), 100),
      };
    });

    res.json(results);
  } catch (error) {
    console.error("Error matching resumes to job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
