import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#07111F]"
        >
            {/* Ambient Floating Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -60, 0],
                    y: [0, 60, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
            />

            {/* Glassmorphic Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center w-full max-w-lg p-10 mx-4 border bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl shadow-2xl"
            >
                {/* Static Logo */}
                <div className="w-20 h-20 mb-8">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                        <path
                            d="M 5 50 C 30 10 70 10 95 50 C 70 90 30 90 5 50 Z M 35 50 A 15 15 0 1 1 65 50 A 15 15 0 1 1 35 50 M 50 35 L 50 5 M 50 65 L 50 95 M 35 50 L 5 50 M 65 50 L 95 50 M 39 39 L 15 15 M 61 39 L 85 15 M 39 61 L 15 85 M 61 61 L 85 85"
                            fill="transparent"
                            stroke="url(#gradient-static)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <defs>
                            <linearGradient id="gradient-static" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>
                        {[
                            { cx: 5, cy: 50 },
                            { cx: 95, cy: 50 },
                            { cx: 50, cy: 5 },
                            { cx: 50, cy: 95 },
                            { cx: 15, cy: 15 },
                            { cx: 85, cy: 15 },
                            { cx: 15, cy: 85 },
                            { cx: 85, cy: 85 },
                            { cx: 50, cy: 50 }
                        ].map((node, i) => (
                            <circle key={i} cx={node.cx} cy={node.cy} r="3" fill="#FFFFFF" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                        ))}
                    </svg>
                </div>

                {/* Typography */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tight leading-tight">
                    Work Smarter.<br/>Not Harder.
                </h1>
                
                <p className="text-center text-slate-400 mb-10 text-base md:text-lg leading-relaxed px-4">
                    AI-powered task management built for modern professionals.
                </p>

                {/* Actions */}
                <div className="flex flex-col w-full gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all group"
                    >
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/register')}
                        className="flex items-center justify-center w-full py-3.5 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/50 backdrop-blur-sm transition-all"
                    >
                        <UserPlus className="w-5 h-5 mr-2 opacity-80" />
                        Create Account
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Welcome;
