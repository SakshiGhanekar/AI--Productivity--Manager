import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md p-8 mx-4 border bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-3xl shadow-2xl shadow-black/50"
      >
        <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">
              {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {isForgotPassword ? 'Enter your email to receive a reset link.' : 'Sign in to access your workspace.'}
            </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 text-sm font-semibold border rounded-xl bg-red-500/10 border-red-500/20 text-red-400 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {error}
          </motion.div>
        )}

        {isForgotPassword ? (
            resetEmailSent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-3">
                  <CheckCircle2 size={20} />
                  We've sent a recovery link to your email.
                </div>
                <button 
                  onClick={() => { setIsForgotPassword(false); setResetEmailSent(false); }}
                  className="w-full py-3 text-white rounded-xl bg-white/10 hover:bg-white/15 transition-colors font-medium border border-white/10"
                >
                  Back to login
                </button>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setResetEmailSent(true); }}>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input type="email" placeholder="Email address" className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white placeholder-slate-500 transition-all" required />
                </div>
                <button type="submit" className="w-full py-3.5 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all">
                  Send Recovery Link
                </button>
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="text-sm text-slate-400 hover:text-white transition-colors">
                    Wait, I remember it. Go back.
                  </button>
                </div>
              </form>
            )
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white placeholder-slate-500 transition-all" 
                required 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white placeholder-slate-500 transition-all" 
                required 
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-black/20 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 transition-colors cursor-pointer" />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative flex items-center justify-center w-full py-3.5 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}



        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-blue-400 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
