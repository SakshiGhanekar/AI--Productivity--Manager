import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, AlertCircle, Edit2, Trash2, Sparkles, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import TaskCountdown from './TaskCountdown';

const KanbanBoard = ({ tasks, onStatusChange, onEdit, onDelete }) => {
  const [columns, setColumns] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: []
  });

  useEffect(() => {
    // Distribute tasks into columns based on status
    const newCols = { TODO: [], IN_PROGRESS: [], DONE: [] };
    tasks.forEach(task => {
      if (newCols[task.status]) {
        newCols[task.status].push(task);
      }
    });
    setColumns(newCols);
  }, [tasks]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedTask] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedTask);
      setColumns({ ...columns, [source.droppableId]: sourceCol });
    } else {
      movedTask.status = destination.droppableId;
      destCol.splice(destination.index, 0, movedTask);
      setColumns({ ...columns, [source.droppableId]: sourceCol, [destination.droppableId]: destCol });
      
      // Call parent API update
      onStatusChange(movedTask.id, destination.droppableId);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-gradient-to-r from-danger/20 to-danger/10 text-danger border-danger/30';
      case 'MEDIUM': return 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30';
      case 'LOW': return 'bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700';
    }
  };

  const Column = ({ title, columnId, tasks }) => (
    <div className="flex-1 min-w-[320px] bg-zinc-50/50 dark:bg-brandCard/40 rounded-3xl p-4 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-full shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${columnId === 'TODO' ? 'bg-zinc-400' : columnId === 'IN_PROGRESS' ? 'bg-primary-500 animate-pulse' : 'bg-success'}`} />
          <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
        </div>
        <span className="bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-3 py-1 rounded-full border border-zinc-300/50 dark:border-zinc-700/50">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto space-y-3 min-h-[200px] rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-brandCard p-5 rounded-2xl shadow-sm border group flex flex-col ${snapshot.isDragging ? 'shadow-2xl shadow-primary-500/20 border-primary-500 scale-[1.02] rotate-1 z-50' : 'border-[var(--border-color)] hover:border-primary-400/50 hover:shadow-lg transition-all duration-300'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(task)} className="p-1.5 text-zinc-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(task.id)} className="p-1.5 text-zinc-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-zinc-900 dark:text-white mb-2 text-[15px] leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{task.title}</h4>
                    
                    {/* Mock AI Summary */}
                    {task.description && (
                      <div className="mb-4 bg-accent-500/5 border border-accent-500/10 rounded-lg p-2.5 flex gap-2 items-start">
                        <Sparkles size={12} className="text-accent-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          <span className="font-semibold text-accent-600 dark:text-accent-400 mr-1">AI:</span>
                          {task.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Task Countdown & Progress */}
                    <TaskCountdown 
                      dueDate={task.dueDate} 
                      estimatedHours={task.estimatedHours}
                      completedHours={task.completedHours}
                      status={task.status} 
                    />

                    {task.estimatedHours > 0 && task.status !== 'DONE' && (
                       <div className="mt-3 flex flex-col gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
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
                    
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-2 border-white dark:border-brandCard overflow-hidden text-[10px] font-bold text-zinc-500">
                          <User size={12} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                        <MessageSquare size={12} />
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 h-full min-h-[70vh] snap-x no-scrollbar">
        <Column title="To Do" columnId="TODO" tasks={columns['TODO']} />
        <Column title="In Progress" columnId="IN_PROGRESS" tasks={columns['IN_PROGRESS']} />
        <Column title="Done" columnId="DONE" tasks={columns['DONE']} />
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
