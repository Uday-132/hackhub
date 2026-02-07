import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Mail, LogOut, Award, Calendar, ChevronRight, Shield, Bell, Lock, Settings, Zap } from 'lucide-react';
import { wp, hp, rf } from '../utils/responsive';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [bliinkName, setBlinkName] = useState(false);

    useEffect(() => {
        if (location.state?.nameUpdated) {
            setBlinkName(true);
            const timer = setTimeout(() => setBlinkName(false), 3000); // Blink for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans pb-24 selection:bg-purple-500/30 flex flex-col">

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Container */}
            <div
                className="relative z-10 w-full flex-1 flex flex-col"
                style={{ padding: wp(6) }}
            >
                {/* Profile Header Card */}
                <div style={{ paddingTop: hp(4), paddingBottom: hp(3) }}>
                    <div
                        className="bg-[#111111] border border-white/5 flex flex-col items-center relative overflow-hidden group"
                        style={{
                            borderRadius: wp(10),
                            padding: wp(8)
                        }}
                    >

                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="relative mb-6">
                            <div className="bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-500 rounded-full p-[2px] shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                                style={{ width: wp(28), height: wp(28) }}
                            >
                                <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center relative overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="font-black bg-clip-text text-transparent bg-gradient-to-tr from-purple-500 to-blue-500"
                                            style={{ fontSize: rf(40) }}
                                        >
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1
                            className={`font-bold mb-1 text-center text-white ${bliinkName ? 'animate-blink' : ''}`}
                            style={{ fontSize: rf(24) }}
                        >
                            {user.name}
                        </h1>

                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full mt-2">
                            <Zap size={rf(12)} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-bold tracking-widest uppercase text-gray-300" style={{ fontSize: rf(10) }}>Level 1 Hacker</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#111111] border border-white/5 rounded-3xl flex flex-col items-center gap-3" style={{ padding: wp(5) }}>
                        <div className="bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20" style={{ padding: wp(3) }}>
                            <Calendar size={rf(24)} />
                        </div>
                        <div className="text-center">
                            <span className="font-black text-white block leading-none mb-1" style={{ fontSize: rf(24) }}>0</span>
                            <span className="font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: rf(10) }}>Events</span>
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-white/5 rounded-3xl flex flex-col items-center gap-3" style={{ padding: wp(5) }}>
                        <div className="bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20" style={{ padding: wp(3) }}>
                            <Award size={rf(24)} />
                        </div>
                        <div className="text-center">
                            <span className="font-black text-white block leading-none mb-1" style={{ fontSize: rf(24) }}>0</span>
                            <span className="font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: rf(10) }}>Wins</span>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-500 uppercase tracking-widest px-4 mb-3" style={{ fontSize: rf(12) }}>Settings</h3>
                        <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden">
                            {[
                                { icon: User, label: 'Edit Profile', color: 'text-blue-400', path: '/settings/edit-profile' },
                                { icon: Bell, label: 'Notifications', color: 'text-yellow-400', path: '/settings/notifications' },
                                { icon: Shield, label: 'Privacy & Security', color: 'text-green-400', path: '/settings/privacy' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(item.path)}
                                    className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                                        <item.icon size={rf(18)} />
                                    </div>
                                    <span className="font-medium text-gray-200 flex-1 text-left" style={{ fontSize: rf(14) }}>{item.label}</span>
                                    <ChevronRight size={rf(16)} className="text-gray-600" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#1a0505] border border-red-500/20 text-red-500 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-red-500/10 active:scale-[0.98] transition-all"
                        style={{ padding: wp(5), fontSize: rf(16) }}
                    >
                        <LogOut size={rf(20)} />
                        Log Out
                    </button>

                    <div className="text-center pt-4 opacity-50">
                        <p className="font-bold tracking-widest uppercase text-gray-600" style={{ fontSize: rf(10) }}>
                            HackHub v1.0.0
                        </p>
                    </div>
                </div>

            </div>

            <Navbar />
        </div>
    );
}
