import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const sequence = async () => {
            // Step 1: Draw path (0-1s) -> phase 1
            setTimeout(() => setPhase(1), 800);
            
            // Step 2 & 3: Nodes light up & Glow (1-1.5s) -> phase 2
            setTimeout(() => setPhase(2), 1500);

            // Step 4 & 5: Text & Tagline appears (1.5-2.2s) -> phase 3
            setTimeout(() => setPhase(3), 2200);

            // Step 6 & 7: Exit transition (2.8s) -> phase 4
            setTimeout(() => setPhase(4), 2800);

            // Navigate to Welcome (3.2s)
            setTimeout(() => navigate('/welcome'), 3200);
        };
        sequence();
    }, [navigate]);

    // SVG Paths for "Neural Core / AI Eye"
    const logoPath = "M 5 50 C 30 10 70 10 95 50 C 70 90 30 90 5 50 Z M 35 50 A 15 15 0 1 1 65 50 A 15 15 0 1 1 35 50 M 50 35 L 50 5 M 50 65 L 50 95 M 35 50 L 5 50 M 65 50 L 95 50 M 39 39 L 15 15 M 61 39 L 85 15 M 39 61 L 15 85 M 61 61 L 85 85";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 4 ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0B1220] to-[#111827]"
        >
            <motion.div 
                className="relative flex flex-col items-center"
                animate={{ scale: phase === 4 ? 1.5 : 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* SVG Logo Container */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                        {/* Glow Filter */}
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Main Animated Path */}
                        <motion.path
                            d={logoPath}
                            fill="transparent"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            filter={phase >= 2 ? "url(#glow)" : ""}
                        />

                        {/* Linear Gradient for Path */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>

                        {/* Neural Nodes */}
                        {[
                            { cx: 5, cy: 50, delay: 0.8 },
                            { cx: 95, cy: 50, delay: 0.9 },
                            { cx: 50, cy: 5, delay: 1.0 },
                            { cx: 50, cy: 95, delay: 1.1 },
                            { cx: 15, cy: 15, delay: 1.2 },
                            { cx: 85, cy: 15, delay: 1.3 },
                            { cx: 15, cy: 85, delay: 1.4 },
                            { cx: 85, cy: 85, delay: 1.5 },
                            { cx: 50, cy: 50, delay: 1.6 } // Core
                        ].map((node, i) => (
                            <motion.circle
                                key={i}
                                cx={node.cx}
                                cy={node.cy}
                                r="4"
                                fill="#FFFFFF"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                    scale: phase >= 1 ? 1 : 0, 
                                    opacity: phase >= 1 ? 1 : 0 
                                }}
                                transition={{ 
                                    duration: 0.3, 
                                    delay: phase === 0 ? 0 : node.delay - 0.5,
                                    type: "spring"
                                }}
                                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        ))}
                    </svg>

                    {/* Ambient Glow behind SVG */}
                    <motion.div 
                        className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-0 -z-10"
                        animate={{ opacity: phase >= 2 ? 0.2 : 0 }}
                        transition={{ duration: 1 }}
                    />
                </div>

                {/* Text Sequence */}
                <div className="text-center">
                    <motion.h1 
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
                        transition={{ duration: 0.6 }}
                    >
                        NeuraFlow AI
                    </motion.h1>
                    
                    <motion.p
                        className="mt-4 text-sm md:text-base text-slate-400 font-medium tracking-wide"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 5 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Transforming Productivity with Intelligence
                    </motion.p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Splash;
