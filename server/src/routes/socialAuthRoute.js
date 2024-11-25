const express = require('express');
const router = express.Router();
const passport = require('passport');
const socialAuthController = require('../controllers/socialAuthController');

// Google Auth Routes
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    socialAuthController.googleCallback
);

// Facebook Auth Routes
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    socialAuthController.facebookCallback
);

// Twitter Auth Routes
router.get('/twitter',
    passport.authenticate('twitter')
);

router.get('/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    socialAuthController.twitterCallback
);

module.exports = router; 