import { useEffect, useState } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Terminal, Bell, MapPin, Calendar, ChevronDown } from 'lucide-react';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

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

    return (
        <div className="min-h-screen bg-[#05050a] text-white pb-24 font-sans selection:bg-purple-500/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-600 p-2 rounded-lg">
                            <Terminal size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-bold">HackHub.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors relative">
                            <Bell size={20} className="text-gray-400" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-800"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-purple-400 border-2 border-white/10"></div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center gap-2 bg-[#111111] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium hover:border-purple-500/50 transition-colors whitespace-nowrap">
                        <MapPin size={16} className="text-purple-500" />
                        San Francisco
                        <ChevronDown size={14} className="text-gray-500 ml-1" />
                    </button>
                    <button className="flex items-center gap-2 bg-[#111111] border border-white/10 px-4 py-2.5 rounded-xl text-sm font-medium hover:border-purple-500/50 transition-colors whitespace-nowrap">
                        <Calendar size={16} className="text-purple-500" />
                        Any Date
                        <ChevronDown size={14} className="text-gray-500 ml-1" />
                    </button>
                </div>

                {/* Section Header */}
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold">Upcoming Hacks</h2>
                    <button className="text-purple-500 text-sm font-semibold hover:text-purple-400 transition-colors">
                        See all
                    </button>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#111111] h-[400px] rounded-3xl animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-[#111111] rounded-3xl border border-white/5 border-dashed">
                        <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
                        <p className="text-gray-400">Check back later for new offline hackathons.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event._id} event={{ ...event, id: event._id }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <Navbar />
        </div>
    );
}
