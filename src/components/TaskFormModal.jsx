import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTasks } from '../context/TaskContext';
import {
  X,
  Sparkles,
  Calendar,
  AlignLeft,
  Tag,
  Activity,
  Clock,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskFormModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const { createTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    estimatedHours: '',
    completedHours: ''
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatDueDate = (date) => {
    if (!date) return '';
    if (Array.isArray(date)) {
      return `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`;
    }
    return String(date).substring(0, 10);
  };

  const parseEstimatedHours = (time) => {
    if (!time) return '';
    const parsed = parseInt(String(time).replace(/[^0-9]/g, ''));
    return isNaN(parsed) ? '' : parsed;
  };

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: (taskToEdit.description || '')
          .replace(/\\n\\n/g, '\n\n')
          .replace(/\\n/g, '\n'),
        status: taskToEdit.status || 'TODO',
        priority: taskToEdit.priority || 'MEDIUM',
        dueDate: formatDueDate(taskToEdit.dueDate),
        estimatedHours: taskToEdit.estimatedHours || parseEstimatedHours(taskToEdit.estimatedTime),
        completedHours: taskToEdit.completedHours || ''
      });
      console.log('Opened Edit Modal with task:', taskToEdit);
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        estimatedHours: '',
        completedHours: ''
      });
    }
  }, [taskToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const taskData = {
        ...formData,
        description: (formData.description || '')
          .replace(/\\n\\n/g, '\n\n')
          .replace(/\\n/g, '\n'),
        estimatedTime: formData.estimatedHours ? `${formData.estimatedHours} Hours` : null,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
        completedHours: formData.completedHours ? parseInt(formData.completedHours) : 0,
        dueDate: formData.dueDate ? formData.dueDate : null
      };

      // Try real backend first; fall back to localStorage via context
      try {
        if (taskToEdit) {
          await api.put(`tasks/${taskToEdit.id}`, taskData);
        } else {
          await api.post('tasks', taskData);
        }
      } catch (apiError) {
        // Backend unreachable — save locally using TaskContext (localStorage)
        console.warn('Backend unavailable, saving to localStorage:', apiError.message);
        if (taskToEdit) {
          await updateTask(taskToEdit.id, { ...taskData, id: taskToEdit.id });
        } else {
          await createTask(taskData);
        }
      }
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task.');
    } finally {
      setIsSaving(false);
    }
  };

  const getLocalAiFallback = (title) => {
    const lower = title.toLowerCase();
    let priority = 'MEDIUM';
    let estimatedHours = 2;
    let description;

    if (lower.includes('bug') || lower.includes('fix') || lower.includes('urgent') || lower.includes('error')) {
      priority = 'HIGH';
      estimatedHours = 4;
      description = `CRITICAL HOTFIX: ${title}.\n\nImmediate action required to resolve this issue. Steps:\n1. Reproduce the bug in the local environment.\n2. Identify the root cause within the affected modules.\n3. Implement a patch and run regression testing.\n4. Push to production immediately upon passing tests.`;
    } else if (lower.includes('api') || lower.includes('backend') || lower.includes('database') || lower.includes('schema')) {
      priority = 'HIGH';
      estimatedHours = 8;
      description = `BACKEND ENGINEERING TASK: ${title}.\n\nThis task requires deep backend architectural work.\n- Update REST endpoints and ensure secure data transmission.\n- Modify database schemas using proper migration scripts.\n- Optimize query performance and implement necessary caching mechanisms.\n- Update API documentation (Swagger/OpenAPI).`;
    } else if (lower.includes('design') || lower.includes('ui') || lower.includes('frontend') || lower.includes('css') || lower.includes('page')) {
      priority = 'MEDIUM';
      estimatedHours = 6;
      description = `FRONTEND & UI IMPLEMENTATION: ${title}.\n\nFocus on delivering a pixel-perfect, responsive user interface.\n- Translate Figma/design mockups into reusable React components.\n- Ensure cross-browser compatibility and mobile responsiveness.\n- Implement smooth animations and transitions.\n- Connect UI components to Redux/Context state or backend APIs.`;
    } else if (lower.includes('test') || lower.includes('qa') || lower.includes('docs') || lower.includes('update')) {
      priority = 'LOW';
      estimatedHours = 1;
      description = `MAINTENANCE & QUALITY ASSURANCE: ${title}.\n\n- Review existing documentation and update out-of-date sections.\n- Add comprehensive unit and integration tests.\n- Perform code reviews and run automated linting tools.\n- Ensure all project standards are fully met.`;
    } else {
      description = `Analyze, design, and implement the necessary changes for: ${title}.\n\nKey responsibilities include:\n- Reviewing current architecture and identifying integration points.\n- Developing robust and scalable code to meet the requirements.\n- Writing unit tests and ensuring QA standards are met.\n- Deploying the changes and monitoring for performance impact.`;
    }

    return { description, priority, estimatedHours };
  };

  const handleAiAutoFill = async () => {
    if (!formData.title) {
      alert("Please enter a title first so AI knows what to do!");
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await api.post('ai/generate', { title: formData.title });

      const { description, priority, estimatedTime, estimatedHours } = response.data;

      let parsedHours = estimatedHours;
      if (estimatedTime && !parsedHours) {
        parsedHours = parseInt(estimatedTime.replace(/[^0-9]/g, '')) || 1;
      }

      setFormData(prev => {
        const cleanDescription = (description || prev.description || "")
          .replace(/\\n\\n/g, "\n\n")
          .replace(/\\n/g, "\n");
        return {
          ...prev,
          description: cleanDescription,
          priority: priority || prev.priority,
          estimatedHours: estimatedHours || parsedHours || prev.estimatedHours
        };
      });
    } catch (error) {
      // Backend unreachable (e.g. production on Vercel) — use smart local fallback
      console.warn('Backend unavailable, using local AI fallback:', error.message);
      const fallback = getLocalAiFallback(formData.title);
      setFormData(prev => ({
        ...prev,
        description: fallback.description,
        priority: fallback.priority,
        estimatedHours: fallback.estimatedHours
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card relative w-full max-w-2xl bg-brandCard shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                {taskToEdit ? <Edit2 size={20} /> : <Plus size={20} />}
              </div>
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form id="task-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar">

            {/* Title & AI Auto-fill */}
            <div className="mb-6 space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Task Title</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="E.g., Prepare Q3 Financial Review"
                    className="premium-input pl-11 py-3 text-lg font-medium"
                  />
                </div>
                {!taskToEdit && (
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiLoading || !formData.title}
                    className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white font-medium shadow-lg shadow-accent-500/25 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isAiLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Sparkles size={18} />
                      </motion.div>
                    ) : (
                      <Sparkles size={18} />
                    )}
                    <span>{isAiLoading ? 'Generating...' : 'AI Auto-fill'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <AlignLeft size={16} className="text-slate-400" /> Description
              </label>
              <div className="relative group">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Task details..."
                  className="premium-input p-4 resize-none"
                />
                <AnimatePresence>
                  {isAiLoading && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center"
                    >
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.6 }} className="w-2 h-2 bg-primary-500 rounded-full" />
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} className="w-2 h-2 bg-primary-500 rounded-full" />
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} className="w-2 h-2 bg-primary-500 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grid Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Activity size={16} className="text-slate-400" /> Status
                </label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange} className="premium-input appearance-none cursor-pointer">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Tag size={16} className="text-slate-400" /> Priority
                </label>
                <div className="relative group">
                  <select name="priority" value={formData.priority} onChange={handleChange} className="premium-input appearance-none cursor-pointer">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <AnimatePresence>
                    {isAiLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-accent-500 rounded-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" /> Due Date
                </label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="premium-input [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert" />
              </div>

              <div className="space-y-3 relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" /> Est. Hours
                </label>
                <div className="relative group">
                  <input type="number" name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} min="1" placeholder="e.g. 4" className="premium-input" />
                  <AnimatePresence>
                    {isAiLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-accent-500 rounded-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-3 relative">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Activity size={16} className="text-slate-400" /> Comp. Hours
                </label>
                <div className="relative group">
                  <input type="number" name="completedHours" value={formData.completedHours} onChange={handleChange} min="0" placeholder="e.g. 2" className="premium-input" />
                </div>
              </div>
            </div>
          </form>

          {/* Footer Buttons */}
          <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 justify-end shrink-0">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" form="task-form" disabled={isSaving || isAiLoading} className="btn-primary min-w-[120px]">
              {isSaving ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Imports inside this file need Plus and Edit2
import { Plus, Edit2 } from 'lucide-react';
export default TaskFormModal;
