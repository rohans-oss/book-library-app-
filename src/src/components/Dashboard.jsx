import PropTypes from 'prop-types';
import { BookOpen, Star, Heart, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function Dashboard({ books }) {
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const favoriteBooks = books.filter(b => b.isFavorite).length;
    const averageRating = books.reduce((acc, book) => acc + (book.rating || 0), 0) / totalBooks;
    const totalPages = books.reduce((acc, book) => acc + (book.pages || 0), 0);
    
    const genreCount = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
    
    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];

    return {
      totalBooks,
      favoriteBooks,
      averageRating: averageRating.toFixed(1),
      totalPages,
      topGenre: topGenre ? topGenre[0] : 'N/A'
    };
  }, [books]);

  return (
    <div className="mb-8 space-y-6">
      <div>
        <h2 className="text-slate-200 mb-2">Library Overview</h2>
        <p className="text-slate-400">Your reading statistics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Books */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <div className="space-y-1">
            <p className="text-blue-100">Total Books</p>
            <p className="text-white">{stats.totalBooks}</p>
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-pink-200" />
          </div>
          <div className="space-y-1">
            <p className="text-pink-100">Favorites</p>
            <p className="text-white">{stats.favoriteBooks}</p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-amber-200" />
          </div>
          <div className="space-y-1">
            <p className="text-amber-100">Avg Rating</p>
            <p className="text-white">{stats.averageRating} / 5.0</p>
          </div>
        </div>

        {/* Total Pages */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-violet-200" />
          </div>
          <div className="space-y-1">
            <p className="text-violet-100">Total Pages</p>
            <p className="text-white">{stats.totalPages.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Top Genre Badge */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-violet-500 p-4 rounded-xl">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-slate-400">Most Popular Genre</p>
            <p className="text-white">{stats.topGenre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  books: PropTypes.array.isRequired
};
