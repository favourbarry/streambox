const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const livestreamController = require("../controllers/livestream.controller");

router.post("/create", auth, livestreamController.createLivestream);
router.post("/:id/start", auth, livestreamController.startLivestream);
router.post("/:id/join", auth, livestreamController.joinlivestream);
router.post("/:id/end", auth, livestreamController.endlivestream);
router.get("/", livestreamController.getLivestreams);

module.exports = router; 
