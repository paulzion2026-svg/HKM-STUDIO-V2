
import React, { useState, useEffect } from 'react';
import { MultiCorderSettings, StudioSource, MultiCorderInput, RecordingFormat } from '../types';

interface MultiCorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: StudioSource[];
  settings: MultiCorderSettings;
  onSave: (settings: MultiCorderSettings) => void;
}

const MultiCorderModal: React.FC<MultiCorderModalProps> = ({ isOpen, onClose, sources, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<MultiCorderSettings>(settings);
  const [inputs, setInputs] = useState<MultiCorderInput[]>(() => {
    // Generate output clean feeds
    const outputs = [1, 2, 3, 4].map(i => ({
      id: `out-${i}`,
      name: `Output ${i}`,
      enabled: false,
      duration: 0,
      droppedFrames: 0,
      folder: settings.baseFolder,
      status: 'idle' as const
    }));
    return outputs;
  });

  if (!isOpen) return null;

  const formats: RecordingFormat[] = ['AVI', 'HKM RAW', 'MKV', 'MP4', 'FFMPEG'];

  const toggleInput = (id: string) => {
    setInputs(prev => prev.map(inp => inp.id === id ? { ...inp, enabled: !inp.enabled } : inp));
  };

  const updateSetting = (updates: Partial<MultiCorderSettings>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
  };

  const handleStart = () => {
    updateSetting({ isRecording: !localSettings.isRecording });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0c0d10] border border-[#d4af37]/20 rounded-sm shadow-[0_0_100px_rgba(0,0,0,1)] w-full max-w-4xl h-[720px] flex flex-col overflow-hidden text-slate-300 font-sans select-none animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <header className="h-10 bg-[#1a1c21] border-b border-black flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 text-[#d4af37]">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,17L7,12H10V8H14V12H17L12,17M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" /></svg>
             </div>
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d4af37]">HKM MultiCorder Command</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-all text-xl">✕</button>
        </header>

        {/* Top Control Bar */}
        <div className="p-1 bg-[#16181d] border-b border-black flex items-center gap-1 shrink-0 overflow-x-auto scrollbar-hide">
          {formats.map(f => (
            <button
              key={f}
              onClick={() => updateSetting({ format: f })}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${
                localSettings.format === f ? 'bg-[#3a612d] border-[#4a713d] text-white shadow-inner' : 'bg-black/40 border-white/5 text-slate-600 hover:text-slate-400'
              }`}
            >
              {f}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 pr-2">
             <button 
               onClick={handleStart}
               className={`w-32 h-14 rounded-sm font-black text-xs uppercase transition-all shadow-xl border ${
                 localSettings.isRecording ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-[#2a2d34] border-black text-[#d4af37] hover:bg-[#353942]'
               }`}
             >
               {localSettings.isRecording ? 'STOP ALL' : 'START ALL'}
             </button>
          </div>
        </div>

        {/* Dynamic Settings Area */}
        <div className="p-6 flex flex-col gap-6 bg-[#0c0d10] border-b border-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Format Specifics */}
            <div className="flex flex-col gap-4">
              {localSettings.format === 'FFMPEG' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Codec Profile</label>
                    <select value={localSettings.codec} onChange={(e) => updateSetting({ codec: e.target.value })} className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-blue-400 outline-none">
                       <option>MPEG-2</option>
                       <option>MP4 x264 AAC</option>
                       <option>MP4 NVENC AAC</option>
                       <option>ProRes</option>
                       <option>VC-3</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Video Quality</label>
                    <select value={localSettings.videoQuality} onChange={(e) => updateSetting({ videoQuality: e.target.value })} className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-slate-300 outline-none">
                       <option>2M</option><option>4M</option><option>8M</option><option>12M</option>
                    </select>
                  </div>
                </>
              )}

              {localSettings.format === 'MP4' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Video Bit Rate (Mbps)</label>
                    <input type="number" value={8} className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs text-white outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">H.264 Profile</label>
                    <select className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-slate-300 outline-none">
                       <option>H264Baseline</option><option>H264High</option>
                    </select>
                  </div>
                </>
              )}

              {(localSettings.format === 'HKM RAW' || localSettings.format === 'MKV') && (
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Matrix Codec</label>
                      <select className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-blue-400 outline-none">
                         <option>HKM Video Codec V2</option>
                      </select>
                   </div>
                   <div className="bg-black/40 border border-white/5 p-4 rounded-sm flex flex-col gap-3">
                      <label className="text-[9px] font-black text-[#d4af37] uppercase tracking-widest text-center">Compression Quality: {localSettings.compressionQuality}%</label>
                      <input type="range" min="0" max="100" value={localSettings.compressionQuality} onChange={(e) => updateSetting({ compressionQuality: parseInt(e.target.value) })} className="w-full accent-blue-500" />
                      <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase">
                         <span>DRAFT</span>
                         <span>LOSSLESS</span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Column 2: Shared Audio/Timing */}
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Audio Source</label>
                  <select value={localSettings.audioSource} onChange={(e) => updateSetting({ audioSource: e.target.value })} className="bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-slate-300 outline-none">
                     <option>Input</option>
                     <option>Master</option>
                     <option>Bus A</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">New File Every</label>
                  <div className="flex items-center gap-2">
                    <select value={localSettings.newFileEvery} onChange={(e) => updateSetting({ newFileEvery: e.target.value })} className="flex-1 bg-black border border-white/10 rounded-sm px-3 py-2 text-xs font-bold text-slate-300 outline-none">
                      <option>None</option><option>60</option><option>120</option>
                    </select>
                    <span className="text-[9px] font-black text-slate-700 uppercase">Minutes</span>
                  </div>
               </div>
               <label className="flex items-center gap-3 cursor-pointer group mt-2">
                  <input type="checkbox" checked={localSettings.recordNdiOriginal} onChange={(e) => updateSetting({ recordNdiOriginal: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tight">Record NDI in original MOV format</span>
               </label>
            </div>

            {/* Column 3: Global Buttons */}
            <div className="flex flex-col gap-3 justify-center">
               <button onClick={() => updateSetting({ wavFileRecord: !localSettings.wavFileRecord })} className={`flex items-center gap-3 px-6 py-3 rounded-sm border transition-all ${localSettings.wavFileRecord ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/40 border-white/10 text-slate-600 hover:text-slate-400'}`}>
                  <span className="text-sm">🔊</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">WAV File Record Master</span>
               </button>
               <button onClick={() => updateSetting({ showUnsupported: !localSettings.showUnsupported })} className={`flex items-center gap-3 px-6 py-2 rounded-sm transition-all ${localSettings.showUnsupported ? 'text-white' : 'text-slate-700'}`}>
                  <input type="checkbox" checked={localSettings.showUnsupported} readOnly className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Show unsupported inputs</span>
               </button>
            </div>
          </div>
        </div>

        {/* Tactical Grid Table */}
        <div className="flex-1 bg-black overflow-hidden flex flex-col">
           <div className="h-8 bg-[#16181d] border-b border-black flex items-center px-4 shrink-0 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <div className="w-12 shrink-0">Rec</div>
              <div className="flex-1 px-4">Input Signal</div>
              <div className="w-24 px-4 text-center">Duration</div>
              <div className="w-32 px-4 text-center">Lost Frames</div>
              <div className="w-64 px-4">Storage Destination</div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
              {inputs.map((input) => (
                <div key={input.id} onClick={() => toggleInput(input.id)} className={`flex items-center px-4 py-3 cursor-pointer transition-all ${input.enabled ? 'bg-blue-900/10' : 'hover:bg-white/5'}`}>
                   <div className="w-12 shrink-0 flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center ${input.enabled ? 'bg-blue-600 border-blue-400' : 'bg-black'}`}>
                         {input.enabled && <span className="text-[10px] text-white">✓</span>}
                      </div>
                   </div>
                   <div className="flex-1 px-4 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${localSettings.isRecording && input.enabled ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse' : 'bg-slate-800'}`}></div>
                      <span className={`text-[11px] font-black uppercase tracking-tight ${input.enabled ? 'text-white' : 'text-slate-600'}`}>{input.name}</span>
                   </div>
                   <div className="w-24 px-4 text-center font-mono text-[11px] text-slate-500 tabular-nums">00:00:00</div>
                   <div className="w-32 px-4 text-center font-mono text-[11px] text-red-900/50">0</div>
                   <div className="w-64 px-4 text-[10px] font-mono text-slate-700 truncate">{input.folder}</div>
                </div>
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center px-4 py-3 opacity-10 grayscale pointer-events-none">
                   <div className="w-12 shrink-0 flex items-center justify-center"><div className="w-4 h-4 rounded-sm border border-white/20 bg-black"></div></div>
                   <div className="flex-1 px-4 text-[11px] font-black uppercase text-slate-500">Virtual Slot {i+5}</div>
                   <div className="w-24 px-4 text-center font-mono text-[11px] text-slate-800">--:--:--</div>
                   <div className="w-32 px-4 text-center font-mono text-[11px] text-slate-800">-</div>
                   <div className="w-64 px-4 text-[10px] font-mono text-slate-900 truncate">UNASSIGNED</div>
                </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <footer className="h-16 bg-[#16181d] border-t border-black flex items-center justify-between px-6 shrink-0">
           <button className="px-10 py-2 bg-[#2a2d34] border border-black text-[11px] font-black uppercase text-[#d4af37] tracking-widest hover:text-white transition-all">Change Base Folder</button>
           <div className="flex gap-2">
              <button onClick={() => { onSave(localSettings); onClose(); }} className="px-16 py-2 bg-[#d4af37] border border-black text-[11px] font-black uppercase text-black tracking-[0.2em] shadow-xl hover:brightness-110 active:translate-y-px transition-all">Apply & CLOSE</button>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default MultiCorderModal;
