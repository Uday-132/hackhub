import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, MoreHorizontal, MapPin, Calendar, Clock } from 'lucide-react';

export default function AddEvent() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: 'Global AI Innovation Summit',
        description: 'Join the brightest minds for a 48-hour sprint building the next generation of AI-driven tools. $50k in prizes.',
        location: 'Innovation Center, San Francisco, CA',
        date: '2024-10-24',
        time: '09:00',
        tech_stack: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const techStackArray = formData.tech_stack
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech.length > 0);

            await api.post('/events', {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                date: dateTime.toISOString(),
                tech_stack: techStackArray
            });

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-lg font-bold">Edit Event</h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <MoreHorizontal size={24} />
                </button>
            </header>

            <div className="max-w-2xl mx-auto p-6 pb-24">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Event Details</h2>
                    <p className="text-gray-500 text-sm">Update the information for your hackathon event.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Title */}
                    <div className="border border-gray-200 rounded-3xl p-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full text-lg font-medium text-gray-900 outline-none placeholder-gray-400"
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="border border-gray-200 rounded-3xl p-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full text-gray-600 leading-relaxed outline-none resize-none placeholder-gray-400"
                            placeholder="Enter event description"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="border border-gray-200 rounded-3xl p-4 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full text-gray-900 font-medium outline-none placeholder-gray-400"
                                placeholder="Enter location"
                                required
                            />
                        </div>
                        <MapPin className="text-gray-400 ml-2" size={20} />
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-3xl p-4 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full text-gray-900 font-medium outline-none"
                                    required
                                />
                            </div>
                            <Calendar className="text-gray-400 ml-2" size={20} />
                        </div>

                        <div className="border border-gray-200 rounded-3xl p-4 flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full text-gray-900 font-medium outline-none"
                                    required
                                />
                            </div>
                            <Clock className="text-gray-400 ml-2" size={20} />
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="border border-gray-200 rounded-3xl p-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Tech Stack</label>
                        <input
                            type="text"
                            name="tech_stack"
                            value={formData.tech_stack}
                            onChange={handleChange}
                            className="w-full text-gray-900 font-medium outline-none placeholder-gray-400"
                            placeholder="React, Node.js, Python..."
                        />
                    </div>

                    {/* Save Button */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                        <div className="max-w-2xl mx-auto">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1041b2] hover:bg-blue-800 text-white font-bold py-4 rounded-full shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? 'Saving Event...' : 'Save Event'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
