import PropTypes from 'prop-types';
import { BookOpen, Plus, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';

export function Header({ user, onLogout, onAddBook, showDashboard, onToggleDashboard }) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">Book Library Pro</h1>
              <p className="text-slate-400">Your Digital Reading Companion</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {onToggleDashboard && (
              <button
                onClick={onToggleDashboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  showDashboard
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
            )}

            <button
              onClick={onAddBook}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-violet-700 transition shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
              <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">
                <UserCircle className="w-6 h-6 text-blue-400" />
                <span className="text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition px-3 py-2 rounded-xl hover:bg-slate-800"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onAddBook: PropTypes.func.isRequired,
  showDashboard: PropTypes.bool,
  onToggleDashboard: PropTypes.func
};
