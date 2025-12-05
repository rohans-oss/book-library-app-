import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { BookList } from './components/BookList';
import { AddBookModal } from './components/AddBookModal';
import { EditBookModal } from './components/EditBookModal';
import { BookDetailModal } from './components/BookDetailModal';
import { BookReaderModal } from './components/BookReaderModal';
import { booksAPI, favoritesAPI, readAPI } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); }
      catch { localStorage.removeItem('currentUser'); }
    }
  }, []);

  // Load books when user is set
  useEffect(() => {
    if (currentUser) loadBooks();
  }, [currentUser]);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await booksAPI.getAll();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setBooks([]);
    setShowDashboard(false);
  };

  const handleAddBook = async (book) => {
    try {
      const newBook = await booksAPI.create(book);
      setBooks([...books, newBook]);
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add book');
    }
  };

  const handleUpdateBook = async (book) => {
    try {
      const updated = await booksAPI.update(book.id, book);
      setBooks(books.map(b => b.id === book.id ? updated : b));
      setEditingBook(null);
    } catch (err) {
      setError('Failed to update book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await booksAPI.delete(id);
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleToggleFavorite = async (id) => {
    if (!currentUser) return;
    const book = books.find(b => b.id === id);
    const isFav = book?.favorites?.includes(currentUser.id);

    setBooks(books.map(b => b.id === id ? {
      ...b, favorites: isFav
        ? (b.favorites || []).filter(uid => uid !== currentUser.id)
        : [...(b.favorites || []), currentUser.id]
    } : b));

    try {
      if (isFav) await favoritesAPI.remove(id, currentUser.id);
      else await favoritesAPI.add(id, currentUser.id);
    } catch { }
  };

  const handleRate = async (id, rating) => {
    setBooks(books.map(b => b.id === id ? { ...b, rating } : b));
    if (viewingBook?.id === id) setViewingBook({ ...viewingBook, rating });
    try { await booksAPI.update(id, { rating }); } catch { }
  };

  const handleMarkRead = async (id) => {
    if (!currentUser) return;
    setBooks(books.map(b => b.id === id ? { ...b, readBy: [...(b.readBy || []), currentUser.id] } : b));
    if (viewingBook?.id === id) setViewingBook({ ...viewingBook, readBy: [...(viewingBook.readBy || []), currentUser.id] });
    try { await readAPI.add(id, currentUser.id); } catch { }
  };

  const handleUnmarkRead = async (id) => {
    if (!currentUser) return;
    setBooks(books.map(b => b.id === id ? { ...b, readBy: (b.readBy || []).filter(uid => uid !== currentUser.id) } : b));
    if (viewingBook?.id === id) setViewingBook({ ...viewingBook, readBy: (viewingBook.readBy || []).filter(uid => uid !== currentUser.id) });
    try { await readAPI.remove(id, currentUser.id); } catch { }
  };

  const handleOpenBook = async (book) => {
    setViewingBook(book);
    try {
      const full = await booksAPI.getById(book.id);
      setViewingBook(full);
    } catch { }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    if (searchQuery && !book.title?.toLowerCase().includes(searchQuery.toLowerCase()) && !book.author?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterGenre !== 'all' && book.genre !== filterGenre) return false;
    if (filterRating !== 'all') {
      const min = parseInt(filterRating);
      if ((book.rating || 0) < min) return false;
    }
    if (showFavorites && !book.favorites?.includes(currentUser?.id)) return false;
    return true;
  });

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();

  // Show login if not authenticated
  if (!currentUser) {
    return showSignup
      ? <Signup onSignup={handleLogin} onSwitchToLogin={() => setShowSignup(false)} />
      : <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-white/10 sticky top-0 z-40">
        <div className="w-full px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">📚</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Book Library</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowDashboard(!showDashboard)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
              {showDashboard ? 'Library' : 'Dashboard'}
            </button>
            <span className="text-white/60 text-sm">Welcome, {currentUser.name}</span>
            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white" title="Logout">🚪</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-white/60">Loading books...</span>
          </div>
        ) : showDashboard ? (
          <Dashboard books={books} onClose={() => setShowDashboard(false)} />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium flex items-center gap-2">
                ➕ Add New Book
              </button>

              <div className="flex bg-white/5 rounded-lg border border-white/10">
                {['grid', 'by-author', 'by-year'].map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`px-3 py-2 ${viewMode === mode ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'}`}>
                    {mode === 'grid' ? '▦' : mode === 'by-author' ? '👤' : '📅'}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 w-48"
              />

              <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white"
                style={{ backgroundColor: '#1e293b' }}>
                <option value="all" style={{ backgroundColor: '#1e293b' }}>All Genres</option>
                {genres.map(g => <option key={g} value={g} style={{ backgroundColor: '#1e293b' }}>{g}</option>)}
              </select>

              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white"
                style={{ backgroundColor: '#1e293b' }}>
                <option value="all" style={{ backgroundColor: '#1e293b' }}>All Ratings</option>
                <option value="1" style={{ backgroundColor: '#1e293b' }}>1+ ★</option>
                <option value="2" style={{ backgroundColor: '#1e293b' }}>2+ ★</option>
                <option value="3" style={{ backgroundColor: '#1e293b' }}>3+ ★</option>
                <option value="4" style={{ backgroundColor: '#1e293b' }}>4+ ★</option>
              </select>

              <button onClick={() => setShowFavorites(!showFavorites)}
                className={`px-4 py-2 rounded-lg border ${showFavorites ? 'bg-pink-500 border-pink-500' : 'bg-white/5 border-white/10'}`}>
                ❤️ Favorites
              </button>
            </div>

            {/* Book List */}
            <BookList
              books={filteredBooks}
              viewMode={viewMode}
              currentUser={currentUser}
              onEdit={setEditingBook}
              onDelete={handleDeleteBook}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleRate}
              onOpen={handleOpenBook}
            />
          </>
        )}
      </main>

      {/* Modals */}
      {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} onAdd={handleAddBook} />}
      {editingBook && <EditBookModal book={editingBook} onClose={() => setEditingBook(null)} onUpdate={handleUpdateBook} />}
      {viewingBook && <BookDetailModal book={viewingBook} currentUser={currentUser} onClose={() => setViewingBook(null)} onMarkRead={handleMarkRead} onUnmarkRead={handleUnmarkRead} onRate={handleRate} onOpenReader={(book) => { setReadingBook(book); setViewingBook(null); }} />}
      {readingBook && <BookReaderModal book={readingBook} onClose={() => setReadingBook(null)} />}
    </div>
  );
}

export default App;