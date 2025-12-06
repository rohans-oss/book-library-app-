# Book Library App

A full-featured Book Management Web Application where users can sign up,
log in, explore books, add new books, delete books, rate them, mark
favorites, and track reading progress.

## Features

### Authentication

-   User Signup & Login
-   Secure authentication with protected routes
-   Personalized dashboard

### Book Management

-   Add new books
-   Delete books
-   Mark a book as Read
-   Add/remove Favorites
-   Rate books

### Filters & Search

-   Search by book name
-   Filter by Genre
-   Filter by Rating
-   Show only Favorites
-   Show only Read Books

## Tech Stack

### Frontend

-   React JS
-   CSS / Tailwind
-   Fetch or Axios

### Backend

-   Node.js + Express.js

### Database

-   MongoDB

## How to Run

1.  Clone the repo: git clone
    https://github.com/your-repo/book-library-app.git

2.  Install frontend: cd frontend npm install npm run dev

3.  Install backend: cd backend npm install npm start

4.  Ensure MongoDB is running.

## API Endpoints

-   POST /auth/signup
-   POST /auth/login
-   GET /books
-   POST /books
-   DELETE /books/:id

## Purpose

This app helps users manage their digital book collection by organizing,
rating, and tracking reading progress.
