'use strict';
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

//added to clean up project with modules, this separates the link navigation (routes)
const routes = require('./routes.js');

//added to clean up project with modules, this separates authorization
const auth = require('./auth.js');

//moved up so is initialized before used
const app = express();

//added to require & instantiate http
const http = require('http').createServer(app);

//added to require & instantiate socket.io as io
const io = require('socket.io')(http);

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

  //added to tell server when to access routes module
  routes(app, myDataBase);

  //added to tell server when to access auth module
  auth(app, myDataBase);

  //added to allow count of connections/users
  let currentUsers = 0;

  //added to define what to do on connection
  io.on('connection', (socket) => {
    ++currentUsers;
    io.emit('user count', currentUsers);
    console.log('A user has connected');
    
    //added to define what to do on disconnect
    socket.on('disconnect', () => {
      console.log('A user has disconnected');
      --currentUsers;
      io.emit('user count', currentUsers);
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