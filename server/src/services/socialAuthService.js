const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const { generateToken } = require('../config/auth');

class SocialAuthService {
    constructor() {
        this.initializeStrategies();
    }

    initializeStrategies() {
        // Google Strategy
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL}/auth/google/callback`,
            passReqToCallback: true
        }, this.googleStrategyCallback));

        // Facebook Strategy
        passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
            profileFields: ['id', 'emails', 'name', 'picture'],
            passReqToCallback: true
        }, this.facebookStrategyCallback));

        // Twitter Strategy
        passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_API_KEY,
            consumerSecret: process.env.TWITTER_API_SECRET,
            callbackURL: `${process.env.API_URL}/auth/twitter/callback`,
            includeEmail: true,
            passReqToCallback: true
        }, this.twitterStrategyCallback));
    }

    async googleStrategyCallback(req, accessToken, refreshToken, profile, done) {
        try {
            const userData = {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
                googleId: profile.id,
                verified: profile.emails[0].verified
            };

            // Here you would typically:
            // 1. Check if user exists in your database
            // 2. Create new user if they don't exist
            // 3. Update existing user if they do exist
            
            return done(null, userData);
        } catch (error) {
            return done(error, null);
        }
    }

    async facebookStrategyCallback(req, accessToken, refreshToken, profile, done) {
        try {
            const userData = {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
                facebookId: profile.id
            };

            return done(null, userData);
        } catch (error) {
            return done(error, null);
        }
    }

    async twitterStrategyCallback(req, token, tokenSecret, profile, done) {
        try {
            const userData = {
                email: profile.emails[0].value,
                username: profile.username,
                profilePicture: profile.photos[0].value,
                twitterId: profile.id
            };

            return done(null, userData);
        } catch (error) {
            return done(error, null);
        }
    }

    // Helper method to generate auth response
    generateAuthResponse(user) {
        const token = generateToken(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                profilePicture: user.profilePicture
            },
            token
        };
    }

    // Handle auth failure
    handleAuthError(error) {
        return {
            success: false,
            message: 'Authentication failed',
            error: error.message
        };
    }

    // Middleware to check if user is authenticated via social login
    isAuthenticatedSocial(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({
            success: false,
            message: 'Social authentication required'
        });
    }
}

// Create and export a single instance
const socialAuthService = new SocialAuthService();

module.exports = socialAuthService; 