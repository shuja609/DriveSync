// const passport = require('passport');
// const socialAuthService = require('../services/socialAuthService');

// // Google Auth Routes
// router.get('/google',
//     passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// router.get('/google/callback',
//     passport.authenticate('google', { session: false }),
//     (req, res) => {
//         const authResponse = socialAuthService.generateAuthResponse(req.user);
//         res.json(authResponse);
//     }
// );

// // Facebook Auth Routes
// router.get('/facebook',
//     passport.authenticate('facebook', { scope: ['email'] })
// );

// router.get('/facebook/callback',
//     passport.authenticate('facebook', { session: false }),
//     (req, res) => {
//         const authResponse = socialAuthService.generateAuthResponse(req.user);
//         res.json(authResponse);
//     }
// );

// // Twitter Auth Routes
// router.get('/twitter',
//     passport.authenticate('twitter')
// );

// router.get('/twitter/callback',
//     passport.authenticate('twitter', { session: false }),
//     (req, res) => {
//         const authResponse = socialAuthService.generateAuthResponse(req.user);
//         res.json(authResponse);
//     }
// );