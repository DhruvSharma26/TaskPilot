
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ListTodo, 
  Timer, 
  PlusCircle, 
  Search, 
  Menu,
  Sparkles
} from 'lucide-react';
import { Priority, Status, Task, View } from './types';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import Pomodoro from './components/Pomodoro';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import AIChatBot from './components/AIChatBot';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<View>('Dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskpilot_tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskpilot_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === Status.COMPLETED).length;
    const pending = total - completed;
    const highPriority = tasks.filter(t => t.priority === Priority.HIGH && t.status === Status.PENDING).length;
    return { total, completed, pending, highPriority };
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      status: Status.PENDING,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    setIsTaskFormOpen(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    setIsTaskFormOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTaskId === id) {
      setCurrentView('Dashboard');
      setSelectedTaskId(null);
    }
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === Status.PENDING ? Status.COMPLETED : Status.PENDING } : t
    ));
  };

  const openTaskDetails = (id: string) => {
    setSelectedTaskId(id);
    setCurrentView('TaskDetails');
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard tasks={tasks} stats={stats} onTaskClick={openTaskDetails} onToggleStatus={toggleTaskStatus} />;
      case 'All':
        return <TaskList title="All Tasks" tasks={tasks} onTaskClick={openTaskDetails} onToggleStatus={toggleTaskStatus} onDelete={deleteTask} />;
      case 'Pomodoro':
        return <Pomodoro />;
      case 'TaskDetails':
        const task = tasks.find(t => t.id === selectedTaskId);
        if (!task) {
          setCurrentView('Dashboard');
          return null;
        }
        return <TaskDetails 
          task={task} 
          onBack={() => setCurrentView('Dashboard')} 
          onUpdateStatus={toggleTaskStatus}
          onEdit={(t) => { setEditingTask(t); setIsTaskFormOpen(true); }}
          onDelete={deleteTask}
        />;
      default:
        return <Dashboard tasks={tasks} stats={stats} onTaskClick={openTaskDetails} onToggleStatus={toggleTaskStatus} />;
    }
  };

  const navItems = [
    { name: 'Dashboard' as View, icon: <LayoutDashboard size={20} /> },
    { name: 'All' as View, icon: <ListTodo size={20} /> },
    { name: 'Pomodoro' as View, icon: <Timer size={20} /> },
    { name: 'Ask AI' as any, icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <LayoutDashboard size={24} />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight text-slate-800">TaskPilot</h1>}
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === 'Ask AI') {
                  setIsChatOpen(true);
                } else {
                  setCurrentView(item.name);
                }
              }}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                currentView === item.name 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <span className={currentView === item.name ? 'text-indigo-600' : ''}>{item.icon}</span>
              {isSidebarOpen && <span>{item.name === 'All' ? 'All Tasks' : item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => { setEditingTask(null); setIsTaskFormOpen(true); }}
            className={`flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all ${
              isSidebarOpen ? 'px-4 py-3 w-full' : 'p-3 mx-auto'
            }`}
          >
            <PlusCircle size={20} />
            {isSidebarOpen && <span className="font-medium">Create Task</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 gap-2 w-64">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search tasks..." className="bg-transparent text-sm focus:outline-none w-full" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {renderView()}
        </div>
      </main>

      {/* Overlays */}
      {isTaskFormOpen && (
        <TaskForm 
          onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }} 
          onSubmit={editingTask ? updateTask : addTask} 
          editingTask={editingTask}
        />
      )}

      {/* Chatbot */}
      <AIChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
};

export default App;
