const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createScheme,
  importExternalSchemes,
  importSchemesJson,
  getSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
} = require("../controllers/schemeController");

router.get("/", getSchemes);
router.get("/:id", getSchemeById);
router.post("/", protect, createScheme);
router.post("/import", protect, admin, importExternalSchemes);
router.post("/import-json", protect, admin, importSchemesJson);
router.put("/:id", protect, updateScheme);
router.delete("/:id", protect, deleteScheme);

module.exports = router;
