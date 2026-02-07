
import React from 'react';
import { Priority, Status, Task } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LayoutList,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
  onTaskClick: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, stats, onTaskClick, onToggleStatus }) => {
  const recentTasks = tasks.slice(0, 5);

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: <LayoutList className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: stats.pending, icon: <Clock className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'High Priority', value: stats.highPriority, icon: <AlertCircle className="text-red-600" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome Back, Student!</h2>
        <p className="text-slate-500 mt-1">Here's an overview of your productivity today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`${stat.bg} p-3 rounded-xl`}>{stat.icon}</div>
              <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-slate-500 mt-4 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Recent Tasks</h3>
            <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
              View Recent Activity <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {recentTasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => onTaskClick(task.id)}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onToggleStatus(task.id); }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.status === Status.COMPLETED 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {task.status === Status.COMPLETED && <CheckCircle2 size={14} />}
                      </button>
                      <div>
                        <h4 className={`font-medium ${task.status === Status.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            task.priority === Priority.HIGH ? 'bg-red-100 text-red-700' :
                            task.priority === Priority.MODERATE ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutList className="text-slate-300" size={32} />
                </div>
                <h4 className="text-slate-600 font-medium">No tasks yet</h4>
                <p className="text-slate-400 text-sm mt-1">Start by creating your first task!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
