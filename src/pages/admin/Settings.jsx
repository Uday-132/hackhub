import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from '../../components/AdminNavbar';
import { User, LogOut, Moon, Bell, Shield } from 'lucide-react';

export default function AdminSettings() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white pb-24 font-sans">
            <header className="sticky top-0 z-40 bg-[#05050a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
                <h1 className="text-xl font-bold">Settings</h1>
            </header>

            <div className="p-6 max-w-md mx-auto space-y-6">

                {/* Profile Card */}
                <div className="bg-[#111111] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] mb-4">
                        <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <h2 className="text-lg font-bold">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">Administrator</p>
                </div>

                {/* Settings List */}
                <div className="space-y-2">
                    <button className="w-full bg-[#111111] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
                        <User size={20} className="text-blue-500" />
                        <span className="flex-1 text-left">Edit Profile</span>
                    </button>
                    <button className="w-full bg-[#111111] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
                        <Bell size={20} className="text-yellow-500" />
                        <span className="flex-1 text-left">Notifications</span>
                    </button>
                    <button className="w-full bg-[#111111] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all">
                        <Shield size={20} className="text-green-500" />
                        <span className="flex-1 text-left">Security</span>
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 font-bold hover:bg-red-500/20 transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <AdminNavbar />
        </div>
    );
}
