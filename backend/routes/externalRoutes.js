const express = require("express");
const router = express.Router();
const { getExternalJobs, getExternalSchemes } = require("../controllers/externalController");

router.get("/jobs", getExternalJobs);
router.get("/schemes", getExternalSchemes);

module.exports = router;
