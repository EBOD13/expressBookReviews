const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try{
    res.status(200).json(JSON.stringify(books));
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the request parameters
  const booksArray = Object.values(books); // Convert the books object to an array
  const filteredBook = booksArray.find(book => book.isbn === isbn); // Find the book by ISBN

  if (filteredBook) {
      return res.status(200).json(filteredBook); // Return the matching book
  } else {
      return res.status(404).json({ message: "Book not found" }); // Handle no matches
  }
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Get the author from the request parameters
  const booksArray = Object.values(books); // Convert the books object to an array
  const filteredBooks = booksArray.filter(book => book.author.toLowerCase() === author.toLowerCase()); // Filter by author

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks); // Return matching books
  } else {
      return res.status(404).json({ message: "No books found for this author" }); // Handle no matches
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; // Get the title from the request parameters
  const booksArray = Object.values(books); // Convert the books object to an array
  const filteredBooks = booksArray.filter(book => book.title.toLowerCase() === title.toLowerCase()); // Filter by author

  if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks); // Return matching books
  } else {
      return res.status(404).json({ message: "No books found for this author" }); // Handle no matches
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;

  // Get the reviews for the given ISBN
  const bookReviews = review[isbn];

  if (bookReviews) {
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
