import { useState, useEffect } from 'react';

export function BookDetailModal({ book, currentUser, onClose, onMarkRead, onUnmarkRead, onRate, onOpenReader }) {
  const [hoverRating, setHoverRating] = useState(0);
  const isRead = book.readBy?.includes(currentUser?.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-white truncate pr-4">{book.title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl shrink-0">×</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left - Cover & Actions */}
            <div className="w-full md:w-1/3 space-y-4">
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-800">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">📚</div>
                )}
              </div>

              {/* Mark as Read */}
              <button
                onClick={() => isRead ? onUnmarkRead(book.id) : onMarkRead(book.id)}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${isRead ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isRead ? '✓ Marked as Read' : '📖 Mark as Read'}
              </button>

              {/* Read Book Button */}
              <button
                onClick={() => onOpenReader(book)}
                className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/25"
              >
                📖 Read Full Book
              </button>

              {/* Rating */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white/60 text-center mb-2">Rate this book</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => onRate(book.id, star)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <span className={star <= (hoverRating || book.rating || 0) ? 'text-yellow-400' : 'text-white/20'}>★</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/40 text-center mt-2">
                  {book.rating ? `${book.rating}/5` : 'Not rated'}
                </p>
              </div>
            </div>

            {/* Right - Book Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-sm text-white/40 block">Author</span>
                  <span className="text-lg text-white">{book.author}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-sm text-white/40 block">Year</span>
                  <span className="text-lg text-white">{book.year}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-sm text-white/40 block">Genre</span>
                  <span className="text-lg text-white">{book.genre}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-sm text-white/40 block">Added</span>
                  <span className="text-lg text-white">{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-lg font-medium text-white mb-3">Book Content</h3>
                <div className="max-h-64 overflow-y-auto">
                  {book.content ? (
                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{book.content}</p>
                  ) : (
                    <p className="text-white/40 italic">No content available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
