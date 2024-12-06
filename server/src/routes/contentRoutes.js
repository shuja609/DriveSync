const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const videoController = require('../controllers/videoController');

// Video routes
router.post('/videos', protect, adminOnly, videoController.createVideo);
router.get('/videos', videoController.getAllVideos);
router.get('/videos/analytics', protect, adminOnly, videoController.getVideoAnalytics);
router.get('/videos/:id', videoController.getVideoById);
router.put('/videos/:id', protect, adminOnly, videoController.updateVideo);
router.delete('/videos/:id', protect, adminOnly, videoController.deleteVideo);
router.patch('/videos/:id/publish', protect, adminOnly, videoController.togglePublish);

module.exports = router;