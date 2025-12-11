import { BookCard } from './BookCard';

export function BookList({ books, viewMode, currentUser, isAdmin, onEdit, onDelete, onToggleFavorite, onRate, onOpen }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-white/40 text-lg">No books found</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} currentUser={currentUser} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} onRate={onRate} onOpen={onOpen} />
        ))}
      </div>
    );
  }

  if (viewMode === 'by-author') {
    const booksByAuthor = books.reduce((acc, book) => {
      if (!acc[book.author]) acc[book.author] = [];
      acc[book.author].push(book);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {Object.entries(booksByAuthor).map(([author, authorBooks]) => (
          <div key={author}>
            <h3 className="text-2xl font-bold text-white mb-4">{author}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {authorBooks.map(book => (
                <BookCard key={book.id} book={book} currentUser={currentUser} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} onRate={onRate} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === 'by-year') {
    const booksByYear = books.reduce((acc, book) => {
      if (!acc[book.year]) acc[book.year] = [];
      acc[book.year].push(book);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {Object.keys(booksByYear).sort((a, b) => b - a).map(year => (
          <div key={year}>
            <h3 className="text-2xl font-bold text-white mb-4">{year}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {booksByYear[year].map(book => (
                <BookCard key={book.id} book={book} currentUser={currentUser} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} onRate={onRate} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
