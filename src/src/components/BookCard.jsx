import PropTypes from 'prop-types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookOpen, Heart, Star } from 'lucide-react';

export function BookCard({ book, onClick, onToggleFavorite }) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(book.id);
  };

  return (
    <div
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer overflow-hidden group border border-slate-800 hover:border-blue-500/50 hover:-translate-y-2"
    >
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden relative">
        {book.coverImage ? (
          <ImageWithFallback
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm p-2.5 rounded-full hover:scale-110 transition-all duration-200 border border-slate-700"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              book.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-400'
            }`}
          />
        </button>

        {/* Rating Badge */}
        {book.rating && (
          <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white">{book.rating}</span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div onClick={onClick} className="p-4 space-y-2">
        <h3 className="text-slate-200 line-clamp-2 group-hover:text-blue-400 transition">
          {book.title}
        </h3>
        <p className="text-slate-400">{book.author}</p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-slate-500">{book.year}</span>
          <span className="text-blue-400 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
            {book.genre}
          </span>
        </div>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    genre: PropTypes.string.isRequired,
    coverImage: PropTypes.string,
    rating: PropTypes.number,
    isFavorite: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};
