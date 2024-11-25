const { protect, adminOnly, optional } = require('../middleware/authMiddleware');

// Protected route
router.get('/profile', protect, userController.getProfile);

// Admin only route
router.get('/admin-dashboard', protect, adminOnly, adminController.getDashboard);

// Optional authentication route
router.get('/posts', optional, postController.getAllPosts);