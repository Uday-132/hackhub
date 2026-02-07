import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import { Plus, Trash2, Calendar, MapPin, Edit2, Terminal, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await api.delete(`/events/${deleteId}`);
            setEvents(events.filter(event => event._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            alert('Error deleting event: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white pb-24 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Terminal size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-300">Hackathons Admin</span>
                    </div>
                    <button
                        onClick={() => navigate('/admin/add-event')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={16} /> Add Event
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Managed Events</h2>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{events.length} Total</span>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#111111] h-24 rounded-2xl animate-pulse border border-white/5"></div>
                        ))
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 bg-[#111111] rounded-2xl border border-white/5 border-dashed">
                            <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
                            <p className="text-gray-400">Create your first event to get started.</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event._id} className="bg-[#111111] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{event.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(event.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {event.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(event._id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#15151a] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete this event? This action cannot be undone and all data will be lost.
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={handleDelete}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Delete Event
                                </button>
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="w-full bg-[#2a2a30] hover:bg-[#3a3a40] text-white font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <AdminNavbar />
        </div>
    );
}
