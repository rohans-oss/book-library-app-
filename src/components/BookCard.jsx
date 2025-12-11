export function BookCard({ book, currentUser, isAdmin, onEdit, onDelete, onToggleFavorite, onRate, onOpen }) {
  const isFavorite = book.favorites?.includes(currentUser?.id);
  const isRead = book.readBy?.includes(currentUser?.id);

  return (
    <div
      className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer"
      onClick={() => onOpen(book)}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">📚</div>
        )}

        {isRead && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">READ</span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all ${isFavorite ? 'bg-pink-500 text-white' : 'bg-black/50 text-white/60 hover:text-white'}`}
        >
          <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{book.title}</h3>
        <p className="text-sm text-white/60">{book.author}</p>

        <div className="flex items-center justify-between mt-2 text-xs text-white/40">
          <span>{book.year} • {book.genre}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= (book.rating || 0) ? 'text-yellow-400' : 'text-white/20'}>★</span>
            ))}
          </div>
        </div>

        {/* Admin-only Edit/Delete buttons */}
        {isAdmin && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(book); }}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white"
            >
              ✏️ Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
              className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs text-red-400"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
