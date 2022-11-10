//added to create passport
const passport = require('passport');

//added to setup authentication strategy
const LocalStrategy = require('passport-local');

//added to assist with password encryption
const bcrypt = require('bcrypt');

//added to connect MongoDB for sessions
const { ObjectID } = require('mongodb');

//added to setup GitHub authentication strategy
const GitHubStrategy = require('passport-github').Strategy;

module.exports = function (app, myDataBase) {

  //added to encrypt the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  //added to decrypt the session, only when user has successfully logged in.
  passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        //updated to catch error and print to console
        if (err) return console.error(err);
        //updated from "null, null" to "null, doc" to apply error checking
        done(null, doc);
      });
  }); 

  //added to define the new local authentication strategy 
  passport.use(new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      //updated to include encrypted password handling if is incorrect
      if (!bcrypt.compareSync(password, user.password)) { 
          return done(null, false);
      }
      return done(null, user);
    });
  })); 

  //added to define the new GitHub authentication strategy
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://boilerplate-advancednode.k4tiek3nt.repl.co/auth/github/callback'    
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      //Database logic with callback containing user object
      myDataBase.findAndModify(
        { id: profile.id },
        {},
        {
          $setOnInsert: {
            id: profile.id,
            name: profile.displayName || 'John Doe',
            photo: profile.photos[0].value || '',
            email: Array.isArray(profile.emails) ? profile.emails[0].value : 'No public email',
            created_on: new Date(),
            provider: profile.provider || ''
          }, $set: {
            last_login: new Date()
          }, $inc: {
            login_count: 1
          }
        },
        { upsert: true, new: true },
        (err, doc) => {
          return cb(null, doc.value);
        }
      );
    }
  ));
}