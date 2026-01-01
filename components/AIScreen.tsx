
import React from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  message: string;
  onRefresh: () => void;
}

const AIScreen: React.FC<Props> = ({ message, onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mb-8 p-6 bg-pink-400 rounded-full shadow-xl text-white"
      >
        <Sparkles size={48} />
      </motion.div>

      <h2 className="text-xl font-black text-pink-600 mb-4">오늘의 응원 한마디</h2>
      
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-pink-100 shadow-sm mb-8 min-h-[120px] flex items-center justify-center max-w-lg w-full">
        <p className="text-pink-700 font-medium leading-relaxed italic text-lg">
          {message || "당신을 위한 따뜻한 메시지를 가져오고 있어요... ✨"}
        </p>
      </div>

      <button 
        onClick={onRefresh}
        className="flex items-center gap-2 bg-pink-100 text-pink-500 px-6 py-3 rounded-2xl font-bold hover:bg-pink-200 transition-colors shadow-sm"
      >
        <RefreshCcw size={16} /> 다른 응원 보기
      </button>

      <p className="mt-8 text-[10px] text-pink-300 uppercase tracking-widest font-bold">
        Dreamy Watch Daily Quotes
      </p>
    </div>
  );
};

export default AIScreen;
