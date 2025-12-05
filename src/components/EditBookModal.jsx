import { useState } from 'react';

export function EditBookModal({ book, onClose, onUpdate }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [year, setYear] = useState(book.year);
  const [genre, setGenre] = useState(book.genre);
  const [coverImage, setCoverImage] = useState(book.coverImage || '');
  const [content, setContent] = useState(book.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate({ ...book, title, author, year: Number(year), genre, coverImage, content });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showContentEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">Edit Book Content</h2>
          <button onClick={() => setShowContentEditor(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Done</button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-4 bg-transparent text-white text-lg resize-none focus:outline-none"
          placeholder="Paste book content here..."
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl max-h-[90vh] overflow-auto border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Book</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/80 mb-1 text-sm">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-1 text-sm">Author</label>
              <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-white/80 mb-1 text-sm">Year</label>
              <input type="number" required value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-white/80 mb-1 text-sm">Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
            </select>
          </div>
          <div>
            <label className="block text-white/80 mb-1 text-sm">Cover Image URL</label>
            <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-white/80 mb-1 text-sm">Content</label>
            <button type="button" onClick={() => setShowContentEditor(true)}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10">
              {content ? `${content.substring(0, 50)}...` : 'Click to edit content'}
            </button>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}