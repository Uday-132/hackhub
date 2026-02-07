import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event }) {
    const navigate = useNavigate();

    // Random gradient for cover if no image (placeholder logic)
    const gradients = [
        'from-purple-500/20 to-blue-500/20',
        'from-blue-500/20 to-cyan-500/20',
        'from-pink-500/20 to-purple-500/20'
    ];
    const randomGradient = gradients[event.title.length % gradients.length];

    return (
        <div className="bg-[#111111] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
            {/* Cover Image Area */}
            <div className={`h-48 bg-gradient-to-br ${randomGradient} relative p-6 flex flex-col justify-end`}>
                {/* "Most Popular" Badge - Mock logic */}
                <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-purple-900/40">
                    Most Popular
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {event.tech_stack?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="bg-black/40 backdrop-blur-md text-white/90 text-xs px-3 py-1 rounded-lg border border-white/10">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {/* Organizer Label */}
                <div className="text-purple-500 text-xs font-bold tracking-widest uppercase mb-2">
                    Innovation Labs
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-purple-400 transition-colors">
                    {event.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-purple-500" />
                        {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="border border-white/10 hover:bg-white/5 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-900/20"
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
}
