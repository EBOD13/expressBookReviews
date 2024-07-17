const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, 'your_jwt_secret_key'); // Replace with your secret key
  req.session.token = token; // Store the token in the session

  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query; // Get the review from the request query
  const username = req.session.username; // Get the username from the session

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Initialize reviews for the ISBN if not present
  if (!books[isbn].reviews) {
    books[isbn].reviews = [];
  }

  // Check for existing review from the user
  const existingReviewIndex = books[isbn].reviews.findIndex(r => r.user === username);

  if (existingReviewIndex >= 0) {
    // Update existing review
    books[isbn].reviews[existingReviewIndex].review = review;
  } else {
    // Add new review
    books[isbn].reviews.push({ user: username, review });
  }

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Get the username from the session

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Filter out the review for the logged-in user
  const initialLength = books[isbn].reviews.length;
  books[isbn].reviews = books[isbn].reviews.filter(review => review.user !== username);

  if (books[isbn].reviews.length < initialLength) {
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
