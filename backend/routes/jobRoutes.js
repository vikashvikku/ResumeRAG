const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  advancedSearchJobs,
} = require("../controllers/jobController");

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/search/advanced", advancedSearchJobs);
router.get("/search/:query", searchJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
