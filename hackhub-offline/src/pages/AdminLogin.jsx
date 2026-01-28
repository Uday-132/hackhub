import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, ShieldAlert, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            if (user.role !== 'admin') {
                setError('Unauthorized access. Admin privileges required.');
                return;
            }

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30 flex flex-col relative overflow-hidden">
            {/* Background Red Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="flex justify-between items-center p-8 relative z-10">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-white text-black p-1.5 rounded">
                        <Terminal size={20} strokeWidth={3} />
                    </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 font-bold text-lg tracking-wide">
                    HackHub Admin
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 -mt-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Admin Portal</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/50 text-red-500 text-xs font-bold tracking-widest uppercase">
                        <ShieldAlert size={14} />
                        Admin Access Only
                    </div>
                </div>

                <div className="w-full max-w-md relative group">
                    {/* Top Red Border Gradient */}
                    <div className="absolute -top-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-2xl">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3.5 text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="admin@hackhub.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3.5 text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? 'Authenticating...' : (
                                    <>
                                        Authenticate & Enter
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                                Forgot administrative password?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="mt-12 max-w-md text-center">
                    <p className="text-[10px] leading-relaxed text-gray-600 font-medium tracking-wider uppercase">
                        Authorized personnel only. All access attempts are logged and monitored under system security protocol 88-alpha.
                    </p>
                </div>
            </main>
        </div>
    );
}
