export function Dashboard({ books, onClose }) {
  const totalBooks = books.length;
  const readBooks = books.filter(b => b.readBy && b.readBy.length > 0).length;
  const favoriteBooks = books.filter(b => b.favorites && b.favorites.length > 0).length;

  const booksByGenre = books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
        >
          ← Back to Library
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg text-white/60 mb-2">Total Books</h3>
          <p className="text-4xl font-bold text-white">{totalBooks}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg text-white/60 mb-2">Books Read</h3>
          <p className="text-4xl font-bold text-purple-400">{readBooks}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg text-white/60 mb-2">Favorites</h3>
          <p className="text-4xl font-bold text-pink-400">{favoriteBooks}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Books by Genre</h3>
        <div className="space-y-4">
          {Object.entries(booksByGenre).map(([genre, count]) => (
            <div key={genre} className="flex items-center gap-4">
              <div className="w-32 text-sm text-white/60">{genre}</div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(count / totalBooks) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right text-sm text-white font-medium">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
