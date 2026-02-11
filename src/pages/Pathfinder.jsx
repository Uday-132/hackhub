import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
    ArrowLeft, Search, Sprout, TreePine, Mountain, Clock, Sparkles, ChevronDown,
    ArrowRight, ChevronLeft, MoreHorizontal, Lock, Check, PlayCircle, BookOpen,
    Code, Calendar, ExternalLink, Loader
} from 'lucide-react';

// Mini internal components for icons
const BrainIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
)
const ListIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
)
const BookIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
)

export default function Pathfinder() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [expandedMonth, setExpandedMonth] = useState(1);

    // Goal Input State
    const [step, setStep] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userGoal, setUserGoal] = useState({
        careerGoal: '',
        skillLevel: 'Beginner',
        targetOutcome: '',
        availability: 5
    });

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const res = await api.get('/pathfinder');
            if (res.data.length > 0) {
                setRoadmap(res.data[0]); // Show most recent
            }
        } catch (err) {
            console.error('Error fetching roadmaps:', err);
        }
    };

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
        else handleGenerate();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate('/'); // Go home if at step 1
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Updated to match your backend route
            const res = await api.post('/pathfinder/generate', userGoal);
            setRoadmap(res.data);
            setExpandedMonth(1);
        } catch (err) {
            console.error(err);
            alert('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMonth = (id) => {
        setExpandedMonth(expandedMonth === id ? null : id);
    };

    const toggleTopicCompletion = async (roadmapId, topicId) => {
        try {
            // Optimistic UI update
            const updatedRoadmap = { ...roadmap };
            let topicFound = false;

            for (let month of updatedRoadmap.months) {
                const topic = month.topics.find(t => t.id === topicId);
                if (topic) {
                    topic.completed = !topic.completed;
                    topicFound = true;
                    break;
                }
            }
            if (topicFound) setRoadmap(updatedRoadmap);

            // API Call
            await api.put(`/pathfinder/${roadmapId}/topic/${topicId}`);
        } catch (error) {
            console.error('Error toggling topic:', error);
            // Revert on error would go here
        }
    };

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Crafting Your Journey...
                </h3>
                <p className="text-slate-500 mt-2 max-w-sm text-center">
                    Analyzing thousands of resources to build your perfect curriculum. This may take a minute.
                </p>
            </div>
        );
    }

    // --- ROADMAP SCREEN (If Roadmap Exists) ---
    if (roadmap) {
        let totalTopics = 0;
        let completedTopics = 0;
        if (roadmap && roadmap.months) {
            roadmap.months.forEach(month => {
                if (month.topics) {
                    totalTopics += month.topics.length;
                    completedTopics += month.topics.filter(t => t.completed).length;
                }
            });
        }
        const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        return (
            <div className="flex flex-col h-screen bg-[#FAFBFF] font-sans pb-20"> {/* pb-20 for global navbar */}
                {/* Header */}
                <div className="p-6 pb-2 flex items-center justify-between sticky top-0 bg-[#FAFBFF] z-10">
                    <button onClick={() => setRoadmap(null)} className="p-2 -ml-2 bg-white shadow-sm border border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
                        <ChevronLeft size={24} className="text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">{roadmap.goal}</h1>
                    <button className="p-2 -mr-2 bg-white shadow-sm border border-slate-100 rounded-full hover:bg-slate-50 transition-colors">
                        <MoreHorizontal size={24} className="text-slate-700" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
                    {/* Overall Progress Card */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Path Progress</p>
                                <h2 className="text-xl font-bold text-slate-900">{overallProgress}% Completed</h2>
                            </div>
                            <span className="text-xs font-bold text-blue-500 mb-1">{roadmap.months.length} Months</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                    </div>

                    {/* Month Cards */}
                    <div className="space-y-4">
                        {roadmap.months.map((month) => {
                            const isExpanded = expandedMonth === month.id;
                            const isLocked = month.status === 'locked';

                            return (
                                <div key={month.id} className={`bg-white rounded-3xl transition-all duration-300 ${isExpanded ? 'shadow-lg border-blue-100 border' : 'shadow-sm border border-slate-100'}`}>
                                    {/* Card Header */}
                                    <button
                                        onClick={() => !isLocked && toggleMonth(month.id)}
                                        disabled={isLocked}
                                        className="w-full flex items-center p-5 text-left"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${isLocked ? 'bg-slate-50 border border-slate-200' : 'bg-white border-2 border-blue-100'}`}>
                                            {isLocked ? (
                                                <span className="text-[10px] font-bold text-slate-400 italic">Locked</span>
                                            ) : (
                                                <Calendar size={20} className="text-slate-400" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{month.title}</h3>
                                            <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>{month.subtitle}</p>
                                        </div>

                                        {isLocked ? <Lock size={20} className="text-slate-300" /> : <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown size={20} className="text-slate-400" /></div>}
                                    </button>

                                    {/* Expanded Content */}
                                    {isExpanded && !isLocked && (
                                        <div className="px-5 pb-6 pt-0 animate-fade-in-down">
                                            <hr className="border-slate-50 my-4" />
                                            <div className="mb-6"><p className="text-sm text-slate-600 leading-relaxed">{month.description}</p></div>

                                            {/* Skills */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-blue-500 p-1 rounded-full"><BrainIcon /></div>
                                                    <h4 className="font-bold text-sm text-slate-900">Skills to Learn</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {month.skills.map(skill => (
                                                        <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1.5"><Code size={12} />{skill}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Topics */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-blue-500 p-1 rounded-full"><ListIcon /></div>
                                                    <h4 className="font-bold text-sm text-slate-900">Topics Covered</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {month.topics.map(topic => {
                                                        const isChecked = topic.completed;
                                                        return (
                                                            <div key={topic.id} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors" onClick={() => toggleTopicCompletion(roadmap._id, topic.id)}>
                                                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-200 group-hover:border-blue-300'}`}>
                                                                    {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                                                                </div>
                                                                <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-600'}`}>{topic.title}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="bg-blue-500 p-1 rounded-full"><BookIcon /></div>
                                                <h4 className="font-bold text-sm text-slate-900">Learning Resources</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {month.resources.map((res, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group cursor-pointer" onClick={() => window.open(res.url, '_blank')}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${res.type === 'Video' ? 'bg-red-100 text-red-500' : res.type === 'Interactive' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'}`}>
                                                                {res.type === 'Video' ? <PlayCircle size={20} fill="currentColor" className="text-red-500/20" /> : res.type === 'Interactive' ? <Code size={20} /> : <BookOpen size={20} />}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-sm font-bold text-slate-800 line-clamp-1">{res.title}</h5>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-white px-1.5 rounded">{res.type}</span>
                                                                    <span className="text-[10px] font-medium text-slate-400">• {res.duration}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Navbar />
            </div>
        );
    }

    // --- GOAL INPUT SCREEN (Wizard) ---
    const roles = ["Software Engineer", "Data Scientist", "Product Manager", "UI/UX Designer", "Digital Marketer"];
    const skillLevels = [
        { label: "Beginner", icon: Sprout, value: "Beginner", color: "text-green-500", bg: "bg-green-50" },
        { label: "Intermediate", icon: TreePine, value: "Intermediate", color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Advanced", icon: Mountain, value: "Advanced", color: "text-indigo-500", bg: "bg-indigo-50" }
    ];
    const progress = (step / 4) * 100;

    return (
        <div className="flex flex-col h-screen bg-white font-sans pb-20"> {/* pb-20 for navbar */}
            {/* Header */}
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-900" />
                    </button>
                    <span className="font-bold text-lg text-slate-900">PathPilot</span>
                    <div className="w-8" />
                </div>
                {/* Progress Strip */}
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-slate-900">Building your profile</span>
                    <span className="text-xs font-medium text-slate-500">Step {step} of 4</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden transition-all duration-500">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Let's map your future</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">Tell us where you want to go, and PathPilot will handle the rest.</p>
                </div>

                <div className="transition-all duration-300">
                    {/* Step 1: Career Goal */}
                    {step === 1 && (
                        <section className="animate-fade-in-up">
                            <h3 className="font-bold text-slate-900 mb-3 block">STEP 1: Choose Career Goal</h3>
                            <div className="relative">
                                <div className="flex items-center gap-3 w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-slate-200 transition-colors" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <Search size={20} className="text-blue-500" />
                                    <span className={`flex-1 font-medium ${userGoal.careerGoal ? 'text-slate-900' : 'text-slate-400'}`}>{userGoal.careerGoal || "Select a role"}</span>
                                    <ChevronDown size={20} className="text-slate-400" />
                                </div>
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-fade-in-down">
                                        {roles.map(role => (
                                            <div key={role} onClick={() => { setUserGoal({ ...userGoal, careerGoal: role }); setIsDropdownOpen(false); }} className="p-4 hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-slate-600 font-medium transition-colors border-b border-slate-50 last:border-0">{role}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Step 2: Skill Level */}
                    {step === 2 && (
                        <section className="animate-fade-in-up">
                            <h3 className="font-bold text-slate-900 mb-3 block">STEP 2: Select Current Skill Level</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {skillLevels.map((level) => {
                                    const isSelected = userGoal.skillLevel === level.value;
                                    return (
                                        <button key={level.value} onClick={() => setUserGoal({ ...userGoal, skillLevel: level.value })} className={`flex-1 min-w-[100px] aspect-square rounded-full flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 ${isSelected ? 'border-blue-500 bg-white shadow-lg shadow-blue-100 scale-105' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                                            <level.icon size={28} className={isSelected ? 'text-blue-500' : 'text-slate-400'} strokeWidth={isSelected ? 2.5 : 2} />
                                            <span className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>{level.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Step 3: Availability */}
                    {step === 3 && (
                        <section className="animate-fade-in-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">STEP 3: Weekly Time Availability</h3>
                                <div className="px-3 py-1 bg-blue-50 rounded-lg flex items-center gap-1.5"><Clock size={14} className="text-blue-600" /><span className="text-xs font-bold text-blue-600">{userGoal.availability} hrs</span></div>
                            </div>
                            <div className="px-2 py-4 bg-slate-50 rounded-3xl border border-slate-100">
                                <input type="range" min="2" max="40" step="1" value={userGoal.availability} onChange={(e) => setUserGoal({ ...userGoal, availability: e.target.value })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                <div className="flex justify-between mt-3 px-1.5"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Casual (2h)</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Time (40h)</span></div>
                            </div>
                        </section>
                    )}

                    {/* Step 4: Target Outcome */}
                    {step === 4 && (
                        <section className="animate-fade-in-up">
                            <h3 className="font-bold text-slate-900 mb-3 block">STEP 4: Target Outcomes</h3>
                            <div className="space-y-3">
                                {['Internship ready', 'Job ready', 'Skill upgrade'].map((outcome) => (
                                    <div key={outcome} onClick={() => setUserGoal({ ...userGoal, targetOutcome: outcome })} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${userGoal.targetOutcome === outcome ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-100'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${userGoal.targetOutcome === outcome ? 'border-blue-500' : 'border-slate-300'}`}>
                                            {userGoal.targetOutcome === outcome && (<div className="w-2.5 h-2.5 rounded-full bg-blue-500" />)}
                                        </div>
                                        <span className={`font-medium ${userGoal.targetOutcome === outcome ? 'text-blue-700' : 'text-slate-600'}`}>{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white border-t border-slate-50 sticky bottom-0 z-10 bottom-[theme(spacing.20)]"> {/* Adjusted bottom for navbar */}
                <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-full shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    {step < 4 ? (<><span>Next Step</span><ArrowRight size={20} /></>) : loading ? <Loader className="animate-spin" size={20} /> : (<><span>Generate My Roadmap</span><Sparkles size={20} fill="currentColor" className="text-blue-300" /></>)}
                </button>
            </div>
            <Navbar />
        </div>
    );
}
