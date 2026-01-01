
import React, { useState } from 'react';
import { Plus, Trash2, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alarm } from '../types';

interface Props {
  alarms: Alarm[];
  onAdd: (time: string, label: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const AlarmList: React.FC<Props> = ({ alarms, onAdd, onToggle, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState("07:00");
  const [newLabel, setNewLabel] = useState("");

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black text-pink-600 mb-2">My Alarms</h2>
          <p className="text-pink-400 font-medium italic">상쾌한 아침을 위한 설정</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-pink-500 text-white p-4 rounded-[2rem] shadow-xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold px-8"
        >
          <Plus size={24} /> 새 알람 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-4">
        {alarms.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center glass rounded-[3rem] text-pink-200 border-dashed border-2 border-pink-100">
            <Bell size={64} className="mb-4 opacity-20" />
            <p className="text-2xl font-bold opacity-50">아직 설정된 알람이 없어요</p>
          </div>
        ) : (
          alarms.map((alarm, idx) => (
            <motion.div 
              key={alarm.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-[2.5rem] p-8 flex flex-col justify-between border-2 transition-all duration-500 ${alarm.enabled ? 'border-pink-300 shadow-2xl shadow-pink-100' : 'border-transparent opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-pink-100 p-3 rounded-2xl text-pink-500">
                   <Bell size={24} />
                </div>
                <button onClick={() => onDelete(alarm.id)} className="text-pink-200 hover:text-red-400 transition-colors p-2"><Trash2 size={24} /></button>
              </div>
              
              <div>
                <div className={`text-6xl font-black mb-2 tabular-nums ${alarm.enabled ? 'text-pink-600' : 'text-pink-300'}`}>{alarm.time}</div>
                <div className="text-xl font-bold text-pink-400 mb-6">{alarm.label}</div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-pink-50">
                <span className="text-sm font-extrabold text-pink-300 tracking-widest uppercase">매일 반복</span>
                <button 
                  onClick={() => onToggle(alarm.id)}
                  className={`w-16 h-8 rounded-full relative transition-all duration-500 ${alarm.enabled ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    animate={{ x: alarm.enabled ? 36 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-900/40 backdrop-blur-xl z-[60] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[4rem] p-12 shadow-2xl overflow-hidden relative"
            >
              <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 text-pink-300"><X size={32} /></button>
              <h3 className="text-4xl font-black text-pink-600 mb-10">Set New Alarm</h3>
              
              <div className="space-y-10">
                <div className="text-center bg-pink-50 p-10 rounded-[3rem] border-2 border-pink-100">
                  <input 
                    type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    className="text-7xl font-black text-pink-500 bg-transparent border-none outline-none w-full text-center tabular-nums"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-extrabold text-pink-400 uppercase tracking-widest ml-4">Alarm Label</label>
                  <input 
                    type="text" placeholder="예: 아침 운동, 명상 시간" value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-pink-50 border-none rounded-[2rem] p-6 text-xl font-bold text-pink-600 outline-none focus:ring-4 focus:ring-pink-100 transition-all placeholder:text-pink-200"
                  />
                </div>

                <button 
                  onClick={() => { onAdd(newTime, newLabel); setShowAdd(false); setNewLabel(""); }}
                  className="w-full bg-pink-500 text-white py-8 rounded-[2.5rem] text-2xl font-black shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlarmList;
