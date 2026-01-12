import express from "express";
import auth from "../middlewares/auth.middleware.js";
import * as videoController from "../controllers/video.controller.js";
import upload from "../config/multer.js";

const router = express.Router();
//protected routes

router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);
router.get('/', videoController.getSingleVideo);
router.get("/:id", videoController.getSingleVideo);
router.delete("/:id", auth, videoController.deleteVideo);
router.get('/:id/stream', videoController.streamVideo);
router.get("/:id", videoController.getSingleVideo);
export default router;
