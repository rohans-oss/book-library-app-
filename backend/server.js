const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const booksFile = path.join(dataDir, 'books.json');
const favoritesFile = path.join(dataDir, 'favorites.json');

// Initialize data directory and files
function initializeDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(booksFile)) {
    fs.writeFileSync(booksFile, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(favoritesFile)) {
    fs.writeFileSync(favoritesFile, JSON.stringify([], null, 2));
  }
}

// Helper functions to read/write data
function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function readBooks() {
  return JSON.parse(fs.readFileSync(booksFile, 'utf8'));
}

function writeBooks(books) {
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
}

function readFavorites() {
  return JSON.parse(fs.readFileSync(favoritesFile, 'utf8'));
}

function writeFavorites(favorites) {
  fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
}

initializeDataStore();

// ==================== AUTHENTICATION ENDPOINTS ====================

// Signup
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const users = readUsers();

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const id = uuidv4();
    const newUser = { id, name, email, password };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({
      id,
      name,
      email,
      message: 'User created successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== BOOKS ENDPOINTS ====================

// Get all books
app.get('/api/books', (req, res) => {
  try {
    const books = readBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single book
app.get('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params;
    const books = readBooks();
    const book = books.find(b => b.id === id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get book content - fetch from Open Library or return sample content
app.get('/api/books/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    const books = readBooks();
    const book = books.find(b => b.id === id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // If book already has substantial content (more than 500 chars), return it
    if (book.content && book.content.length > 500) {
      return res.json({ content: book.content });
    }

    // Generate sample content based on the book
    const sampleContent = generateBookContent(book);

    // Update the book with this content
    const bookIndex = books.findIndex(b => b.id === id);
    books[bookIndex].content = sampleContent;
    writeBooks(books);

    res.json({ content: sampleContent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate sample book content
function generateBookContent(book) {
  const intro = book.content || `This is the story of ${book.title}.`;

  const paragraphs = [
    intro,
    `\n\n${book.title} by ${book.author} is widely considered one of the greatest works of ${book.genre.toLowerCase()} literature. Written in ${book.year}, it has captivated readers for generations with its compelling narrative and profound themes.`,
    `\n\nThe story begins in a world both familiar and mysterious. As readers journey through the pages, they discover layers of meaning that speak to the human condition. ${book.author} masterfully weaves together plot elements that keep readers engaged from beginning to end.`,
    `\n\nChapter One: The Beginning\n\nThe morning sun cast long shadows across the landscape as our story begins. There was a sense of anticipation in the air, as if the world itself knew that something significant was about to unfold. The protagonist stood at the threshold of a great adventure, unaware of the challenges and triumphs that lay ahead.`,
    `\n\n"Every journey starts with a single step," someone once said, and how true those words proved to be. The first chapter of this tale sets the stage for everything that follows, introducing us to a cast of characters who will become as familiar as old friends by the story's end.`,
    `\n\nChapter Two: The Journey Begins\n\nDays turned into weeks as the adventure continued. Each new chapter brought fresh revelations and unexpected twists. The world of ${book.title} is richly detailed, filled with vivid descriptions that transport readers to another time and place.`,
    `\n\nThe central themes of the book - love, loss, redemption, and the search for meaning - resonate deeply with readers of all ages. ${book.author}'s prose is both elegant and accessible, making this a book that rewards multiple readings.`,
    `\n\nChapter Three: Challenges and Triumphs\n\nNo great story is complete without conflict, and ${book.title} delivers in abundance. The characters face seemingly insurmountable obstacles, yet they persevere. Their struggles mirror our own, reminding us of the resilience of the human spirit.`,
    `\n\nAs the plot unfolds, we witness moments of both heartbreak and joy. The author's ability to evoke genuine emotion is remarkable, drawing readers into the story's world completely. Page by page, chapter by chapter, we become invested in the fates of these fictional beings.`,
    `\n\nChapter Four: The Heart of the Story\n\nAt its core, ${book.title} is about the choices we make and how they shape our destinies. The narrative explores what it means to be human, to love, to fail, and to ultimately find redemption. These universal themes have ensured the book's lasting appeal.`,
    `\n\nThe middle chapters of the book are particularly compelling, as the pace quickens and the stakes grow higher. ${book.author} demonstrates a remarkable command of narrative tension, keeping readers on the edge of their seats while never sacrificing character development.`,
    `\n\nChapter Five: Revelations\n\nAs secrets are revealed and truths come to light, the story takes unexpected turns. The author's careful plotting pays off as seemingly unrelated threads begin to weave together into a coherent whole. What once seemed random now appears purposeful, even inevitable.`,
    `\n\nThe relationships between characters deepen and evolve. Alliances shift, motivations are questioned, and the true nature of each person is gradually revealed. ${book.title} is as much a character study as it is a ${book.genre.toLowerCase()} tale.`,
    `\n\nChapter Six: The Climax\n\nBuilding toward its conclusion, the story reaches a fever pitch. All the elements that have been carefully introduced throughout the narrative converge in a stunning climax. The reader's investment in the characters makes this section particularly powerful.`,
    `\n\nEvery word seems chosen with precision, every scene crafted to maximum effect. ${book.author}'s literary skill is on full display as the story races toward its conclusion. The tension is palpable, the emotions raw and real.`,
    `\n\nChapter Seven: Resolution\n\nAs the final pages approach, loose ends are tied and fates are sealed. The resolution is both satisfying and thought-provoking, leaving readers with much to ponder long after the last page is turned. This is the mark of truly great literature.`,
    `\n\n${book.title} stands as a testament to ${book.author}'s genius and remains essential reading for anyone who loves well-crafted ${book.genre.toLowerCase()} fiction. Its influence on subsequent literature cannot be overstated.`,
    `\n\nThe End\n\nThank you for reading ${book.title}. We hope this journey through ${book.author}'s remarkable imagination has been as rewarding for you as it has been for countless readers before. May the themes and messages of this story stay with you always.`
  ];

  return paragraphs.join('');
}

// Create book
app.post('/api/books', (req, res) => {
  try {
    const { title, author, year, genre, coverImage, rating, content } = req.body;

    if (!title || !author || !year || !genre) {
      return res.status(400).json({ error: 'Title, author, year, and genre are required' });
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const newBook = {
      id,
      title,
      author,
      year,
      genre,
      coverImage: coverImage || null,
      content: content || null,
      rating: rating || 0,
      createdAt,
      favorites: [],
      readBy: []
    };

    const books = readBooks();
    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book
app.put('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre, coverImage, rating, content } = req.body;

    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;
    if (year) books[bookIndex].year = year;
    if (genre) books[bookIndex].genre = genre;
    if (coverImage) books[bookIndex].coverImage = coverImage;
    if (content !== undefined) books[bookIndex].content = content;
    if (rating !== undefined) books[bookIndex].rating = rating;

    writeBooks(books);
    res.json(books[bookIndex]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  try {
    const { id } = req.params;

    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    writeBooks(books);

    // Also remove from favorites
    const favorites = readFavorites();
    const updatedFavorites = favorites.filter(f => f.bookId !== id);
    writeFavorites(updatedFavorites);

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FAVORITES ENDPOINTS ====================

// Add to favorites
app.post('/api/favorites/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const books = readBooks();
    if (!books.find(b => b.id === bookId)) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const favorites = readFavorites();
    if (favorites.find(f => f.userId === userId && f.bookId === bookId)) {
      return res.status(400).json({ error: 'Already favorited' });
    }

    favorites.push({ userId, bookId });
    writeFavorites(favorites);

    // Update book's favorites array
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (!books[bookIndex].favorites) books[bookIndex].favorites = [];
    books[bookIndex].favorites.push(userId);
    writeBooks(books);

    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from favorites
app.delete('/api/favorites/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const favorites = readFavorites();
    const favIndex = favorites.findIndex(f => f.userId === userId && f.bookId === bookId);

    if (favIndex !== -1) {
      favorites.splice(favIndex, 1);
      writeFavorites(favorites);
    }

    // Update book's favorites array
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      books[bookIndex].favorites = books[bookIndex].favorites?.filter(id => id !== userId) || [];
      writeBooks(books);
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== READ (mark as read) ENDPOINTS ====================

// Mark as read
app.post('/api/read/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });

    if (!books[bookIndex].readBy) books[bookIndex].readBy = [];
    if (!books[bookIndex].readBy.includes(userId)) {
      books[bookIndex].readBy.push(userId);
      writeBooks(books);
    }

    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unmark read
app.delete('/api/read/:bookId', (req, res) => {
  try {
    const { bookId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return res.status(404).json({ error: 'Book not found' });

    books[bookIndex].readBy = (books[bookIndex].readBy || []).filter(id => id !== userId);
    writeBooks(books);

    res.json({ message: 'Unmarked read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SEARCH ENDPOINTS ====================

// Search books
app.get('/api/search', (req, res) => {
  try {
    const { q, genre, author } = req.query;
    let books = readBooks();

    if (q) {
      books = books.filter(b =>
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (genre) {
      books = books.filter(b => b.genre === genre);
    }

    if (author) {
      books = books.filter(b => b.author === author);
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${dataDir}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Server shutting down...');
  process.exit(0);
});
