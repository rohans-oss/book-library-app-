const fs = require('fs');
const path = require('path');
const fetch = global.fetch || ((url, opts) => require('node-fetch')(url, opts));
const { ensureDemoUser } = require('./create_demo_user');

const dataDir = path.join(__dirname, 'data');
const booksFile = path.join(dataDir, 'books.json');
const usersFile = path.join(dataDir, 'users.json');

async function run() {
  if (!fs.existsSync(booksFile)) {
    console.error('books.json not found. Run seed first.');
    process.exit(1);
  }

  const books = JSON.parse(fs.readFileSync(booksFile, 'utf8') || '[]');
  if (!books.length) {
    console.error('No books found in books.json');
    process.exit(1);
  }

  const demo = ensureDemoUser();

  const book = books[0];
  console.log('Using book:', book.title, book.id);

  // mark as read
  const readRes = await fetch(`http://localhost:5000/api/read/${book.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: demo.id })
  });
  console.log('Mark read status:', readRes.status);

  // rate the book 5
  const rateRes = await fetch(`http://localhost:5000/api/books/${book.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 5 })
  });
  console.log('Rate status:', rateRes.status);

  // reload books.json from disk
  const updatedBooks = JSON.parse(fs.readFileSync(booksFile, 'utf8') || '[]');
  const updated = updatedBooks.find(b => b.id === book.id);
  console.log('Updated book snippet:');
  console.log(JSON.stringify({ id: updated.id, title: updated.title, rating: updated.rating, readBy: updated.readBy?.slice(0,5) }, null, 2));
}

run().catch(err => { console.error(err); process.exit(1); });
