import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, User, Mail, Save, Camera } from 'lucide-react';
import { wp, hp, rf } from '../../utils/responsive';

export default function EditProfile() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [saving, setSaving] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile({ name, avatar });
            navigate('/profile', { state: { nameUpdated: true } });
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05050a] text-white font-sans flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
                <button onClick={() => navigate('/profile')} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <ArrowLeft size={rf(20)} />
                </button>
                <h1 className="font-bold text-lg">Edit Profile</h1>
            </div>

            <div className="flex-1 p-6 max-w-lg mx-auto w-full">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center">
                                    <span className="text-3xl font-bold">{name.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full border-2 border-[#0a0a0a] cursor-pointer hover:bg-purple-500 transition-colors">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm">Change Profile Photo</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#111111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2 font-medium">Email Address</label>
                        <div className="relative opacity-50">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full bg-[#111111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-1">Email cannot be changed</p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-8"
                    >
                        {saving ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
