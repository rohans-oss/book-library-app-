import { useState } from 'react';
import PropTypes from 'prop-types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, User, Tag, Heart, Star, FileText } from 'lucide-react';

export function BookDetail({ book, onBack, onEdit, onDelete, onToggleFavorite, onRateBook }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id);
    }
  };

  const handleRatingClick = (rating) => {
    onRateBook(book.id, rating);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition px-4 py-2 rounded-xl hover:bg-slate-900/50"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Library
      </button>

      {/* Book Detail Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="grid md:grid-cols-[320px,1fr] gap-8 p-8">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden relative group shadow-2xl">
              {book.coverImage ? (
                <ImageWithFallback
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-slate-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Favorite Badge */}
              <button
                onClick={() => onToggleFavorite(book.id)}
                className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm p-3 rounded-full hover:scale-110 transition-all duration-200 border border-slate-700"
              >
                <Heart 
                  className={`w-6 h-6 ${
                    book.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'
                  }`}
                />
              </button>

              {/* Rating on Cover */}
              {book.rating && (
                <div className="absolute bottom-4 left-4 bg-amber-500/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-white fill-white" />
                  <span className="text-white">{book.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(book)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-500/25"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            {/* Rate This Book */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
              <p className="text-slate-300 mb-3">Rate this book</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= (hoveredRating || book.rating || 0)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-slate-100 mb-4">{book.title}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">{book.author}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">{book.year}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                  <Tag className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400">{book.genre}</span>
                </div>
                {book.pages && (
                  <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">{book.pages} pages</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-slate-200 mb-3">About This Book</h2>
              <p className="text-slate-400 leading-relaxed">
                {book.description || 'No description available for this book.'}
              </p>
            </div>

            {/* Book Details Grid */}
            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-slate-200 mb-4">Book Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-500 mb-1">Author</p>
                  <p className="text-slate-200">{book.author}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-500 mb-1">Publication Year</p>
                  <p className="text-slate-200">{book.year}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <p className="text-slate-500 mb-1">Genre</p>
                  <p className="text-slate-200">{book.genre}</p>
                </div>
                {book.pages && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 mb-1">Pages</p>
                    <p className="text-slate-200">{book.pages}</p>
                  </div>
                )}
                {book.isbn && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 col-span-2">
                    <p className="text-slate-500 mb-1">ISBN</p>
                    <p className="text-slate-200 font-mono">{book.isbn}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BookDetail.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    genre: PropTypes.string.isRequired,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    rating: PropTypes.number,
    isFavorite: PropTypes.bool,
    pages: PropTypes.number,
    isbn: PropTypes.string
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onRateBook: PropTypes.func.isRequired
};
