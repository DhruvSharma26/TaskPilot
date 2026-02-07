
import React, { useState } from 'react';
import { Priority, Status, Task } from '../types';
// Added ListTodo to the imports to resolve the missing component error
import { CheckCircle2, Clock, AlertCircle, Trash2, Filter, MoreVertical, ListTodo } from 'lucide-react';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTaskClick: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ title, tasks, onTaskClick, onToggleStatus, onDelete }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'High'>('All');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return task.status === Status.PENDING;
    if (filter === 'Completed') return task.status === Status.COMPLETED;
    if (filter === 'High') return task.priority === Priority.HIGH;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 mt-1">Manage and track your progress efficiently.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
          {(['All', 'Pending', 'Completed', 'High'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
              onClick={() => onTaskClick(task.id)}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleStatus(task.id); }}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.status === Status.COMPLETED 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-slate-300 hover:border-indigo-500 bg-white'
                }`}
              >
                {task.status === Status.COMPLETED && <CheckCircle2 size={16} />}
              </button>

              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${task.status === Status.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center flex-wrap gap-4 mt-2">
                  <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    task.priority === Priority.HIGH ? 'bg-red-50 text-red-600' :
                    task.priority === Priority.MODERATE ? 'bg-orange-50 text-orange-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    <AlertCircle size={12} />
                    {task.priority}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>Due {task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="text-slate-300" size={40} />
            </div>
            <h3 className="text-slate-600 font-bold text-lg">No tasks match your filter</h3>
            <p className="text-slate-400 mt-2">Try adjusting your filters or create a new task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
