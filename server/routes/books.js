/***************************************************
     * File: books.js
     * Author: Yizhao Huang, 
     * StudentID: 300742134
     * Web App name: COMP308-W2017-MidTerm-Booklist
     * Description: books route to handle routing and books functions
****************************************************/

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

//Display all books
/* GET books List page. READ */
router.get('/', requireAuth,(req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        messages: req.flash('loginMessage'),
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });

});

//  Add new book to DB, render adding book page 
//  GET the Book Details page in order to add a new Book
router.get('/add', requireAuth,(req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    //render detail view to display the books
    res.render('books/details', {
    title: "Add a new Book",
    books: "",
    displayName: req.user ? req.user.displayName : ''
  });

});

// Save new book to DB 
// POST process the Book Details page and create a new Book - CREATE
router.post('/add',requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    //create a newBook object, and get the req from the form
    let newBook = book({
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.create(newBook, (err, book) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/books');
      }
    });

});

// Edit book detail- Get info
// GET the Book Details page in order to edit an existing Book
router.get('/:id',requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
     //get id from body parameter 
     try {
      // get a reference to the id from the url
      let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

      // find one book by its id
      book.findById(id, (err, books) => {
        if(err) {
          console.log(err);
          res.end(error);
        } else {
          // show the book details view
          res.render('books/details', {
              title: 'Edit Book Details',
              books: books,
              displayName: req.user ? req.user.displayName : ''
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect('/errors/404');
    }

});

// Edit book detail - Update info
// POST - process the information passed from the details form and update the document
router.post('/:id',requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
     // get id from the URL then pass the req body to update Book object
    let id = req.params.id;

     let updatedBook = book({
       "_id": id,
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.update({_id: id}, updatedBook, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the book List
        res.redirect('/books');
      }
    });


});

// Delete the book according to the id 
// GET - process the delete by book id
router.get('/delete/:id',requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
      // get a reference to the id from the url
    let id = req.params.id;

    book.remove({_id: id}, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the books list
        res.redirect('/books');
      }
    });
});


module.exports = router;
