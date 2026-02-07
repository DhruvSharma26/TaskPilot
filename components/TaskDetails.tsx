
import React, { useState } from 'react';
import { Task, Status, Priority } from '../types';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Edit3,
  Loader2,
  BrainCircuit
} from 'lucide-react';
import { getTaskAdvice } from '../services/geminiService';

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
  onUpdateStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack, onUpdateStatus, onEdit, onDelete }) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    setIsLoading(true);
    setAiAdvice(null);
    try {
      const advice = await getTaskAdvice(task);
      setAiAdvice(advice);
    } catch (err) {
      setAiAdvice("Failed to connect to TaskPilot AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Action Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
              task.status === Status.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {task.status}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onUpdateStatus(task.id)}
              className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-xl transition-colors"
              title="Toggle Status"
            >
              <CheckCircle2 size={22} />
            </button>
            <button 
              onClick={() => onEdit(task)}
              className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
              title="Edit Task"
            >
              <Edit3 size={22} />
            </button>
            <button 
              onClick={() => { if(confirm('Are you sure?')) onDelete(task.id); }}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
              title="Delete Task"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div>
            <h1 className={`text-3xl font-bold ${task.status === Status.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {task.title}
            </h1>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Calendar size={18} className="text-indigo-500" />
                <span>Due {task.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Clock size={18} className="text-indigo-500" />
                <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={`flex items-center gap-2 font-bold px-3 py-1 rounded-lg text-sm ${
                task.priority === Priority.HIGH ? 'bg-red-50 text-red-600' :
                task.priority === Priority.MODERATE ? 'bg-orange-50 text-orange-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {task.priority} Priority
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800">Description</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl min-h-[100px]">
              {task.description || "No description provided for this task."}
            </p>
          </div>

          {/* AI Section */}
          <div className="pt-4">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2.5 rounded-2xl text-white">
                    <BrainCircuit size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Need a plan?</h3>
                    <p className="text-sm text-slate-500">Ask TaskPilot AI for study tips and task breakdown.</p>
                  </div>
                </div>
                <button 
                  onClick={handleAskAI}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={20} /> Thinking...</>
                  ) : (
                    <><Sparkles size={20} /> Ask TaskPilot AI</>
                  )}
                </button>
              </div>

              {(aiAdvice || isLoading) && (
                <div className="mt-6 bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles size={12} /> AI Strategy
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                      {aiAdvice}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
