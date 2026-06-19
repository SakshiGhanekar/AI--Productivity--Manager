import React, { useState, useEffect } from 'react';
import api from '../api';
import TaskFormModal from '../components/TaskFormModal';
import KanbanBoard from '../components/KanbanBoard';
import CalendarView from '../components/CalendarView';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  KanbanSquare,
  Clock,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  User,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCountdown from '../components/TaskCountdown';

const getPriorityStyle = (priority) => {
  switch (priority) {
    case 'HIGH': return 'bg-gradient-to-r from-danger/20 to-danger/10 text-danger border-danger/30';
    case 'MEDIUM': return 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30';
    case 'LOW': return 'bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30';
    default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-brandSidebar dark:text-brandMuted dark:border-white/5';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'DONE': return 'bg-success/10 text-success border-success/20';
    case 'IN_PROGRESS': return 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20';
    case 'TODO': return 'bg-slate-100 dark:bg-brandSidebar text-slate-600 dark:text-brandMuted border-slate-200 dark:border-white/5';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex gap-2">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
          <Edit2 size={14} />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <h3 className="text-[15px] font-bold text-slate-900 dark:text-brandText mb-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</h3>

    {/* Mock AI Summary for longer descriptions */}
    {task.description && (
      <div className="mb-4 bg-accent-500/5 border border-accent-500/10 rounded-lg p-2.5 flex gap-2 items-start flex-1">
        <Sparkles size={12} className="text-accent-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-brandMuted leading-relaxed whitespace-pre-line">
          <span className="font-semibold text-accent-600 dark:text-accent-400 mr-1">
            AI:
          </span>
          {task.description?.replace(/\\n/g, '\n')}
        </p>
      </div>
    )}

    <div className="mt-auto">
      {/* Task Countdown & Progress */}
      <TaskCountdown
        dueDate={task.dueDate}
        estimatedHours={task.estimatedHours}
        completedHours={task.completedHours}
        status={task.status}
      />

      {task.estimatedHours > 0 && task.status !== 'DONE' && (
        <div className="mt-3 flex flex-col gap-1 text-[11px] font-medium text-slate-500 dark:text-brandMuted">
          <div className="flex justify-between px-1">
            <span>Estimated: {task.estimatedHours}h</span>
            <span>Completed: {task.completedHours || 0}h</span>
            <span>Remaining: {Math.max(0, task.estimatedHours - (task.completedHours || 0))}h</span>
          </div>
          {Math.max(0, task.estimatedHours - (task.completedHours || 0)) === 0 && (
            <div
              className="mt-1 bg-success/10 text-success border border-success/20 rounded p-1.5 text-center font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-success/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'DONE'); }}
            >
              <CheckCircle size={12} /> Ready to Complete
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-brandMuted mb-1 mt-4 pt-3 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-brandSidebar flex items-center justify-center border-2 border-white dark:border-brandCard overflow-hidden text-[10px] text-slate-500">
            <User size={12} />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'list', 'grid', 'kanban'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('tasks');
      setTasks(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Local optimistic update
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

      const taskToUpdate = tasks.find(t => t.id === id);
      await api.put(`tasks/${id}`, { ...taskToUpdate, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
      fetchTasks(); // Revert on failure
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });



  return (
    <div className="h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-brandText tracking-tight mb-1">Tasks</h1>
          <p className="text-slate-500 dark:text-brandMuted text-sm">Manage your workflow and track progress.</p>
        </div>
        <button onClick={handleCreateTask} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-transform">
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col xl:flex-row gap-4 items-center justify-between z-10 relative">
        <div className="flex flex-1 w-full gap-4 flex-col md:flex-row">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-brandSidebar border border-slate-200 dark:border-white/5 text-slate-900 dark:text-brandText rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all pl-10 py-2.5 text-sm"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-brandSidebar border border-slate-200 dark:border-white/5 text-slate-900 dark:text-brandText rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all py-2.5 px-3 text-sm cursor-pointer min-w-[140px]"
            >
              <option value="ALL">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-100 dark:bg-brandSidebar border border-slate-200 dark:border-white/5 text-slate-900 dark:text-brandText rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all py-2.5 px-3 text-sm cursor-pointer min-w-[140px]"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-brandSidebar p-1 rounded-xl w-full xl:w-auto border border-[var(--border-color)]">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex-1 xl:flex-none p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'kanban' ? 'bg-brandCard shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-brandText'}`}
          >
            <KanbanSquare size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 xl:flex-none p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-brandCard shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-brandText'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 xl:flex-none p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'list' ? 'bg-brandCard shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-brandText'}`}
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 xl:flex-none p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${viewMode === 'calendar' ? 'bg-brandCard shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-brandText'}`}
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card border-dashed border-2 border-slate-300 dark:border-white/5"
          >
            <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mb-6 text-primary-500">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-brandText mb-2">No tasks found</h3>
            <p className="text-slate-500 dark:text-brandMuted max-w-md mb-8">
              You're all caught up! Create a new task and let our AI assistant help you break it down.
            </p>
            <button onClick={handleCreateTask} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20">
              <Plus size={18} />
              <span>Create First Task</span>
            </button>
          </motion.div>
        ) : (
          <>
            {viewMode === 'kanban' && (
              <KanbanBoard
                tasks={filteredTasks}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}

            {viewMode === 'calendar' && (
              <CalendarView
                tasks={filteredTasks}
                onEventClick={handleEditTask}
              />
            )}

            {viewMode === 'grid' && (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredTasks.map(task => <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />)}
                </AnimatePresence>
              </motion.div>
            )}

            {viewMode === 'list' && (
              <motion.div layout className="flex flex-col gap-4">
                <AnimatePresence>
                  {filteredTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-brandCard p-4 rounded-2xl border border-[var(--border-color)] hover:border-primary-400/50 hover:shadow-lg transition-all duration-300 flex items-center gap-6 group"
                    >
                      <div className="flex items-center gap-4 w-48 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-brandSidebar flex items-center justify-center border-2 border-white dark:border-brandCard text-slate-400 shrink-0">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border w-fit mb-1 ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-brandMuted flex items-center gap-1">
                            <Clock size={10} />
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center border-l border-slate-100 dark:border-white/5 pl-6">
                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-brandText truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-0.5">{task.title}</h3>
                        <p className="text-slate-500 dark:text-brandMuted text-xs truncate flex items-center gap-1.5">
                          {task.description && <Sparkles size={10} className="text-accent-500 shrink-0" />}
                          <span className="whitespace-pre-line">
                            {task.description?.replace(/\\n/g, '\n') || "No description provided"}
                          </span>
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-6 shrink-0">
                        {/* Interactive Status Dropdown Simulation */}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider outline-none cursor-pointer border transition-colors ${getStatusColor(task.status)} hover:opacity-80`}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>

                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => handleEditTask(task)} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          setIsModalOpen(false);
          fetchTasks();
        }}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default TaskList;
