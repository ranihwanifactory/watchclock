
import React, { useState, useEffect } from 'react';
import { 
  Clock as ClockIcon, 
  AlarmClock, 
  Timer as TimerIcon, 
  TimerReset, 
  Sparkles,
  Volume2,
  VolumeX,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { TabType, Alarm } from './types';
import { getSmartGreeting, getAlarmMotivation } from './services/messageService';
import { soundService } from './services/soundService';

// Sub-components
import DigitalClock from './components/DigitalClock';
import AlarmList from './components/AlarmList';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch';
import AIScreen from './components/AIScreen';

const STORAGE_KEY = 'dreamy_alarms';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('clock');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(false);
  
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const savedAlarms = localStorage.getItem(STORAGE_KEY);
    if (savedAlarms) {
      try {
        return JSON.parse(savedAlarms);
      } catch (e) {
        console.error("Failed to parse saved alarms", e);
        return [];
      }
    }
    return [];
  });

  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkAlarms(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  useEffect(() => {
    const fetchGreeting = async () => {
      const timeStr = format(new Date(), 'HH:mm');
      const msg = await getSmartGreeting(timeStr);
      setAiMessage(msg);
    };
    fetchGreeting();
  }, []);

  const checkAlarms = (now: Date) => {
    const timeStr = format(now, 'HH:mm');
    const matchingAlarm = alarms.find(a => a.enabled && a.time === timeStr && now.getSeconds() === 0);
    if (matchingAlarm) {
      setRingingAlarm(matchingAlarm);
      getAlarmMotivation(matchingAlarm.label).then(setAiMessage);
      soundService.startAlarm(); // 사운드 시작
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundService.setMuted(nextMuted);
    soundService.playClick();
  };

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    soundService.playClick();
  };

  const addAlarm = (time: string, label: string) => {
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time,
      label: label || '알람',
      enabled: true,
      days: ['월', '화', '수', '목', '금', '토', '일']
    };
    setAlarms(prev => [...prev, newAlarm]);
    soundService.playSuccess();
  };

  const dismissAlarm = () => {
    setRingingAlarm(null);
    soundService.stopAlarm(); // 사운드 중지
    soundService.playClick();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clock': return <DigitalClock currentTime={currentTime} />;
      case 'alarm': return (
        <AlarmList 
          alarms={alarms} 
          onAdd={addAlarm} 
          onToggle={(id) => { setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)); soundService.playClick(); }} 
          onDelete={(id) => { setAlarms(prev => prev.filter(a => a.id !== id)); soundService.playClick(); }} 
        />
      );
      case 'timer': return <Timer />;
      case 'stopwatch': return <Stopwatch />;
      case 'ai': return <AIScreen message={aiMessage} onRefresh={async () => { setAiMessage(await getSmartGreeting(format(currentTime, 'HH:mm'))); soundService.playClick(); }} />;
      default: return <DigitalClock currentTime={currentTime} />;
    }
  };

  const menuItems = [
    { id: 'clock', icon: <ClockIcon />, label: '시계' },
    { id: 'alarm', icon: <AlarmClock />, label: '알람' },
    { id: 'timer', icon: <TimerIcon />, label: '타이머' },
    { id: 'stopwatch', icon: <TimerReset />, label: '스톱워치' },
    { id: 'ai', icon: <Sparkles />, label: '오늘의 응원' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden flex bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar for Desktop */}
      <nav className="hidden md:flex w-24 lg:w-64 flex-col glass z-20 border-r border-white/40">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-pink-500 p-2 rounded-2xl text-white shadow-lg shadow-pink-200">
            <Sparkles size={24} />
          </div>
          <span className="hidden lg:block font-extrabold text-2xl text-pink-600 tracking-tight">Dreamy</span>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 translate-x-2' : 'text-pink-300 hover:bg-pink-50 hover:text-pink-500'}`}
            >
              {item.icon}
              <span className="hidden lg:block font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4">
          <button 
            onClick={handleMuteToggle}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${isMuted ? 'text-gray-400 bg-gray-100' : 'text-pink-500 bg-pink-50'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <span className="hidden lg:block font-bold text-sm">{isMuted ? '음소거 중' : '소리 켜짐'}</span>
          </button>

          <div className="p-4 rounded-3xl border border-pink-100 bg-white/50 text-center hidden lg:block">
            <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mb-1">Current Date</p>
            <p className="text-sm font-extrabold text-pink-600">{format(currentTime, 'yyyy년 M월 d일', { locale: ko })}</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center p-6 bg-white/50 backdrop-blur-md border-b border-white/40">
          <div className="flex items-center gap-2">
            <Sparkles className="text-pink-500" size={24} />
            <span className="font-extrabold text-xl text-pink-600">Dreamy</span>
          </div>
          <div className="flex gap-4">
            <button onClick={handleMuteToggle} className="p-2 text-pink-400">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-pink-500">
              <Menu size={28} />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 p-6 md:p-12 lg:p-20 flex flex-col h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex-1 h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Message */}
        {activeTab !== 'ai' && aiMessage && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-10 right-10 hidden lg:block glass p-6 rounded-[2.5rem] shadow-2xl max-w-sm border-l-4 border-l-pink-500"
          >
            <div className="flex items-start gap-4">
              <div className="bg-pink-100 p-2 rounded-xl text-pink-500">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Daily Note</p>
                <p className="text-pink-700 text-sm leading-relaxed font-medium">
                  {aiMessage}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm z-30"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-3/4 bg-white z-40 p-10 flex flex-col shadow-2xl"
            >
              <button onClick={() => setIsSidebarOpen(false)} className="self-end p-2 text-pink-300 mb-8"><X size={32} /></button>
              <div className="space-y-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { changeTab(item.id as TabType); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-6 text-2xl font-bold transition-all ${activeTab === item.id ? 'text-pink-500 scale-105' : 'text-pink-200'}`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Alarm Overlay */}
      <AnimatePresence>
        {ringingAlarm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pink-600 flex flex-col items-center justify-center p-8 text-white text-center"
          >
             <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="mb-12"><AlarmClock size={120} /></motion.div>
             <h2 className="text-8xl font-black mb-4 tabular-nums">{ringingAlarm.time}</h2>
             <p className="text-4xl font-bold mb-12 opacity-80">{ringingAlarm.label}</p>
             <div className="bg-white/20 p-8 rounded-[3rem] backdrop-blur-xl mb-12 max-w-2xl text-xl italic font-medium leading-relaxed">"{aiMessage}"</div>
             <button onClick={dismissAlarm} className="bg-white text-pink-600 px-16 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all">알람 해제</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
