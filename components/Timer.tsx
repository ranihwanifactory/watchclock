
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundService } from '../services/soundService';

const Timer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isSetting, setIsSetting] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      soundService.playSuccess(); // 완료 사운드
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (isSetting) setIsSetting(false);
    setIsActive(!isActive);
    soundService.playClick();
  };

  const handleReset = () => {
    setIsActive(false);
    setIsSetting(true);
    setTimeLeft(totalSeconds);
    soundService.playClick();
  };

  const progress = (timeLeft / totalSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto w-full">
      <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] flex items-center justify-center mb-16">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r="45%" strokeWidth="12" fill="transparent" className="text-pink-50" stroke="currentColor" />
          <motion.circle 
            cx="50%" cy="50%" r="45%" strokeWidth="16" fill="transparent" 
            stroke="currentColor" strokeDasharray="100 100" 
            animate={{ strokeDashoffset: 100 - progress }}
            pathLength="100"
            className="text-pink-500 transition-all duration-1000 ease-linear"
            strokeLinecap="round"
          />
        </svg>

        <div className="z-10 text-center">
          {isSetting ? (
             <div className="flex items-center justify-center gap-4">
                <input 
                  type="number" 
                  className="bg-pink-100/50 rounded-3xl p-4 w-40 lg:w-56 text-6xl lg:text-8xl font-black text-pink-600 text-center outline-none focus:ring-4 focus:ring-pink-200" 
                  value={Math.floor(totalSeconds / 60)} 
                  onChange={(e) => {
                    const val = Math.min(999, Math.max(0, parseInt(e.target.value) || 0));
                    setTotalSeconds(val * 60);
                    setTimeLeft(val * 60);
                  }}
                />
                <span className="text-3xl font-black text-pink-300">MIN</span>
             </div>
          ) : (
            <div className="text-9xl lg:text-[160px] font-black text-pink-600 tabular-nums">
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <button onClick={handleReset} className="p-8 bg-white border-2 border-pink-100 text-pink-300 rounded-[2.5rem] shadow-xl hover:text-pink-500 hover:border-pink-300 transition-all">
          <RotateCcw size={40} />
        </button>
        <button 
          onClick={handleStart} 
          className="p-10 bg-pink-500 text-white rounded-[3rem] shadow-2xl shadow-pink-200 scale-125 hover:scale-[1.3] active:scale-110 transition-all"
        >
          {isActive ? <Pause size={48} /> : <Play size={48} />}
        </button>
      </div>
      
      {isSetting && <p className="mt-16 text-pink-300 font-extrabold uppercase tracking-widest text-lg">원하는 시간을 분 단위로 입력하세요</p>}
    </div>
  );
};

export default Timer;
