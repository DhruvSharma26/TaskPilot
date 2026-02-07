
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, BellRing } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const Pomodoro: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  
  // Use number instead of NodeJS.Timeout for browser-based setInterval IDs
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Access window explicitly to ensure number return type in browser
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleModeSwitch();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleModeSwitch = () => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    const nextTime = nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    setMode(nextMode);
    setTimeLeft(nextTime);
    setIsActive(false);
    
    // Play sound or alert
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME)) * 100;
  const strokeDashoffset = 283 - (283 * (100 - progress)) / 100;

  return (
    <div className="max-w-xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Focus Session</h2>
        <p className="text-slate-500 mt-2">Boost your concentration with the Pomodoro Technique.</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Circular Progress Bar SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="880"
              style={{ strokeDashoffset: 880 - (880 * (100 - progress)) / 100 }}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${mode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'}`}
            />
          </svg>

          {/* Time Display */}
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {mode === 'focus' ? (
                <Target size={20} className="text-indigo-600" />
              ) : (
                <Coffee size={20} className="text-emerald-500" />
              )}
              <span className={`text-xs font-bold uppercase tracking-widest ${mode === 'focus' ? 'text-indigo-600' : 'text-emerald-500'}`}>
                {mode === 'focus' ? 'Deep Work' : 'Break Time'}
              </span>
            </div>
            <span className="text-7xl font-black text-slate-800 tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={resetTimer}
          className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl shadow-sm transition-all"
          title="Reset"
        >
          <RotateCcw size={24} />
        </button>

        <button
          onClick={toggleTimer}
          className={`px-12 py-5 rounded-3xl font-bold text-white shadow-xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 ${
            mode === 'focus' 
            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
          }`}
        >
          {isActive ? (
            <><Pause size={24} fill="currentColor" /> Pause Session</>
          ) : (
            <><Play size={24} fill="currentColor" /> Start Session</>
          )}
        </button>

        <button
          onClick={handleModeSwitch}
          className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl shadow-sm transition-all"
          title="Switch Mode"
        >
          <RotateCcw size={24} className="rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border transition-all ${mode === 'focus' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 opacity-50'}`}>
          <h4 className="font-bold text-slate-800">Focus Mode</h4>
          <p className="text-xs text-slate-500 mt-1">25 Minutes of deep concentration.</p>
        </div>
        <div className={`p-6 rounded-3xl border transition-all ${mode === 'break' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 opacity-50'}`}>
          <h4 className="font-bold text-slate-800">Break Mode</h4>
          <p className="text-xs text-slate-500 mt-1">5 Minutes of relaxation.</p>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
