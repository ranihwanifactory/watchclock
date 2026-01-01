
export interface Alarm {
  id: string;
  time: string; // HH:mm
  label: string;
  enabled: boolean;
  days: string[];
}

export type TabType = 'clock' | 'alarm' | 'timer' | 'stopwatch' | 'ai';

export interface TimerState {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
}
