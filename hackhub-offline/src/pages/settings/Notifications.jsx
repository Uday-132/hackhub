import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, Smartphone } from 'lucide-react';
import { wp, hp, rf } from '../../utils/responsive';

export default function Notifications() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        push: true,
        email: true,
        reminders: false,
        marketing: false
    });

    const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

    const Toggle = ({ active, onClick }) => (
        <button
            onClick={onClick}
            className={`w-12 h-7 rounded-full transition-colors relative ${active ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col">
            <div className="flex items-center gap-4 px-6 py-4 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
                <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <ArrowLeft size={rf(20)} />
                </button>
                <h1 className="font-bold text-lg">Notifications</h1>
            </div>

            <div className="p-6 max-w-lg mx-auto w-full space-y-8">

                {/* Push Notifications */}
                <div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Push Notifications</h2>
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">General Alerts</p>
                                    <p className="text-xs text-gray-500">System updates and announcements</p>
                                </div>
                            </div>
                            <Toggle active={settings.push} onClick={() => toggle('push')} />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Event Reminders</p>
                                    <p className="text-xs text-gray-500">1 hour before events start</p>
                                </div>
                            </div>
                            <Toggle active={settings.reminders} onClick={() => toggle('reminders')} />
                        </div>
                    </div>
                </div>

                {/* Email Notifications */}
                <div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Email</h2>
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Email Digest</p>
                                    <p className="text-xs text-gray-500">Weekly summary of hackathons</p>
                                </div>
                            </div>
                            <Toggle active={settings.email} onClick={() => toggle('email')} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
