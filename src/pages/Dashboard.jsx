import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  CalendarDays,
  Timer
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import TaskCountdown from '../components/TaskCountdown';

const COLORS = ['#00D4AA', '#10B981', '#F59E0B', '#EF4444']; // primary, success, warning, danger

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    overdue: 0
  });
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('tasks/stats'),
        api.get('tasks')
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data.content || tasksRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatName = (name) => {
    if (!name) return 'User';
    // Fallback slicing for known concatenated mock string
    if (name.toLowerCase() === 'sakshighanekardev') {
      return 'Sakshi Ghanekardev';
    }
    // Handle camelCase
    let formatted = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Capitalize each word
    return formatted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const weeklyData = [
    { name: 'Mon', completed: 4, added: 2 },
    { name: 'Tue', completed: 3, added: 5 },
    { name: 'Wed', completed: 7, added: 3 },
    { name: 'Thu', completed: 2, added: 1 },
    { name: 'Fri', completed: 6, added: 4 },
    { name: 'Sat', completed: 8, added: 2 },
    { name: 'Sun', completed: 5, added: 1 },
  ];

  const priorityData = [
    { name: 'High', value: stats.highPriorityTasks || 5 },
    { name: 'Medium', value: (stats.totalTasks - stats.highPriorityTasks - 2) || 8 },
    { name: 'Low', value: 2 },
  ];

  const upcomingTasks = tasks
    .filter(t => t.status !== 'DONE' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const StatCard = ({ title, value, icon: Icon, color, delay, trend, trendValue, isPositive }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 relative overflow-hidden group hover:border-primary-500/30 flex flex-col justify-between h-full min-h-[160px]"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ease-out`} style={{ backgroundColor: color }}></div>
      <div className="flex justify-between items-start relative z-10 flex-1">
        <div className="min-w-0 pr-3">
          <p className="text-slate-500 dark:text-brandMuted text-sm font-medium mb-1 truncate">{title}</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: delay + 0.2 }}
            className="text-4xl font-black text-slate-900 dark:text-brandText tracking-tighter truncate"
          >
            {isLoading ? '-' : value}
          </motion.h3>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-brandSidebar border border-slate-200 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 shrink-0" style={{ color: color }}>
          <Icon size={24} />
        </div>
      </div>
      
      {trendValue && (
        <div className="flex items-center gap-2 mt-auto pt-2 relative z-10 flex-nowrap whitespace-nowrap overflow-hidden w-full">
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md shrink-0 ${isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </div>
          <span className="text-xs text-slate-500 dark:text-brandMuted font-medium truncate shrink-0">{trend}</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Section: Greeting & AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[220px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse-glow"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-brandText tracking-tight mb-3">
              {getGreeting()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-400 dark:from-primary-500 dark:to-secondary-500">{formatName(user?.name).split(' ')[0]}</span>
            </h1>
            <p className="text-slate-600 dark:text-brandMuted text-lg max-w-xl font-medium">
              You're in the top 15% of productive users this week. Let's keep the momentum going!
            </p>
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border-primary-500/20 shadow-primary-500/5 bg-gradient-to-b from-brandCard to-brandBg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shadow-lg shadow-primary-500/10">
              <Bot className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-brandText text-lg">AI Insight</h3>
          </div>
          <p className="text-slate-700 dark:text-brandText font-medium text-sm leading-relaxed flex-1">
            You have <span className="text-primary-600 dark:text-primary-400 font-bold">{stats.pendingTasks} pending tasks</span> due this week. Completing 2 today will increase your productivity score by <span className="text-success font-bold">12%</span>.
          </p>
          <button 
            onClick={() => navigate('/tasks')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform shadow-lg"
          >
            View priority tasks
          </button>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={ListTodo} color="#00D4AA" delay={0.1} trend="vs last week" trendValue="+8%" isPositive={true} />
        <StatCard title="Completed" value={stats.completedTasks} icon={CheckCircle2} color="#10B981" delay={0.2} trend="completion rate" trendValue="92%" isPositive={true} />
        <StatCard title="In Progress" value={stats.inProgressTasks} icon={Clock} color="#F59E0B" delay={0.3} trend="active focus" trendValue="4" isPositive={true} />
        <StatCard title="Overdue" value={stats.overdue || 0} icon={CalendarDays} color="#EF4444" delay={0.4} trend="needs attention" trendValue="-2%" isPositive={false} />
        <StatCard title="High Priority" value={stats.highPriorityTasks} icon={AlertCircle} color="#7C3AED" delay={0.5} trend="critical items" trendValue="5" isPositive={false} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-brandText flex items-center gap-2">
                <TrendingUp size={24} className="text-primary-500" />
                Velocity
              </h3>
              <p className="text-sm text-slate-500 dark:text-brandMuted font-medium mt-1">Tasks completed vs added over the last 7 days</p>
            </div>
            <select className="bg-brandSidebar border border-[var(--border-color)] text-sm font-medium rounded-xl px-4 py-2 outline-none cursor-pointer">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ color: '#F8FAFC', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="added" stroke="#00D4AA" strokeWidth={3} fillOpacity={1} fill="url(#colorAdded)" name="Tasks Added" activeDot={{ r: 6, strokeWidth: 0, fill: '#00D4AA' }} />
                <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Tasks Completed" activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card p-6 flex flex-col"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-brandText mb-2">Focus Areas</h3>
          <p className="text-sm text-slate-500 dark:text-brandMuted font-medium mb-6">Distribution by priority</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[240px]">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', color: '#fff' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900 dark:text-brandText tracking-tighter">{stats.totalTasks}</span>
              <span className="text-[10px] text-slate-500 dark:text-brandMuted font-bold uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            {priorityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-bold text-slate-600 dark:text-brandMuted">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Upcoming Deadlines Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-3 glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-brandText flex items-center gap-2">
                <Timer size={24} className="text-primary-500" />
                Upcoming Deadlines
              </h3>
              <p className="text-sm text-slate-500 dark:text-brandMuted font-medium mt-1">Tasks requiring immediate attention</p>
            </div>
            <button onClick={() => navigate('/tasks')} className="text-sm font-bold text-primary-500 hover:text-primary-600 transition-colors">
              View All
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-slate-500 dark:text-brandMuted font-medium">No upcoming deadlines.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="bg-slate-50/50 dark:bg-brandSidebar border border-slate-100 dark:border-white/5 rounded-2xl p-4 hover:border-primary-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 dark:text-brandText text-sm line-clamp-1">{task.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border mb-3 inline-block
                    ${task.priority === 'HIGH' ? 'bg-danger/10 text-danger border-danger/20' : 
                      task.priority === 'MEDIUM' ? 'bg-warning/10 text-warning border-warning/20' : 
                      'bg-success/10 text-success border-success/20'}`}
                  >
                    {task.priority}
                  </span>
                  <div className="mt-2">
                    <TaskCountdown dueDate={task.dueDate} status={task.status} showProgress={false} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
