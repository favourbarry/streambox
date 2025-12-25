const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const streamController = require("../controllers/stream.controller");

// Get stream key for OBS setup
router.get("/:id/key", auth, streamController.getStreamKey);

// Validate stream key (used by streaming server)
router.post("/validate", streamController.validateStreamKey);

module.exports = router;