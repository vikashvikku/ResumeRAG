const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb("Error: Only PDF, DOC, or DOCX files are allowed!");
  },
});

const {
  uploadResume,
  getAllResumes,
  getResumeById,
  searchResumes,
  matchResumeToJob,
} = require("../controllers/resumeController");

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.get("/search/:query", searchResumes);
router.get("/match/:jobId", matchResumeToJob);

module.exports = router;
