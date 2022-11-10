//added to create passport
const passport = require('passport');

//added to setup authentication strategy
const LocalStrategy = require('passport-local');

//added to setup GitHub authentication strategy
const GitHubStrategy = require('passport-github').Strategy;

//added to assist with password encryption
const bcrypt = require('bcrypt');

//added to connect MongoDB for sessions
const { ObjectID } = require('mongodb');

module.exports = function (app, myDataBase) {

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
    callbackURL: process.env.GITHUB_REDIRECT_URI    
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      //Database logic here with callback containing your user object
    }
  )); 

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
}