import { Home, Users, BarChart2, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/5 px-6 py-4 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className={`flex flex-col items-center gap-1 ${isActive('/admin/dashboard') ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Home size={24} />
                    <span className="text-[10px] font-medium">HOME</span>
                </button>

                <button
                    onClick={() => navigate('/admin/users')}
                    className={`flex flex-col items-center gap-1 ${isActive('/admin/users') ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Users size={24} />
                    <span className="text-[10px] font-medium">USERS</span>
                </button>

                <button
                    onClick={() => navigate('/admin/stats')}
                    className={`flex flex-col items-center gap-1 ${isActive('/admin/stats') ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <BarChart2 size={24} />
                    <span className="text-[10px] font-medium">STATS</span>
                </button>

                <button
                    onClick={() => navigate('/admin/settings')}
                    className={`flex flex-col items-center gap-1 ${isActive('/admin/settings') ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Settings size={24} />
                    <span className="text-[10px] font-medium">SETTINGS</span>
                </button>
            </div>
        </div>
    );
}
