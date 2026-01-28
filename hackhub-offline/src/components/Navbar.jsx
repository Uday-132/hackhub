import { Compass, Search, Ticket, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/5 px-6 py-4 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <button
                    onClick={() => navigate('/events')}
                    className={`flex flex-col items-center gap-1 ${isActive('/events') ? 'text-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Compass size={24} />
                    <span className="text-[10px] font-medium">EXPLORE</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
                    <Search size={24} />
                    <span className="text-[10px] font-medium">SEARCH</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
                    <Ticket size={24} />
                    <span className="text-[10px] font-medium">TICKETS</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
                    <User size={24} />
                    <span className="text-[10px] font-medium">PROFILE</span>
                </button>
            </div>
        </div>
    );
}
