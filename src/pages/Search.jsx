import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Filter, Terminal, MapPin, Calendar, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Search() {
    const [query, setQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const navigate = useNavigate();

    // Fetch all events on mount
    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events when query or activeFilter changes
    useEffect(() => {
        if (!events.length) return;

        let results = events;

        // Apply Text Search
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(event =>
                event.title.toLowerCase().includes(lowerQuery) ||
                event.description.toLowerCase().includes(lowerQuery) ||
                event.location.toLowerCase().includes(lowerQuery) ||
                event.tech_stack?.some(tech => tech.toLowerCase().includes(lowerQuery))
            );
        }

        // Apply Category Filters
        if (activeFilter !== 'All') {
            if (activeFilter === 'Upcoming') {
                const now = new Date();
                results = results.filter(event => new Date(event.date) > now);
            }
            // Add more specific filters here if your data supports it
        }

        setFilteredEvents(results);
    }, [query, events, activeFilter]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data || []);
            setFilteredEvents(response.data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filters = ['All', 'Upcoming', 'Design', 'AI', 'Web3'];

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans pb-24 selection:bg-purple-500/30">
            {/* Header / Search Bar */}
            <div className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-xl border-b border-white/5 px-4 pt-6 pb-4">
                <h1 className="text-2xl font-bold mb-4">Discover Hacks</h1>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon size={20} className="text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search events, locations, tech..."
                        className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none transition-all shadow-lg shadow-black/50"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    <div className="p-2 bg-[#111111] border border-white/10 rounded-xl">
                        <Filter size={18} className="text-purple-500" />
                    </div>
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${activeFilter === filter
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20'
                                : 'bg-[#111111] border-white/10 text-gray-400 hover:border-white/20'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4">
                {loading ? (
                    <div className="flex flex-col gap-4 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-[#111111] rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <SearchIcon size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300 mb-2">No results found</h3>
                        <p className="text-gray-500 max-w-xs">
                            We couldn't find any hackathons matching "{query}". Try a different keyword.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">
                            {filteredEvents.length} Results Found
                        </p>
                        {filteredEvents.map(event => (
                            <div
                                key={event._id}
                                onClick={() => navigate(`/events/${event._id}`)}
                                className="bg-[#111111] border border-white/5 rounded-2xl p-4 active:scale-[0.98] transition-all cursor-pointer group hover:border-purple-500/30"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-purple-500/10 p-2 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Terminal size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg">
                                        <Calendar size={12} />
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} className="text-gray-500" />
                                        {event.location}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                    <div className="flex gap-2">
                                        {event.tech_stack?.slice(0, 2).map((tech, i) => (
                                            <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-400 border border-white/5">
                                                {tech}
                                            </span>
                                        ))}
                                        {event.tech_stack?.length > 2 && (
                                            <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-400 border border-white/5">
                                                +{event.tech_stack.length - 2}
                                            </span>
                                        )}
                                    </div>
                                    <ArrowRight size={16} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Navbar />
        </div>
    );
}
