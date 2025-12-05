import { useEffect, useState } from 'react';
import { booksAPI } from '../services/api';

export function BookReaderModal({ book, onClose }) {
    const [fontSize, setFontSize] = useState(18);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [content, setContent] = useState(book.content || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // Fetch full content from API
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const data = await booksAPI.getContent(book.id);
                if (data.content) {
                    setContent(data.content);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                // Keep the existing content if fetch fails
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [book.id]);

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950">
            {/* Reader Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{book.title}</h1>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>by {book.author}</p>
                    </div>
                </div>

                {/* Reading Controls */}
                <div className="flex items-center gap-3">
                    {/* Font Size Controls */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <button
                            onClick={decreaseFontSize}
                            className={`px-2 py-1 rounded text-lg font-bold ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
                        >
                            A-
                        </button>
                        <span className={`text-sm min-w-[40px] text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{fontSize}px</span>
                        <button
                            onClick={increaseFontSize}
                            className={`px-2 py-1 rounded text-lg font-bold ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-200 text-gray-800'}`}
                        >
                            A+
                        </button>
                    </div>

                    {/* Dark/Light Mode Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Reader Content */}
            <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-amber-50'}`}>
                <div className="max-w-3xl mx-auto px-8 py-12">
                    {/* Book Title & Author */}
                    <div className="text-center mb-12 pb-8 border-b border-dashed" style={{ borderColor: isDarkMode ? '#475569' : '#d4a574' }}>
                        <h2 className={`text-4xl font-serif font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{book.title}</h2>
                        <p className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>by {book.author}</p>
                        <div className={`flex justify-center gap-4 mt-4 text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                            <span>📅 {book.year}</span>
                            <span>📚 {book.genre}</span>
                            {book.rating && <span>⭐ {book.rating}/5</span>}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Loading book content...</p>
                        </div>
                    ) : content ? (
                        /* Book Content */
                        <div
                            className={`prose max-w-none leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-800'}`}
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                        >
                            {content.split('\n').map((paragraph, index) => (
                                paragraph.trim() ? (
                                    <p key={index} className="mb-6 text-justify">
                                        {paragraph}
                                    </p>
                                ) : null
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-20 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                            <div className="text-6xl mb-6">📖</div>
                            <h3 className="text-2xl font-medium mb-2">No Content Available</h3>
                            <p className="text-lg">This book doesn't have any content yet.</p>
                            <p className="mt-4">You can add content by editing the book.</p>
                        </div>
                    )}

                    {/* End of Book Marker */}
                    {content && !loading && (
                        <div className="text-center mt-16 pt-8 border-t border-dashed" style={{ borderColor: isDarkMode ? '#475569' : '#d4a574' }}>
                            <div className={`text-3xl mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`}>— THE END —</div>
                            <button
                                onClick={onClose}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${isDarkMode
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                                    }`}
                            >
                                Back to Library
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
