import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  LogOut,
  BrainCircuit,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Settings,
  Bot,
  Search,
  Bell,
  Zap,
  Command,
  ChevronRight as BreadcrumbSeparator,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Command Palette Component
const CommandPalette = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-brandBg/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-brandCard border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden relative z-10"
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
          <Search className="text-zinc-500" size={20} />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, generate ideas, or type a command..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-500"
          />
          <div className="flex gap-1">
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-mono">ESC</span>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <div className="px-2 py-1 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Suggestions</div>
          {['Create new task', 'Go to Analytics', 'Chat with AI Assistant', 'Toggle Dark Theme'].map((item, i) => (
            <button key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-500/10 hover:text-primary-400 text-zinc-300 text-sm text-left transition-colors">
              <Bot size={16} className="text-primary-500" />
              {item}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Notification Drawer Component
const NotificationDrawer = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brandBg/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-sm bg-brandCard border-l border-zinc-800 h-full relative z-10 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
              {[
                { title: 'Task Due Tomorrow', desc: 'Complete homepage redesign', time: '2 hours ago', icon: <CheckSquare className="text-warning" size={16} />, bg: 'bg-warning/10' },
                { title: 'AI Recommendation', desc: 'You work best in the morning. Try scheduling deep work before 11 AM.', time: '5 hours ago', icon: <Bot className="text-primary-400" size={16} />, bg: 'bg-primary-500/10' },
                { title: 'Weekly Summary Ready', desc: 'You completed 12 tasks this week!', time: '1 day ago', icon: <BarChart3 className="text-success" size={16} />, bg: 'bg-success/10' },
              ].map((notif, i) => (
                <div key={i} onClick={onClose} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/30 hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notif.bg} shrink-0 mt-0.5`}>
                      {notif.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-primary-400 transition-colors">{notif.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{notif.desc}</p>
                      <span className="text-[10px] text-zinc-500 font-medium mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCmdkOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsCmdkOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Bot size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const getPageTitle = () => {
    const route = navLinks.find(link => link.path === location.pathname);
    return route ? route.name : 'Overview';
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-brandText flex transition-colors duration-500">

      <CommandPalette isOpen={isCmdkOpen} onClose={() => setIsCmdkOpen(false)} />
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Sidebar (Desktop) */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="hidden md:flex flex-col bg-white dark:bg-[#080808] border-r border-zinc-200 dark:border-white/5 sticky top-0 h-screen z-20 transition-all duration-300"
      >
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="p-4 flex items-center justify-between mb-6 mt-2">
            <div className={`flex items-center gap-3 overflow-hidden transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <div className="w-10 h-10 min-w-[40px] bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center text-accent shadow-lg shadow-accent/10">
                <BrainCircuit size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">AI Tasks</span>
            </div>
            {isCollapsed && (
              <div className="w-10 h-10 min-w-[40px] bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center text-accent shadow-lg shadow-accent/10 mx-auto">
                <BrainCircuit size={20} />
              </div>
            )}
          </div>

          <nav className="px-3 py-2 flex flex-col gap-1.5">
            <div className={`px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>Menu</div>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium relative overflow-hidden group ${isActive
                    ? 'text-white bg-accent shadow-md'
                    : 'text-slate-600 dark:text-brandMuted hover:bg-slate-100 dark:hover:bg-brandCard hover:text-slate-900 dark:hover:text-white'
                    }`}
                  title={isCollapsed ? link.name : ''}
                >
                  <div className={`${isActive ? 'text-white' : 'group-hover:text-accent'} transition-colors`}>
                    {link.icon}
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap"
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-white"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={18} />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Global Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-black/90 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">

          <div className="flex items-center gap-4">
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
              <span className="text-zinc-500">Workspace</span>
              <BreadcrumbSeparator size={14} className="text-zinc-600" />
              <span className="text-zinc-900 dark:text-white">{getPageTitle()}</span>
            </div>
            {/* Mobile Title */}
            <div className="flex items-center gap-3 md:hidden">
              <div className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center text-accent shadow-lg shadow-accent/10">
                <BrainCircuit size={24} className="animate-pulse-glow" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Tasks</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsCmdkOpen(true)}
              className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-lg border border-zinc-200 dark:border-white/10 text-sm text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <Search size={16} />
              <span>Search...</span>
              <div className="flex items-center gap-0.5 ml-4">
                <Command size={12} />
                <span className="text-xs">K</span>
              </div>
            </button>

            {/* Productivity Score */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-lg text-accent-500 text-sm font-bold">
              <Zap size={16} className="fill-accent-500" />
              <span>85 Score</span>
            </div>

            <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1 hidden md:block" />

            <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-primary-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setIsNotifOpen(true)} className="p-2 text-zinc-500 hover:text-primary-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-brandCard animate-pulse"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative ml-2 pl-2 border-l border-zinc-200 dark:border-white/10">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm ring-2 ring-transparent group-hover:ring-primary-500/50 transition-all overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <ChevronRight size={14} className={`text-zinc-500 transition-transform ${isProfileMenuOpen ? '-rotate-90' : 'rotate-90'}`} />
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col py-1"
                    >
                      <div className="px-4 py-2 border-b border-zinc-100 dark:border-white/5 mb-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email || 'user@example.com'}</p>
                      </div>

                      <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                        <User size={16} />
                        Profile Settings
                      </Link>

                      <button
                        onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors text-left w-full"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative pb-24 md:pb-8 dark:bg-black">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>

        {/* Mobile Nav Links (Bottom Bar) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 z-50 flex justify-around p-2 pb-safe">
          {navLinks.slice(0, 4).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.name} to={link.path} className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-slate-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {link.icon}
                <span className="text-[10px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Floating AI Button */}
        <Link
          to="/ai-assistant"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-zinc-900 dark:bg-[#111] dark:border dark:border-white/10 text-white dark:text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 hover:-translate-y-1 hover:shadow-cyan-500/20 active:scale-95 transition-all z-40 group"
          title="Chat with AI"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <Bot size={24} className="group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-zinc-50 dark:border-brandBg animate-pulse"></span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
