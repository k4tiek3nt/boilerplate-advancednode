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

//updated title from 'Hello' to 'Connected to Database'
res.render('index', { title: 'Connected to Database', message: 'Please log in' });
  
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
