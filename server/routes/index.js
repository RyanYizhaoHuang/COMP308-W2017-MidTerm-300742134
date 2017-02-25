// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');


// define the book model
let book = require('../models/books');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User

// function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged index
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: '',
    messages: req.flash('registerMessage'),
    displayName: req.user ? req.user.displayName : ''
   });
});

//Implement the login feature
/* GET /login - render the login view */
router.get('/login', (req, res, next) => {
  // check to see  if the user is not already logged index
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: 'Login',
      books: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/books'); // redirect to the books list
  }
});

// POST /login - process the login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET /register - render the register page
router.get('/register', (req, res, next) =>{
  // check if the user is not already logged in
  if(!req.user) {
    // render the registration page
    res.render('auth/register', {
      title: 'Register',
      books: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  }
});

// POST /register - process the registration view
router.post('/register', (req, res, next) => {
  User.register(
    new User({
        username: req.body.username,
        //password: req.body.password,
        email: req.body.email,
        displayName: req.body.displayName
      }),
      req.body.password,
      (err) => {
        if(err) {
          console.log('Error insterting new user');
          if(err.name == 'UserExistsError') {
            req.flash('registerMessage', 'Registration Error: User Already Exists!');
          }
          return res.render('auth/register', {
            title: 'Register',
            books: '',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
          });
        }
        // if registration is successful
        return passport.authenticate('local')(req, res, ()=>{
          res.redirect('/books');
        });
      });
});

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to homepage
});

module.exports = router;
