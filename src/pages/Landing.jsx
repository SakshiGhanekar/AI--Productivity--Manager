import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const NeuraFlowLogo = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Center Core Node */}
    <motion.path
      d="M50 30 L70 50 L50 70 L30 50 Z"
      stroke="url(#gradient)"
      strokeWidth="4"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    
    {/* Outer Neural Ring / Web */}
    <motion.path
      d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
      stroke="#06B6D4"
      strokeWidth="3"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
    />
    
    {/* Connections from Core to Outer Ring */}
    <motion.path
      d="M50 30 L50 10 M60 40 L85 30 M70 50 L85 50 M60 60 L85 70 M50 70 L50 90 M40 60 L15 70 M30 50 L15 50 M40 40 L15 30"
      stroke="#00BBF9"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
    />

    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#00F5D4" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    
    {/* Nodes lighting up at intersections */}
    <motion.circle cx="50" cy="30" r="4" fill="#00F5D4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.2 }} />
    <motion.circle cx="70" cy="50" r="4" fill="#00F5D4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.3 }} />
    <motion.circle cx="50" cy="70" r="4" fill="#00F5D4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.4 }} />
    <motion.circle cx="30" cy="50" r="4" fill="#00F5D4" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5 }} />

    {/* Center Core Energy */}
    <motion.circle cx="50" cy="50" r="6" fill="#F72585" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], opacity: 1 }} transition={{ delay: 1.8, duration: 0.5 }} />
  </svg>
);

const Splash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds duration as requested
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #111827 0%, #0B1220 50%, #07111F 100%)'
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div 
        className="relative flex flex-col items-center"
        animate={{ scale: [1, 1.05] }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            boxShadow: ["0 0 0px rgba(0, 245, 212, 0)", "0 0 40px rgba(0, 245, 212, 0.3)", "0 0 20px rgba(0, 245, 212, 0.1)"]
          }}
          transition={{ duration: 2, delay: 1 }}
          className="rounded-full p-4 mb-6 relative"
        >
          <NeuraFlowLogo />
        </motion.div>

        <motion.h1 
          className="text-4xl font-black text-white tracking-tight mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          NeuraFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#06B6D4]">AI</span>
        </motion.h1>

        <motion.p
          className="text-[#94A3B8] font-medium text-lg tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          "Transforming Productivity with Intelligence"
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const Welcome = () => {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07111F]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating Gradient Orbs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-30"
        style={{ background: 'radial-gradient(circle, #00F5D4 0%, transparent 70%)' }}
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        animate={{ 
          x: [0, -30, 0], 
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Abstract Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div 
        className="relative z-10 w-full max-w-lg p-6"
        initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        {/* Premium Glassmorphism Card */}
        <div className="bg-[#0B1220]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-white/5 flex items-center justify-center shadow-lg relative">
              <Sparkles className="absolute top-2 right-2 text-[#00F5D4] w-3 h-3 animate-pulse" />
              <NeuraFlowLogo />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Work Smarter.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#06B6D4]">Not Harder.</span>
          </h1>
          
          <p className="text-[#94A3B8] text-lg font-medium mb-10 max-w-sm mx-auto">
            AI-powered task management built for modern professionals.
          </p>

          <div className="flex flex-col gap-4">
            <Link 
              to="/register"
              className="w-full py-4 px-6 bg-white text-[#0B1220] rounded-2xl font-bold hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-white/10"
            >
              Create Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login"
              className="w-full py-4 px-6 bg-[#111827] border border-white/10 text-white rounded-2xl font-bold hover:bg-[#1f2937] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="bg-[#07111F] min-h-screen">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Splash key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <Welcome key="welcome" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
