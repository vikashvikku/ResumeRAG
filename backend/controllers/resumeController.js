const express = require("express");
const multer = require("multer");
const path = require("path");
const resumeController = require("../controllers/resumeController");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("resume"), resumeController.uploadResume);
router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.get("/search/:query", resumeController.searchResumes);
router.get("/match/:jobId", resumeController.matchResumeToJob);

module.exports = router;
