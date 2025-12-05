import { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export function AddEditBookModal({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    year: book?.year?.toString() || '',
    genre: book?.genre || '',
    description: book?.description || '',
    coverImage: book?.coverImage || '',
    pages: book?.pages?.toString() || '',
    isbn: book?.isbn || '',
    rating: book?.rating?.toString() || '',
    isFavorite: book?.isFavorite || false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (isNaN(Number(formData.year)) || Number(formData.year) < 0 || Number(formData.year) > new Date().getFullYear()) {
      newErrors.year = 'Please enter a valid year';
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSave({
        title: formData.title.trim(),
        author: formData.author.trim(),
        year: Number(formData.year),
        genre: formData.genre.trim(),
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim(),
        pages: formData.pages ? Number(formData.pages) : undefined,
        isbn: formData.isbn.trim() || undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
        isFavorite: formData.isFavorite
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-blue-600 to-violet-600">
          <h2 className="text-white">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block mb-2 text-slate-300">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-800/50 border text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500 ${
                errors.title ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="mt-1 text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="author" className="block mb-2 text-slate-300">
              Author *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-800/50 border text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500 ${
                errors.author ? 'border-red-500' : 'border-slate-700'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-red-400">{errors.author}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block mb-2 text-slate-300">
                Year *
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-800/50 border text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500 ${
                  errors.year ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="2024"
              />
              {errors.year && (
                <p className="mt-1 text-red-400">{errors.year}</p>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="block mb-2 text-slate-300">
                Genre *
              </label>
              <input
                id="genre"
                name="genre"
                type="text"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-800/50 border text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500 ${
                  errors.genre ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Fiction, Non-fiction, etc."
              />
              {errors.genre && (
                <p className="mt-1 text-red-400">{errors.genre}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pages" className="block mb-2 text-slate-300">
                Pages
              </label>
              <input
                id="pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
                placeholder="320"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block mb-2 text-slate-300">
                Rating (0-5)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
                placeholder="4.5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="isbn" className="block mb-2 text-slate-300">
              ISBN
            </label>
            <input
              id="isbn"
              name="isbn"
              type="text"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
              placeholder="978-0-123-45678-9"
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block mb-2 text-slate-300">
              Cover Image URL
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none placeholder:text-slate-500"
              placeholder="Enter book description..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transition shadow-lg shadow-blue-500/25"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddEditBookModal.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    genre: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    pages: PropTypes.number,
    isbn: PropTypes.string,
    rating: PropTypes.number,
    isFavorite: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};
