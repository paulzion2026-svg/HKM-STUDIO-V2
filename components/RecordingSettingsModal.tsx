
import React, { useState } from 'react';
import { RecordingSettings, RecordingFormat } from '../types';

interface RecordingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RecordingSettings;
  onSave: (settings: RecordingSettings) => void;
}

const RecordingSettingsModal: React.FC<RecordingSettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<RecordingSettings>(settings);

  if (!isOpen) return null;

  const formats: RecordingFormat[] = ['MP4', 'FFMPEG', 'AVI', 'WMV', 'WMV Streaming', 'vMix AVI'];
  const updateSettings = (updates: Partial<RecordingSettings>) => setLocalSettings(prev => ({ ...prev, ...updates }));

  // Fix: Made children optional to prevent JSX parsing errors in some environments
  const ControlGroup = ({ label, children }: { label: string; children?: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-violet-700 uppercase tracking-[0.2em] ml-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-violet-950/40 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-emerald-50 border border-teal-200 rounded-[40px] shadow-[0_40px_100px_rgba(4,120,87,0.2)] w-full max-w-5xl h-full max-h-[90vh] flex overflow-hidden ring-1 ring-white/50">
        
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-violet-700 border-r border-teal-200 flex flex-col py-12 px-6 gap-2 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="mb-10 px-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-xl ring-1 ring-emerald-300/30">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
             </div>
             <h2 className="text-white font-black text-xl tracking-tighter uppercase italic leading-none">Archive</h2>
             <p className="text-[9px] text-violet-200 font-bold uppercase tracking-[0.3em] mt-1">Capture Engine</p>
          </div>
          
          <div className="flex flex-col gap-1 flex-1">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => updateSettings({ format: f })}
                className={`px-5 py-4 text-left text-xs font-black rounded-2xl transition-all uppercase tracking-tight border shrink-0 ${
                  localSettings.format === f 
                  ? 'bg-emerald-400 border-emerald-300 text-violet-950 shadow-xl translate-x-2' 
                  : 'bg-violet-800/40 border-transparent text-violet-200 hover:bg-violet-600 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-violet-500/30 shrink-0">
             <button 
               onClick={() => updateSettings({ wavFileRecord: !localSettings.wavFileRecord })}
               className={`w-full py-5 rounded-2xl flex flex-col items-center gap-2 transition-all border group shadow-sm ${
                 localSettings.wavFileRecord ? 'bg-amber-400 border-amber-300 text-violet-950' : 'bg-violet-800/50 border-violet-500 text-violet-200 hover:border-white hover:text-white'
               }`}
             >
               <span className="text-xl">🔊</span>
               <span className="text-[10px] font-black uppercase tracking-widest">WAV Master</span>
             </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-emerald-50 overflow-hidden">
          <header className="h-24 px-12 flex items-center justify-between border-b border-teal-200 bg-cyan-100/20 shrink-0">
             <div className="flex items-center gap-4 bg-emerald-100/60 p-1.5 rounded-[20px] border border-teal-200 shadow-inner">
                {['1', '2'].map(out => (
                  <button 
                    key={out} 
                    onClick={() => updateSettings({ output: out })} 
                    className={`px-8 py-3 rounded-2xl text-[11px] font-black transition-all ${localSettings.output === out ? 'bg-white text-violet-700 shadow-md ring-1 ring-teal-200' : 'text-teal-600 hover:text-violet-700'}`}
                  >
                    FEED 0{out}
                  </button>
                ))}
             </div>
             <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-teal-200 text-teal-500 hover:text-violet-950 transition-all flex items-center justify-center text-xl shadow-sm">✕</button>
          </header>

          <div className="flex-1 p-14 overflow-y-auto custom-scrollbar">
             <div className="max-w-2xl space-y-10 pb-10">
                <ControlGroup label="Target File Path">
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={localSettings.filename} 
                        onChange={(e) => updateSettings({ filename: e.target.value })} 
                        className="flex-1 bg-white border border-teal-300 rounded-2xl px-6 py-4 text-xs text-violet-700 font-mono focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all shadow-sm" 
                      />
                      <button className="px-8 rounded-2xl bg-violet-700 text-[11px] font-black text-white hover:bg-violet-800 transition-all uppercase tracking-widest shadow-lg">Browse</button>
                   </div>
                </ControlGroup>

                <div className="grid grid-cols-2 gap-10">
                   <ControlGroup label="Capture Resolution">
                      <div className="relative group">
                        <select 
                          value={localSettings.size} 
                          onChange={(e) => updateSettings({ size: e.target.value })} 
                          className="w-full bg-white border border-teal-300 rounded-2xl px-6 py-4 text-sm text-violet-950 font-bold outline-none cursor-pointer hover:border-violet-500 transition-all shadow-sm appearance-none"
                        >
                           <option>1280x720</option>
                           <option>1920x1080</option>
                           <option>3840x2160</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400 group-hover:text-violet-600">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                   </ControlGroup>
                   <ControlGroup label="Frame Synchronization">
                      <div className="relative group">
                        <select 
                          value={localSettings.frameRate} 
                          onChange={(e) => updateSettings({ frameRate: e.target.value })} 
                          className="w-full bg-white border border-teal-300 rounded-2xl px-6 py-4 text-sm text-violet-950 font-bold outline-none cursor-pointer hover:border-violet-500 transition-all shadow-sm appearance-none"
                        >
                           <option>PAL 25p</option>
                           <option>NTSC 30p</option>
                           <option>NTSC 60p</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-teal-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                   </ControlGroup>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   {[
                     { field: 'useHardwareEncoder', label: 'GPU Accelerator', desc: 'Active Native NVENC' },
                     { field: 'faultTolerant', label: 'Data Guard', desc: 'Secure Real-time Commit' }
                   ].map(item => (
                     <div key={item.field} onClick={() => updateSettings({ [item.field]: !(localSettings as any)[item.field] })} className="p-6 rounded-[24px] bg-cyan-100/50 border border-teal-100 flex items-center justify-between hover:border-violet-400 hover:bg-white transition-all cursor-pointer group shadow-sm">
                        <div className="space-y-1">
                           <span className="block text-xs font-black text-violet-950 uppercase tracking-tight">{item.label}</span>
                           <span className="block text-[9px] text-teal-600 font-bold uppercase">{item.desc}</span>
                        </div>
                        <div className={`w-14 h-7 rounded-full relative transition-all duration-300 ${ (localSettings as any)[item.field] ? 'bg-emerald-500' : 'bg-teal-200' }`}>
                           <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${ (localSettings as any)[item.field] ? 'left-8' : 'left-1' }`}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <footer className="h-28 px-12 border-t border-teal-200 flex items-center justify-end gap-6 bg-cyan-100/40 shrink-0">
             <button onClick={onClose} className="text-[11px] font-black uppercase text-teal-600 tracking-widest hover:text-violet-950 transition-all px-4">Dismiss</button>
             <button onClick={() => { onSave(localSettings); onClose(); }} className="px-16 py-4 rounded-[20px] bg-violet-700 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-violet-800 hover:scale-[1.02] active:scale-95 transition-all ring-1 ring-emerald-400">Apply Settings</button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default RecordingSettingsModal;
