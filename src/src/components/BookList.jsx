import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { BookCard } from './BookCard';
import { Search, Filter } from 'lucide-react';

export function BookList({ books, onBookClick, onToggleFavorite }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Get unique values for filters
  const authors = useMemo(() => 
    Array.from(new Set(books.map(book => book.author))).sort(),
    [books]
  );

  const years = useMemo(() => 
    Array.from(new Set(books.map(book => book.year))).sort((a, b) => b - a),
    [books]
  );

  const genres = useMemo(() => 
    Array.from(new Set(books.map(book => book.genre))).sort(),
    [books]
  );

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAuthor = selectedAuthor === 'all' || book.author === selectedAuthor;
      const matchesYear = selectedYear === 'all' || book.year.toString() === selectedYear;
      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;

      return matchesSearch && matchesAuthor && matchesYear && matchesGenre;
    });
  }, [books, searchQuery, selectedAuthor, selectedYear, selectedGenre]);

  // Group books by author
  const booksByAuthor = useMemo(() => {
    const grouped = {};
    filteredBooks.forEach(book => {
      if (!grouped[book.author]) {
        grouped[book.author] = [];
      }
      grouped[book.author].push(book);
    });
    return grouped;
  }, [filteredBooks]);

  // Group books by year
  const booksByYear = useMemo(() => {
    const grouped = {};
    filteredBooks.forEach(book => {
      if (!grouped[book.year]) {
        grouped[book.year] = [];
      }
      grouped[book.year].push(book);
    });
    return grouped;
  }, [filteredBooks]);

  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title or author..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-slate-300">
            <Filter className="w-5 h-5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="all">All Authors</option>
            {authors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-slate-300">View:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="grid">Grid</option>
              <option value="by-author">By Author</option>
              <option value="by-year">By Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-slate-400">
        Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-12 text-center">
          <p className="text-slate-400">No books found matching your criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={() => onBookClick(book)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : viewMode === 'by-author' ? (
        <div className="space-y-8">
          {Object.entries(booksByAuthor)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([author, authorBooks]) => (
              <div key={author} className="space-y-4">
                <h2 className="text-slate-200 pb-2 border-b-2 border-blue-600">{author}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {authorBooks.map(book => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => onBookClick(book)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(booksByYear)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, yearBooks]) => (
              <div key={year} className="space-y-4">
                <h2 className="text-slate-200 pb-2 border-b-2 border-violet-600">{year}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {yearBooks.map(book => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => onBookClick(book)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.array.isRequired,
  onBookClick: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};
