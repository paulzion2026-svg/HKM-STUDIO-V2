
import React, { useState, useEffect } from 'react';
import { StreamDestination } from '../types';

interface FooterProps {
  isLive: boolean; isConnecting: boolean; onGoLive: () => void;
  isRecording: boolean; isRecordConnecting: boolean; onToggleRecording: () => void;
  onOpenRecordingSettings: () => void; onOpenMultiCorder: () => void; onAddInput: () => void;
  isMonitoring: boolean; onToggleMonitor: () => void;
  performanceMode: boolean; onTogglePerformance: () => void;
  streamDestinations: StreamDestination[]; gpuEnabled?: boolean;
  onOpenStreamSettings: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  isLive, isConnecting, onGoLive, 
  isRecording, isRecordConnecting, onToggleRecording, onOpenRecordingSettings,
  onOpenMultiCorder, onAddInput, isMonitoring, onToggleMonitor, performanceMode, onTogglePerformance, streamDestinations = [],
  gpuEnabled = true, onOpenStreamSettings
}) => {
  const [time, setTime] = useState(new Date());
  const [streamTimer, setStreamTimer] = useState(0);
  const [recordTimer, setRecordTimer] = useState(0);
  const [stats, setStats] = useState({ fps: 60.0, hkmCpu: 12, gpu: 28, totalTx: 4.5 });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const timerInterval = setInterval(() => {
      setStreamTimer(prev => isLive ? prev + 1 : 0);
      setRecordTimer(prev => isRecording ? prev + 1 : 0);
      setStats(prev => ({
        fps: 59.94 + (Math.random() * 0.1),
        hkmCpu: Math.max(5, Math.min(45, prev.hkmCpu + (Math.random() * 4 - 2))),
        gpu: gpuEnabled ? Math.max(10, Math.min(60, prev.gpu + (Math.random() * 6 - 3))) : 0,
        totalTx: isLive ? 4.5 + (Math.random() * 0.2) : 0
      }));
    }, 1000);
    return () => { clearInterval(t); clearInterval(timerInterval); };
  }, [isLive, isRecording, gpuEnabled]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const ActionBtn = ({ label, color, isActive, onClick, onSettings, showGear = true }: any) => (
    <div className="flex h-10 group">
       <button onClick={onClick} className={`px-6 h-full text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-l-xl border-y border-l border-white/5 ${isActive ? color + ' text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}>
          {label}
       </button>
       {showGear && (
         <button onClick={onSettings} className={`w-10 h-full border border-white/5 rounded-r-xl transition-all flex items-center justify-center ${isActive ? color + ' border-l-black/20 text-white/50 hover:text-white' : 'bg-white/5 text-slate-700 hover:text-slate-400'}`}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            </svg>
         </button>
       )}
    </div>
  );

  return (
    <footer className="flex flex-col shrink-0 bg-slate-950 border-t border-white/5 select-none relative z-50">
      {/* Action Strip */}
      <div className="h-16 px-6 flex items-center justify-between bg-gradient-to-r from-black/60 to-transparent">
         <div className="flex items-center gap-4">
            <button onClick={onAddInput} className="h-10 px-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20">+ ADD SIGNAL</button>
            <ActionBtn label={isLive ? `LIVE: ${formatDuration(streamTimer)}` : 'BROADCAST'} isActive={isLive} color="bg-red-600" onClick={onGoLive} onSettings={onOpenStreamSettings} />
            <ActionBtn label={isRecording ? `REC: ${formatDuration(recordTimer)}` : 'RECORD'} isActive={isRecording} color="bg-amber-500" onClick={onToggleRecording} onSettings={onOpenRecordingSettings} />
            <button onClick={onOpenMultiCorder} className="h-10 px-6 bg-white/5 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all">MULTICORDER</button>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="h-10 px-6 flex items-center bg-black/40 rounded-xl border border-white/5">
               <span className="text-indigo-400 font-mono text-xs font-black tracking-widest">{time.toLocaleTimeString([], { hour12: false })}</span>
            </div>
         </div>
      </div>

      {/* Telemetry Ribbon */}
      <div className="h-8 px-8 flex items-center justify-between border-t border-white/5 bg-black/40">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Master FPS</span>
               <span className="text-[10px] font-mono text-emerald-500 font-black">{stats.fps.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">CPU Engine</span>
               <span className="text-[10px] font-mono text-slate-400 font-black">{stats.hkmCpu.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">GPU CORE</span>
               <span className="text-[10px] font-mono text-indigo-400 font-black">{stats.gpu.toFixed(0)}%</span>
            </div>
            {isLive && (
              <div className="flex items-center gap-2 px-3 border-l border-white/10">
                 <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">TX:</span>
                 <span className="text-[10px] font-mono text-white font-black">{stats.totalTx.toFixed(1)} <span className="text-[8px] text-slate-500">Mbps</span></span>
              </div>
            )}
         </div>

         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${gpuEnabled ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-slate-800'}`}></div>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Backend: {gpuEnabled ? 'NVENC CORE v2' : 'Software Core'}</span>
            </div>
            <div className="text-[8px] font-black text-slate-800 uppercase tracking-[0.5em]">HKM Studio v4.2 PRO</div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
