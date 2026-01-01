
import React from 'react';
import { format } from 'date-fns';
// Add missing locale import
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface Props {
  currentTime: Date;
}

const DigitalClock: React.FC<Props> = ({ currentTime }) => {
  const hours = format(currentTime, 'HH');
  const minutes = format(currentTime, 'mm');
  const seconds = format(currentTime, 'ss');
  const secondProgress = (currentTime.getSeconds() / 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative flex flex-col items-center">
        {/* Animated Background Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-pink-100 rounded-full blur-[100px]"
        />

        {/* The Clock Ring (Subtle) */}
        <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center mb-8">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
             <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-pink-100" />
             <motion.circle 
               cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="4" fill="transparent" 
               strokeDasharray="100 100"
               animate={{ strokeDashoffset: 100 - secondProgress }}
               pathLength="100"
               className="text-pink-400" 
               strokeLinecap="round" 
             />
          </svg>
          
          <div className="text-center z-10 flex flex-col">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[120px] lg:text-[180px] font-black text-pink-500 leading-none tracking-tighter tabular-nums flex items-center justify-center"
            >
              <span>{hours}</span>
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>:</motion.span>
              <span>{minutes}</span>
            </motion.div>
            <div className="text-3xl lg:text-4xl font-bold text-pink-300 mt-2">
              {seconds}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="inline-block glass px-8 py-4 rounded-full shadow-sm border border-pink-100/50"
          >
            <p className="text-pink-600 font-bold text-lg md:text-xl">반가워요! 오늘은 멋진 일이 생길 거예요 ✨</p>
          </motion.div>
          
          <div className="flex justify-center gap-6 text-pink-400 font-medium">
             <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-2xl border border-white/50">
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
               Live Time
             </div>
             <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-2xl border border-white/50">
               {format(currentTime, 'EEEE', { locale: ko })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
