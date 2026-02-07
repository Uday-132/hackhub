import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Key, Trash2, Smartphone } from 'lucide-react';
import { wp, hp, rf } from '../../utils/responsive';

export default function PrivacySecurity() {
    const navigate = useNavigate();
    const [twoFactor, setTwoFactor] = useState(false);

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
                <h1 className="font-bold text-lg">Privacy & Security</h1>
            </div>

            <div className="p-6 max-w-lg mx-auto w-full space-y-8">

                {/* Security */}
                <div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Security</h2>
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Change Password</p>
                                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                                </div>
                            </div>
                        </button>

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Two-Factor Auth</p>
                                    <p className="text-xs text-gray-500">Secure your account</p>
                                </div>
                            </div>
                            <Toggle active={twoFactor} onClick={() => setTwoFactor(!twoFactor)} />
                        </div>
                    </div>
                </div>

                {/* Data */}
                <div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Data & Privacy</h2>
                    <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400">
                                    <Shield size={20} />
                                </div>
                                <span className="font-medium">Privacy Policy</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <h2 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4">Danger Zone</h2>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden">
                        <button className="w-full p-4 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left text-red-500">
                            <Trash2 size={20} />
                            <span className="font-medium">Delete Account</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
