//added to create passport
const passport = require('passport');

//added to assist with password encryption
const bcrypt = require('bcrypt');

module.exports = function (app, myDataBase) {

  app.route('/').get((req, res) => {

  //added to allow rendering of home page (index)
  //updated to include showSocialAuth: true
  res.render('index', { 
    title: 'Connected to Database', 
    message: 'Please log in',
    showLogin: true,
    showRegistration: true,
    showSocialAuth: true
    });  
  });

  //added to allow routing to profile page when valid user logs in
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  //added /profile to render the view profile.pug.
  //Note: If the authentication is successful, the user object will be saved in req.user.
  app.route('/profile').get(ensureAuthenticated,(req,res) => {
    //updated from res.render(process.cwd() + '/views/pug/profile');
    //this will now render the profile.pug if user is authenticated
    res.render('profile', { username: req.user.username });
  });

  //added to unauthenticate a user (logout a user)
  app.route('/logout').get((req, res) => {
    req.logout();
    res.redirect('/');
  });

  //added /register to allow a user to register with POST request that 
  //also authenticates info to confirm if user exists or is new. 
  app.route('/register').post((req, res, next) => {
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

  //added to allow OAuth with github, now inside module instead of below
  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback')
    .get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
      res.redirect('/profile');
  });
  
  //added to handle 404 errors (page not found), this is middleware
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });  
}

//middleware that checks for authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};  