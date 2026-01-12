import express from "express";
import auth from "../middlewares/auth.middleware.js";
import * as streamController from "../controllers/stream.controller.js";

const router = express.Router();
// Get stream key for OBS setup
router.get("/:id/key", auth, streamController.getStreamKey);

// Validate stream key (used by streaming server)
router.post("/validate", streamController.validateStreamKey);

export default router;