import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import { Users, Calendar, Trophy, TrendingUp } from 'lucide-react';

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#05050a] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#05050a] text-white pb-24 font-sans">
            <header className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <h1 className="text-xl font-bold">Platform Analytics</h1>
            </header>

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#111111] p-5 rounded-2xl border border-white/5">
                        <div className="bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-500">
                            <Users size={20} />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</h3>
                        <p className="text-gray-500 text-sm">Total Users</p>
                    </div>

                    <div className="bg-[#111111] p-5 rounded-2xl border border-white/5">
                        <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-purple-500">
                            <Calendar size={20} />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.totalEvents || 0}</h3>
                        <p className="text-gray-500 text-sm">Total Events</p>
                    </div>

                    <div className="bg-[#111111] p-5 rounded-2xl border border-white/5">
                        <div className="bg-green-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-green-500">
                            <Trophy size={20} />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{stats?.totalRegistrations || 0}</h3>
                        <p className="text-gray-500 text-sm">Registrations</p>
                    </div>

                    <div className="bg-[#111111] p-5 rounded-2xl border border-white/5">
                        <div className="bg-orange-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-orange-500">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">Active</h3>
                        <p className="text-gray-500 text-sm">Platform Status</p>
                    </div>
                </div>

                {/* Recent Users */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Newest Members</h2>
                    <div className="space-y-3">
                        {stats?.recentUsers?.map((user) => (
                            <div key={user._id} className="bg-[#111111] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AdminNavbar />
        </div>
    );
}
