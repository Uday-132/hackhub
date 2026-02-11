import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import { Search, Mail, Calendar, MoreVertical, Shield } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#05050a] text-white pb-24 font-sans">
            <header className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <h1 className="text-xl font-bold">User Management</h1>
            </header>

            <div className="p-6 max-w-4xl mx-auto">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Users List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No users found</div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user._id} className="bg-[#111111] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{user.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Mail size={12} /> {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {user.role}
                                    </span>
                                    <div className="text-gray-500 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AdminNavbar />
        </div>
    );
}
