const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const engagementController = require('../controllers/engagement.controller');
//likes

router.post("/:videoId/like", auth, engagementController.toogleLike);

//Comments 
router.post("/:videoId/comment", auth, engagementController.addComment);
router.get("/:videoId/comments", auth, engagementController.getComments);

//watch history
router.post("/:videoId/history", auth, engagementController.addWatchHistory);
module.exports = router;