
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { Op } from 'sequelize';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/signin',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { googleId: profile.id },
          { email: email }
        ]
      }
    });

    if (user) {
      // If user exists but googleId not saved yet
      if (!user.googleId) {
        user.googleId = profile.id;
        user.isVerified = true;
        await user.save();
      }
      return done(null, user);
    }

    // Define special emails for admin and recruiter
    const adminEmails = ['admin@gmail.com'];
    const recruiterEmails = ['recruiter@gmail.com'];

    let userRole = 'candidate'; // default
    if (adminEmails.includes(email)) userRole = 'admin';
    else if (recruiterEmails.includes(email)) userRole = 'recruiter';

    const newUser = await User.create({
      name: profile.displayName,
      email,
      googleId: profile.id,
      isVerified: true,
      role: userRole
    });

    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


