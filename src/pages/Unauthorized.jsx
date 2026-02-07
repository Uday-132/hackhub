import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ChevronLeft, Terminal } from 'lucide-react';

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col relative overflow-hidden">
            {/* Background Red Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="flex justify-between items-center p-6 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold tracking-wide">Security</h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 -mt-20">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative bg-[#0a0a0a] border border-red-900/30 p-8 rounded-full shadow-2xl shadow-red-900/20">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 tracking-tight">Access Denied</h1>

                <p className="text-gray-400 text-center max-w-sm mb-12 leading-relaxed">
                    You do not have permission to view this restricted area. Please log in with an authorized account or return to the dashboard.
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-red-900/30 active:scale-[0.98]"
                    >
                        Back to Login
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-full transition-all active:scale-[0.98]"
                    >
                        Go to Home
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
                    <Terminal size={12} />
                    Hackathons Offline Core
                </div>
            </footer>
        </div>
    );
}
