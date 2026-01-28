import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, ArrowLeft, Share2, Zap, Rocket, MapPin } from 'lucide-react';

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
        if (user) {
            checkRegistration();
        }
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

    if (loading) return <div className="min-h-screen bg-[#05050a] flex items-center justify-center text-white">Loading...</div>;
    if (!event) return null;

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans pb-24 relative">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={() => navigate('/events')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold">Event Details</h1>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Share2 size={24} />
                </button>
            </header>

            {/* Hero Image */}
            <div className="h-[400px] w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05050a]/20 to-[#05050a]"></div>
                <img
                    src="https://images.unsplash.com/photo-1504384308090-c54be3852f33?q=80&w=2070&auto=format&fit=crop"
                    alt="Event Cover"
                    className="w-full h-full object-cover -z-10 opacity-80"
                />
            </div>

            {/* Content */}
            <div className="px-6 -mt-20 relative z-10">
                <h1 className="text-4xl font-bold mb-4 leading-tight">{event.title}</h1>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#2a1b4e] text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-purple-500/20">
                    <Zap size={14} className="fill-purple-300" />
                    High Stakes
                </div>

                {/* Date Card */}
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-8">
                    <div className="bg-purple-600 p-3 rounded-xl">
                        <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(new Date(event.date).setDate(new Date(event.date).getDate() + 2)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Starts at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} PST
                        </p>
                    </div>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                    <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {event.tech_stack?.map((tech, index) => (
                            <span key={index} className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-xl text-sm font-medium text-gray-300">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-2">About</h3>
                    <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>

                {/* Location */}
                <div className="mb-8">
                    <h3 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={18} className="text-purple-500" />
                        {event.location}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 p-6 z-50">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-4 text-xs font-bold tracking-wider">
                        <div>
                            <p className="text-gray-500 uppercase mb-1">Participation</p>
                            <p className="text-purple-400 italic">Only 12 spots remaining!</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 uppercase mb-1">Entry Fee</p>
                            <p className="text-white">Free for Students</p>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center mb-2">{error}</div>
                    )}

                    {isRegistered ? (
                        <button disabled className="w-full bg-green-600/20 text-green-400 border border-green-500/30 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 cursor-default">
                            Registered Successfully
                        </button>
                    ) : (
                        <button
                            onClick={handleRegister}
                            disabled={registering}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all active:scale-[0.98]"
                        >
                            {registering ? 'Registering...' : 'Register Now'}
                            <Rocket size={20} className="fill-white" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
