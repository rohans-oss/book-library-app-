import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

export function UserList({ onClose }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await usersAPI.getAll();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-3xl">👥</span> Registered Users
                </h2>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white"
                >
                    ← Back to Library
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-400 text-center py-10">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-white/60">{user.email}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {user.role === 'admin' ? '🔐 Admin' : '👤 User'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-white/40 text-sm text-center">
                        Total: {users.length} users ({users.filter(u => u.role === 'admin').length} admin, {users.filter(u => u.role !== 'admin').length} regular users)
                    </div>
                </div>
            )}
        </div>
    );
}
