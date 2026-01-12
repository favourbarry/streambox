import express from "express";
import auth from "../middlewares/auth.middleware.js";
import * as livestreamController from "../controllers/livestream.controller.js";

const router = express.Router();

router.post("/create", auth, livestreamController.createLivestream);
router.post("/:id/start", auth, livestreamController.startLivestream);
router.post("/:id/join", auth, livestreamController.joinlivestream);
router.post("/:id/end", auth, livestreamController.endlivestream);
router.get("/", livestreamController.getLivestreams);

export default router; 
