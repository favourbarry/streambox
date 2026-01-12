import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import engagementController from '../controllers/engagement.controller.js';

const router = express.Router();

//likes
router.post("/:videoId/like", auth, engagementController.toogleLike);

//Comments 
router.post("/:videoId/comment", auth, engagementController.addComment);
router.get("/:videoId/comments", auth, engagementController.getComments);

//watch history
router.post("/:videoId/history", auth, engagementController.addWatchHistory);

export default router;