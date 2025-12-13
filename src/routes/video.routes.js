const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../config/multer');
//protected routes

router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);
router.get('/', videoController.getSingleVideo);
router.get("/:id", videoController.getSingleVideo);
router.delete("/:id", auth, videoController.deleteVideo);
router.get('/:id/stream', videoController.streamVideo);
router.get("/:id", videoController.getSingleVideo);
module.exports = router;
