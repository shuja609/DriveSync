const Video = require('../models/Video');

// Create a new video
exports.createVideo = async (req, res) => {
    try {
      //  console.log("req.user----------------", req.user);
        const videoData = {
            ...req.body,
            createdBy: req.user.id
        };

        const video = new Video(videoData);
        await video.save();

        res.status(201).json(video);
    } catch (error) {
        console.error('Create Video Error:', error);
        res.status(500).json({ message: 'Failed to create video' });
    }
};

// Get all videos with filters and sorting
exports.getAllVideos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            type,
            category,
            sort = 'createdAt',
            order = 'desc',
            search
        } = req.query;

        const query = {};
        if (type) query.type = type;
        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search };
        }

        const sortOptions = {};
        sortOptions[sort] = order === 'desc' ? -1 : 1;

        const videos = await Video.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');

        const total = await Video.countDocuments(query);
         // Increment views
        // videos.forEach(video => {
        //     video.views += 1;
        //     video.save();   
        // });

        res.json({
            videos,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Get Videos Error:', error);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
};

// Get video analytics
exports.getVideoAnalytics = async (req, res) => {
    try {
        const totalVideos = await Video.countDocuments();
        
        const videosByType = await Video.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        
        const videosByCategory = await Video.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const totalViews = await Video.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        res.json({
            totalVideos,
            videosByType,
            videosByCategory,
            totalViews: totalViews[0]?.total || 0
        });
    } catch (error) {
        console.error('Video Analytics Error:', error);
        res.status(500).json({ message: 'Failed to fetch video analytics' });
    }
};

// Get single video
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.json(video);
    } catch (error) {
        console.error('Get Video Error:', error);
        res.status(500).json({ message: 'Failed to fetch video' });
    }
};

// Update video
exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        Object.assign(video, req.body);
         // Increment views
        video.views += 1;
        await video.save();

        res.json(video);
    } catch (error) {
        console.error('Update Video Error:', error);
        res.status(500).json({ message: 'Failed to update video' });
    }
};

// Delete video
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        await video.deleteOne();
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete Video Error:', error);
        res.status(500).json({ message: 'Failed to delete video' });
    }
};

// Toggle video publish status
exports.togglePublish = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.isPublished = !video.isPublished;
        await video.save();

        res.json(video);
    } catch (error) {
        console.error('Toggle Publish Error:', error);
        res.status(500).json({ message: 'Failed to toggle publish status' });
    }
};