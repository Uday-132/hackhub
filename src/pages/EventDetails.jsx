import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, ArrowLeft, Share2, Zap, Rocket, MapPin,
    Users, Clock, Globe, Shield, Activity, Laptop, ChevronRight,
    Terminal, Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEventDetails();
        if (user) checkRegistration();
    }, [id, user]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data);
        } catch (error) {
            console.error('Error fetching event:', error);
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        try {
            const response = await api.get('/registrations');
            const registered = response.data.some(reg => reg.event._id === id || reg.event === id);
            setIsRegistered(registered);
        } catch (error) {
            console.error('Error checking registration:', error);
        }
    };

    const handleRegister = async () => {
        setRegistering(true);
        setError('');
        try {
            await api.post('/registrations', { eventId: id });
            setIsRegistered(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#05050a] flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Terminal size={20} className="text-blue-500" />
                </div>
            </div>
        </div>
    );

    if (!event) return null;

    const eventDate = new Date(event.date);
    const endDate = new Date(eventDate);
    endDate.setDate(endDate.getDate() + 2); // Assuming 48h hackathon

    return (
        <div className="min-h-screen bg-[#030014] text-white font-sans pb-32 selection:bg-purple-500/30 overflow-x-hidden">

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/5 transition-all">
                <button
                    onClick={() => navigate('/events')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group active:scale-95"
                >
                    <ArrowLeft size={20} className="text-gray-300 group-hover:text-white" />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-300">Live Event</span>
                </div>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95">
                    <Share2 size={20} className="text-gray-300 hover:text-white" />
                </button>
            </header>

            {/* Hero Section */}
            <div className="relative pt-24 pb-12 px-6 z-10">
                {/* Tech Badge Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {event.tech_stack?.slice(0, 3).map((tech, i) => (
                        <div key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <Laptop size={10} />
                            {tech}
                        </div>
                    ))}
                    <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <Zap size={10} />
                        High Stakes
                    </div>
                </div>

                <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 drop-shadow-2xl">
                    {event.title}
                </h1>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[#13131f]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                        <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30">
                            <Calendar size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">Start Date</p>
                            <p className="font-bold text-sm text-gray-100">
                                {eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-400">
                                {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} PST
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#13131f]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-start gap-3">
                        <div className="bg-purple-600/20 p-2.5 rounded-xl border border-purple-500/30">
                            <MapPin size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">Location</p>
                            <p className="font-bold text-sm text-gray-100 truncate pr-2">
                                {event.location.split(',')[0]}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                Offline Venue
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-6">
                    {/* About Section */}
                    <div className="bg-[#13131f]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="flex items-center gap-3 mb-4">
                            <Activity size={20} className="text-blue-400" />
                            <h3 className="text-lg font-bold">About the Hack</h3>
                        </div>

                        <p className="text-gray-300 leading-relaxed text-sm">
                            {event.description}
                        </p>

                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Team Size</p>
                                <p className="text-white font-semibold flex items-center gap-2">
                                    <Users size={14} className="text-gray-400" />
                                    1 - 4 Hackers
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
                                <p className="text-white font-semibold flex items-center gap-2">
                                    <Shield size={14} className="text-yellow-500" />
                                    $10,000 USD
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Preview */}
                    <div className="bg-[#13131f]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-purple-400" />
                                <h3 className="text-lg font-bold">Schedule</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Day 1</span>
                        </div>

                        <div className="space-y-6 relative ml-2">
                            <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-white/5 rounded-full" />

                            {[
                                { time: '09:00 AM', title: 'Check-in & Breakfast', icon: Users },
                                { time: '11:00 AM', title: 'Opening Ceremony', icon: Globe },
                                { time: '12:00 PM', title: 'Hacking Begins', icon: Terminal, active: true },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-8 group">
                                    <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 ${item.active ? 'bg-purple-500 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-[#0f0f16] border-gray-600'}`} />
                                    <p className={`text-xs font-bold mb-0.5 ${item.active ? 'text-purple-400' : 'text-gray-500'}`}>{item.time}</p>
                                    <p className={`text-sm font-medium ${item.active ? 'text-white' : 'text-gray-300'}`}>{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#030014] via-[#030014]/95 to-transparent z-50">
                <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-2 pr-2.5 flex items-center gap-4 shadow-2xl shadow-black/50">
                    <div className="pl-6 flex-1">
                        {isRegistered ? (
                            <div>
                                <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-0.5">Status</p>
                                <p className="text-sm font-semibold text-white">You are going!</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Entry Fee</p>
                                <p className="text-sm font-semibold text-white">Free Registration</p>
                            </div>
                        )}
                    </div>

                    {isRegistered ? (
                        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 cursor-default">
                            <Shield size={18} className="fill-green-400" />
                            Registered
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            disabled={registering}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 group"
                        >
                            {registering ? 'Processing...' : (
                                <>
                                    Join Hack
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="text-center mt-4">
                        <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3 py-1 rounded-full">
                            {error}
                        </span>
                    </div>
                )}
            </div>

        </div>
    );
}
