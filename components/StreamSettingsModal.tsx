
import React, { useState } from 'react';
import { StreamDestination } from '../types';

interface StreamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: StreamDestination[];
  onUpdateDestinations: (destinations: StreamDestination[]) => void;
}

const StreamSettingsModal: React.FC<StreamSettingsModalProps> = ({ isOpen, onClose, destinations, onUpdateDestinations }) => {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [localDests, setLocalDests] = useState<StreamDestination[]>(() => {
    const initial = [...destinations];
    while (initial.length < 5) {
      initial.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `FEED ${initial.length + 1}`,
        platform: 'rtmp', url: '', key: '', enabled: false, status: 'idle',
        quality: 'H264 720p 2.5mbps AAC 128kbps', encoder: 'FFMPEG', useHardwareEncoder: true
      });
    }
    return initial;
  });

  if (!isOpen) return null;

  const dest = localDests[activeChannelIdx];
  const updateCurrentDest = (updates: Partial<StreamDestination>) => {
    setLocalDests(prev => prev.map((d, i) => i === activeChannelIdx ? { ...d, ...updates } : d));
  };

  const handleSave = () => {
    onUpdateDestinations(localDests);
    onClose();
  };

  const StyledSelect = ({ value, onChange, options, label }: any) => (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-violet-700 uppercase tracking-widest px-1">{label}</label>
      <div className="relative group">
        <select 
          value={value} 
          onChange={onChange}
          className="w-full bg-white border border-teal-200 rounded-2xl px-6 py-4 text-sm text-violet-950 font-bold outline-none cursor-pointer shadow-sm hover:border-violet-500 transition-all appearance-none"
        >
          {options.map((opt: any) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400 group-hover:text-violet-600 transition-colors">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-violet-950/40 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-emerald-50 border border-teal-200 rounded-[40px] shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-white/50">
        
        <header className="h-24 px-10 flex items-center justify-between border-b border-teal-200 bg-cyan-100/30 shrink-0">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-violet-700 flex items-center justify-center text-white shadow-xl ring-1 ring-emerald-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2 10h.01m19.98 0H22" /></svg>
             </div>
             <div>
                <h2 className="text-xl font-black tracking-tighter text-violet-950 uppercase italic leading-none">Broadcast Matrix</h2>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-[0.4em] leading-none mt-1">Dual-Core Transcode</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-teal-200 text-teal-500 hover:text-violet-950 transition-all flex items-center justify-center text-2xl shadow-sm">✕</button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Channel Selector */}
          <div className="w-24 border-r border-teal-200 bg-violet-800/20 flex flex-col items-center py-10 gap-5 shrink-0 overflow-y-auto custom-scrollbar">
             {[1, 2, 3, 4, 5].map((n, i) => (
               <button 
                 key={n}
                 onClick={() => setActiveChannelIdx(i)}
                 className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all border shrink-0 ${
                   activeChannelIdx === i ? 'bg-emerald-400 border-emerald-300 text-violet-950 shadow-xl scale-110' : 'bg-white/40 border-teal-100 text-teal-600 hover:bg-emerald-200 hover:text-violet-950'
                 }`}
               >
                 {n}
               </button>
             ))}
          </div>

          <div className="flex-1 p-14 overflow-y-auto bg-emerald-50 custom-scrollbar">
            <div className="space-y-12 max-w-2xl mx-auto pb-10">
              <section className="space-y-6">
                <StyledSelect 
                  label="Service Provider"
                  value={dest.platform}
                  onChange={(e: any) => updateCurrentDest({ platform: e.target.value as any })}
                  options={[
                    { label: 'Custom RTMP', value: 'rtmp' },
                    { label: 'YouTube Live', value: 'youtube' },
                    { label: 'Facebook Watch', value: 'facebook' },
                    { label: 'Twitch.tv', value: 'twitch' }
                  ]}
                />
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-violet-700 uppercase tracking-widest px-1">Endpoint URL</label>
                   <input 
                     type="text" 
                     value={dest.url}
                     onChange={(e) => updateCurrentDest({ url: e.target.value })}
                     className="w-full bg-white border border-teal-200 rounded-[20px] px-6 py-4 text-sm text-violet-700 font-mono outline-none shadow-sm focus:border-violet-500 transition-all"
                     placeholder="rtmp://server.address/live"
                   />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-violet-700 uppercase tracking-widest px-1">Stream Encryption Key</label>
                   <input 
                     type="password" 
                     value={dest.key}
                     onChange={(e) => updateCurrentDest({ key: e.target.value })}
                     className="w-full bg-white border border-teal-200 rounded-[20px] px-6 py-4 text-sm text-violet-950 font-bold outline-none shadow-sm focus:border-violet-500 transition-all"
                     placeholder="••••••••••••••••"
                   />
                </div>
              </section>

              <section className="bg-cyan-100/30 border border-teal-100 rounded-[32px] p-10 space-y-8 shadow-inner">
                 <div className="flex items-center justify-between border-b border-teal-200 pb-4">
                    <h3 className="text-[11px] font-black text-violet-700 uppercase tracking-[0.3em]">H.264 Encoder Matrix</h3>
                    <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-300">
                       <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">GPU Optimized</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8">
                    <StyledSelect 
                      label="Quality Preset"
                      value={dest.quality}
                      onChange={(e: any) => updateCurrentDest({ quality: e.target.value })}
                      options={['H264 1080p 6mbps AAC 128kbps', 'H264 720p 2.5mbps AAC 128kbps', 'Vertical 1920p 6mbps Main']}
                    />
                    <StyledSelect 
                      label="Engine Core"
                      value={dest.encoder}
                      onChange={(e: any) => updateCurrentDest({ encoder: e.target.value as any })}
                      options={['FFMPEG Native Core', 'FMLE Hardware Legacy']}
                    />
                 </div>

                 <div 
                   onClick={() => updateCurrentDest({ useHardwareEncoder: !dest.useHardwareEncoder })}
                   className="flex items-center gap-4 group cursor-pointer"
                 >
                    <div className={`w-14 h-7 rounded-full relative transition-all duration-300 shadow-inner ${dest.useHardwareEncoder ? 'bg-emerald-500 shadow-md' : 'bg-teal-200'}`}>
                       <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${dest.useHardwareEncoder ? 'left-8' : 'left-1'}`}></div>
                    </div>
                    <span className="text-xs font-black text-violet-950 uppercase tracking-tight group-hover:text-violet-600 transition-colors">Bypass CPU (Native GPU NVENC)</span>
                 </div>
              </section>
            </div>
          </div>
        </div>

        <footer className="h-28 px-12 flex items-center justify-between border-t border-teal-200 bg-cyan-100/50 shrink-0">
           <div className="flex gap-4">
              <button className="px-10 py-4 rounded-[20px] bg-violet-700 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-violet-600 transition-all shadow-xl ring-1 ring-emerald-400 active:scale-95">Commit Signal</button>
              <button className="px-8 py-4 rounded-[20px] bg-white border border-teal-200 text-teal-600 text-xs font-black uppercase tracking-widest hover:bg-emerald-100 hover:text-violet-950 transition-all">Start 0{activeChannelIdx + 1}</button>
           </div>
           <button onClick={handleSave} className="px-14 py-4 rounded-[20px] bg-violet-950 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-black shadow-xl transition-all active:scale-95">Confirm Routing</button>
        </footer>
      </div>
    </div>
  );
};

export default StreamSettingsModal;
