// const socialAuthService = require('../services/socialAuthService');
// const User = require('../models/User');
// const { generateToken } = require('../config/auth');

// const socialAuthController = {
//     // Google callback handler
//     async googleCallback(req, res) {
//         try {
//             const { id, emails, name, photos } = req.user;
            
//             // Check if user exists
//             let user = await User.findOne({ 'socialLogin.google.id': id });

//             if (!user) {
//                 // Create new user if doesn't exist
//                 user = new User({
//                     name: {
//                         first: name.givenName,
//                         last: name.familyName
//                     },
//                     email: emails[0].value,
//                     profilePicture: photos[0].value,
//                     isVerified: true, // Auto verify social login users
//                     socialLogin: {
//                         google: {
//                             id: id,
//                             email: emails[0].value
//                         }
//                     }
//                 });

//                 await user.save();
//             }

//             // Generate auth response
//             const authResponse = socialAuthService.generateAuthResponse(user);
            
//             // Redirect to frontend with token
//             res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${authResponse.token}`);
//         } catch (error) {
//             console.error('Google auth error:', error);
//             res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
//         }
//     },

//     // Facebook callback handler
//     async facebookCallback(req, res) {
//         try {
//             const { id, emails, name, photos } = req.user;
            
//             let user = await User.findOne({ 'socialLogin.facebook.id': id });

//             if (!user) {
//                 user = new User({
//                     name: {
//                         first: name.givenName,
//                         last: name.familyName
//                     },
//                     email: emails[0].value,
//                     profilePicture: photos[0].value,
//                     isVerified: true,
//                     socialLogin: {
//                         facebook: {
//                             id: id,
//                             email: emails[0].value
//                         }
//                     }
//                 });

//                 await user.save();
//             }

//             const authResponse = socialAuthService.generateAuthResponse(user);
//             res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${authResponse.token}`);
//         } catch (error) {
//             console.error('Facebook auth error:', error);
//             res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
//         }
//     },

//     // Twitter callback handler
//     async twitterCallback(req, res) {
//         try {
//             const { id, username, emails, photos } = req.user;
            
//             let user = await User.findOne({ 'socialLogin.twitter.id': id });

//             if (!user) {
//                 user = new User({
//                     name: {
//                         first: username, // Twitter might not provide full name
//                         last: ''
//                     },
//                     email: emails[0].value,
//                     profilePicture: photos[0].value,
//                     isVerified: true,
//                     socialLogin: {
//                         twitter: {
//                             id: id,
//                             username: username
//                         }
//                     }
//                 });

//                 await user.save();
//             }

//             const authResponse = socialAuthService.generateAuthResponse(user);
//             res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${authResponse.token}`);
//         } catch (error) {
//             console.error('Twitter auth error:', error);
//             res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
//         }
//     }
// };

// module.exports = socialAuthController; 