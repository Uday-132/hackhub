import { useNavigate } from 'react-router-dom';
import { Terminal, Info, Share2, Shield, User } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#05050a] text-white flex flex-col relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

            {/* Header */}
            <header className="flex justify-between items-center p-6 relative z-10">
                <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50 backdrop-blur-sm">
                    <Terminal size={24} className="text-gray-300" />
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <Info size={24} />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 -mt-10">
                {/* Center Logo */}
                <div className="mb-8 relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                    <div className="relative bg-gray-800/80 p-6 rounded-full border border-gray-700 backdrop-blur-md">
                        <Share2 size={48} className="text-blue-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center tracking-tight">
                    HackHub <span className="text-blue-500">Offline</span>
                </h1>

                {/* Tagline */}
                <p className="text-gray-400 text-lg md:text-xl text-center max-w-xl mb-12 leading-relaxed">
                    The ultimate platform to discover and join real-world hackathons in your city.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-md">
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-3 border border-white/10"
                    >
                        Login as Admin
                        <Shield size={20} className="opacity-80 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="group relative w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-3 border border-white/10"
                    >
                        Login as User
                        <User size={20} className="opacity-80 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 relative z-10 flex flex-col items-center gap-6">
                {/* Avatars */}
                <div className="flex items-center -space-x-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#05050a] bg-gray-700 overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#05050a] bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        +10k
                    </div>
                </div>

                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
                    Join the hacker revolution today
                </p>
            </footer>
        </div>
    );
}
