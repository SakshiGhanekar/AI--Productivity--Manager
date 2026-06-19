import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, CheckCircle2, Clock, Zap, Target, Award, ArrowUpRight } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#00D4AA', '#10b981', '#f59e0b', '#7C3AED'];

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('tasks/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback stats if backend fails
        setStats({
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
          highPriorityTasks: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatName = (name) => {
    if (!name) return 'User';
    if (name.toLowerCase() === 'sakshighanekardev') return 'Sakshi Ghanekardev';
    let formatted = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    return formatted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  // Formatting data for charts
  const statusData = [
    { name: 'To Do', value: stats.totalTasks - stats.inProgressTasks - stats.completedTasks, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#00D4AA' },
    { name: 'Done', value: stats.completedTasks, color: '#10b981' }
  ];

  const currentDayIndex = new Date().getDay();
  const currentDay = currentDayIndex === 0 ? 6 : currentDayIndex - 1; // 0=Mon...6=Sun
  
  const weeklyData = [
    { name: 'Mon', tasks: 0 },
    { name: 'Tue', tasks: 0 },
    { name: 'Wed', tasks: 0 },
    { name: 'Thu', tasks: 0 },
    { name: 'Fri', tasks: 0 },
    { name: 'Sat', tasks: 0 },
    { name: 'Sun', tasks: 0 },
  ];
  
  // Inject the actual total tasks into today's bar
  weeklyData[currentDay].tasks = stats.totalTasks;

  const radarData = [
    { subject: 'Speed', A: 120, fullMark: 150 },
    { subject: 'Quality', A: 98, fullMark: 150 },
    { subject: 'Focus', A: 86, fullMark: 150 },
    { subject: 'Consistency', A: 99, fullMark: 150 },
    { subject: 'Complexity', A: 85, fullMark: 150 },
    { subject: 'Communication', A: 65, fullMark: 150 },
  ];

  const timeData = [
    { name: 'Week 1', hours: 24 },
    { name: 'Week 2', hours: 35 },
    { name: 'Week 3', hours: 28 },
    { name: 'Week 4', hours: 42 },
  ];

  return (
    <div className="h-full flex flex-col space-y-8 pb-10">
      
      {/* Header & User Profile Card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-brandText tracking-tight mb-2">Performance Analytics</h1>
          <p className="text-slate-500 dark:text-brandMuted text-base font-medium">Deep dive into your productivity metrics, task history, and AI insights.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-white to-primary-50/50 dark:from-brandCard dark:to-primary-950/20 border-primary-500/20 shadow-primary-500/5"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award size={100} className="text-primary-500" />
          </div>
          <div className="relative z-10 flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-brandText">{formatName(user?.name)}</h3>
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 mt-0.5">
                <Zap size={14} /> Level 14 Achiever
              </p>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-brandMuted mb-2">
              <span>Current XP: 2,450</span>
              <span>Next Level: 3,000</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-brandSidebar rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '81%' }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Tasks', value: stats.totalTasks, icon: <BarChart3 size={24} />, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { title: 'Completed', value: stats.completedTasks, icon: <CheckCircle2 size={24} />, color: 'text-success', bg: 'bg-success/10' },
          { title: 'In Progress', value: stats.inProgressTasks, icon: <Clock size={24} />, color: 'text-warning', bg: 'bg-warning/10' },
          { title: 'Completion Rate', value: `${stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`, icon: <TrendingUp size={24} />, color: 'text-accent-500', bg: 'bg-accent-500/10' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex flex-col group hover:border-primary-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} />
                <span>12%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-brandMuted mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-brandText tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        
        {/* Weekly Productivity Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-brandText">Weekly Output</h3>
              <p className="text-sm text-slate-500 dark:text-brandMuted font-medium">Tasks completed per day</p>
            </div>
            <select className="bg-slate-100 dark:bg-brandSidebar border border-slate-200 dark:border-white/5 text-slate-900 dark:text-brandText text-sm font-medium rounded-xl px-3 py-1.5 outline-none">
              <option>This Week</option>
            </select>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
            className="flex-1 min-h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4AA" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#3f3f46', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: '#122033', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ fontWeight: 600, color: '#00D4AA' }}
                />
                <Bar dataKey="tasks" fill="url(#colorBar)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Productivity Trends Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="mb-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-brandText">Productivity Radar</h3>
            <p className="text-sm text-slate-500 dark:text-brandMuted font-medium">AI-assessed work traits</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6, type: "spring", bounce: 0.5 }}
            className="flex-1 min-h-[300px] flex items-center justify-center -ml-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#3f3f46" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Traits" dataKey="A" stroke="#00D4AA" strokeWidth={2} fill="#00D4AA" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#122033', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontWeight: 600, color: '#00D4AA' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Status Distribution Donut */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 flex flex-col"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-brandText mb-6">Task Status</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  cornerRadius={6}
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#122033', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 dark:text-brandText tracking-tighter">{stats.totalTasks}</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-brandMuted uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-slate-600 dark:text-brandMuted">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time Spent Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2 glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-brandText">Time Invested</h3>
              <p className="text-sm text-slate-500 dark:text-brandMuted font-medium">Estimated hours tracked over the month</p>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-brandSidebar rounded-xl">
              <Clock size={20} className="text-slate-500 dark:text-brandMuted" />
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, type: "spring" }}
            className="flex-1 min-h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#122033', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ fontWeight: 600, color: '#7C3AED' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" activeDot={{ r: 6, strokeWidth: 0, fill: '#7C3AED' }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Analytics;
