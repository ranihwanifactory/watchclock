
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

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
  };

  const reset = () => {
    setIsActive(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        <div className="text-5xl font-black text-pink-500 mb-8 tabular-nums">
          {formatTime(time)}
        </div>

        <div className="flex gap-4">
          <button onClick={reset} className="p-4 bg-pink-100 text-pink-400 rounded-full shadow-md">
            <RotateCcw size={24} />
          </button>
          <button onClick={() => setIsActive(!isActive)} className="p-4 bg-pink-400 text-white rounded-full shadow-md scale-110">
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={addLap} className="p-4 bg-pink-100 text-pink-400 rounded-full shadow-md" disabled={!isActive && time === 0}>
            <Flag size={24} />
          </button>
        </div>
      </div>

      <div className="h-32 overflow-y-auto space-y-2 border-t border-pink-100 pt-2">
        {laps.map((lap, idx) => (
          <div key={idx} className="flex justify-between px-4 py-2 bg-pink-50 rounded-xl text-sm font-medium text-pink-600">
            <span className="text-pink-300">랩 {laps.length - idx}</span>
            <span>{formatTime(lap)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stopwatch;
