'use strict';
//updated to point to new .env file
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

//added to create session
const session = require('express-session');

//added to create passport
const passport = require('passport');

//added to provide SESSION_SECRET variable
const mySecret = process.env.SESSION_SECRET;

//added to connect MongoDB for sessions
const { ObjectID } = require('mongodb');

//added to setup authentication strategy
const LocalStrategy = require('passport-local');

//added to assist with password encryption
const bcrypt = require('bcrypt');

const app = express();

//added to set view (template) engine
app.set('view engine', 'pug');

//add to set the views property 
app.set('views', './views/pug');

//added to setup session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//added to set what properties of passport app should use
app.use(passport.initialize());
app.use(passport.session());

//For FCC testing purposes
fccTesting(app); 
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//added to allow query of db for list of users
myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

app.route('/').get((req, res) => {

//updated to include showRegistration: true
res.render('index', { 
  title: 'Connected to Database', 
  message: 'Please log in',
  showLogin: true,
  showRegistration: true 
  });  
});

//added /register to allow a user to register with POST request that 
//also authenticates info to confirm if user exists or is new. 
app.route('/register')
  .post((req, res, next) => {
    //added to allow password to be hashed (encrypted)
    const hash = bcrypt.hashSync(req.body.password, 12);
    //query for user
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        //request to add user to database, if not found
        myDataBase.insertOne({
          username: req.body.username,
          //updated from req.body.password to apply password hashing
          password: hash
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        )
      }
    })
  },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

//added /profile to render the view profile.pug.
//Note: If the authentication is successful, the user object will be saved in req.user.
//updated to implement new middleware "ensureAuthenticated"
app.route('/profile').get(ensureAuthenticated,(req,res) => {
  //updated from res.render(process.cwd() + '/views/pug/profile');
  //this will now render the profile.pug if user is authenticated
  res.render('profile', { username: req.user.username });
});

//added to unauthenticate a user (logout a user)
app.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
});

//added to handle 404 errors (page not found), this is middleware
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//added to define the new authentication strategy 
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

//added to encrypt the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//added to decrypt the session, only when user has successfully logged in.
passport.deserializeUser((id, done) => {
  myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    //updated from null, null to null, doc to apply error checking
    done(null, doc);
  });
});

//added for error catching in case database doesn't connect
}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});

//middleware that checks for authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};
        
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
