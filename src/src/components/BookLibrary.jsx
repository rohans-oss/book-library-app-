import { useState } from 'react';
import PropTypes from 'prop-types';
import { BookList } from './BookList';
import { BookDetail } from './BookDetail';
import { AddEditBookModal } from './AddEditBookModal';
import { Header } from './Header';
import { Dashboard } from './Dashboard';

export function BookLibrary({ 
  user, 
  books, 
  onLogout, 
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onToggleFavorite,
  onRateBook
}) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowDashboard(false);
  };

  const handleBackToList = () => {
    setSelectedBook(null);
    setShowDashboard(true);
  };

  const handleAddBook = (book) => {
    onAddBook(book);
    setIsAddModalOpen(false);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setSelectedBook(null);
  };

  const handleUpdateBook = (book) => {
    if (editingBook) {
      onUpdateBook(editingBook.id, book);
      setEditingBook(null);
    }
  };

  const handleDeleteBook = (id) => {
    onDeleteBook(id);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        user={user} 
        onLogout={onLogout}
        onAddBook={() => setIsAddModalOpen(true)}
        showDashboard={showDashboard}
        onToggleDashboard={() => setShowDashboard(!showDashboard)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedBook ? (
          <BookDetail
            book={selectedBook}
            onBack={handleBackToList}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onToggleFavorite={onToggleFavorite}
            onRateBook={onRateBook}
          />
        ) : (
          <>
            {showDashboard && <Dashboard books={books} />}
            <BookList 
              books={books}
              onBookClick={handleBookClick}
              onToggleFavorite={onToggleFavorite}
            />
          </>
        )}
      </main>

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <AddEditBookModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddBook}
        />
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <AddEditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={handleUpdateBook}
        />
      )}
    </div>
  );
}

BookLibrary.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  books: PropTypes.array.isRequired,
  onLogout: PropTypes.func.isRequired,
  onAddBook: PropTypes.func.isRequired,
  onUpdateBook: PropTypes.func.isRequired,
  onDeleteBook: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onRateBook: PropTypes.func.isRequired
};
