
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { soundService } from '../services/soundService';

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  const addLap = () => {
    setLaps(prev => [time, ...prev]);
    soundService.playTick(); // 랩 기록 틱 소리
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    soundService.playClick();
  };

  const reset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
    soundService.playClick();
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        <div className="text-9xl font-black text-pink-500 mb-12 tabular-nums">
          {formatTime(time)}
        </div>

        <div className="flex gap-8">
          <button onClick={reset} className="p-6 bg-pink-100 text-pink-400 rounded-[2rem] shadow-md hover:bg-pink-200 transition-colors">
            <RotateCcw size={32} />
          </button>
          <button onClick={toggleActive} className="p-10 bg-pink-400 text-white rounded-[2.5rem] shadow-xl scale-125 hover:scale-[1.3] active:scale-110 transition-all">
            {isActive ? <Pause size={48} /> : <Play size={48} />}
          </button>
          <button onClick={addLap} className="p-6 bg-pink-100 text-pink-400 rounded-[2rem] shadow-md hover:bg-pink-200 transition-colors disabled:opacity-30" disabled={!isActive && time === 0}>
            <Flag size={32} />
          </button>
        </div>
      </div>

      <div className="flex-1 max-h-[300px] overflow-y-auto space-y-3 border-t border-pink-100 pt-6">
        {laps.map((lap, idx) => (
          <div key={idx} className="flex justify-between px-8 py-4 bg-white/60 rounded-2xl text-lg font-bold text-pink-600 border border-pink-50 shadow-sm">
            <span className="text-pink-300">LAP {laps.length - idx}</span>
            <span className="tabular-nums">{formatTime(lap)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stopwatch;
