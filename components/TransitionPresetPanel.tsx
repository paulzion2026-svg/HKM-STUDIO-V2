
import React, { useState } from 'react';
import { TransitionPreset, TransitionType } from '../types';

interface TransitionPresetPanelProps {
  presets: TransitionPreset[];
  currentType: TransitionType;
  currentDuration: number;
  onApplyPreset: (preset: TransitionPreset) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
  onClose: () => void;
}

const TransitionPresetPanel: React.FC<TransitionPresetPanelProps> = ({
  presets,
  currentType,
  currentDuration,
  onApplyPreset,
  onSavePreset,
  onDeletePreset,
  onClose
}) => {
  const [newName, setNewName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onSavePreset(newName.trim());
      setNewName('');
    }
  };

  const transitionIcons: Record<string, string> = {
    fade: '✨',
    merge: '🌀',
    wipe: '↔️',
    zoom: '🔎',
    cube: '🧊',
    flow: '🌊',
    slide: '➡️',
    door: '🚪',
    flip: '🔄',
    spin: '🎡',
    glitch: '👾'
  };

  return (
    <div className="p-4 flex flex-col gap-6 h-full relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Advanced Transition Engine</h3>
          <div className="flex gap-2">
             <div className="px-2 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400">GPU ACCELERATED</div>
             <div className="px-2 py-1 bg-blue-900/20 border border-blue-500/30 rounded text-[9px] font-bold text-blue-400">HKM V2 ENGINE</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded transition-all"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capture Current Engine State */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center text-blue-400">⚡</div>
            <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Capture Engine State</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-[10px]">
             <div className="bg-[#262626] p-3 rounded border border-[#444] flex flex-col gap-1">
                <span className="text-slate-500 uppercase font-black text-[8px] tracking-widest">Transition Effect</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{transitionIcons[currentType] || '🎬'}</span>
                  <span className="text-white font-black uppercase tracking-widest text-[11px]">{currentType}</span>
                </div>
             </div>
             <div className="bg-[#262626] p-3 rounded border border-[#444] flex flex-col gap-1">
                <span className="text-slate-500 uppercase font-black text-[8px] tracking-widest">Timing Speed</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span className="text-white font-black text-[11px]">{currentDuration}ms</span>
                </div>
             </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Preset Label</label>
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. WORSHIP FADE SLOW"
                className="bg-[#2d2d2d] border border-[#444] rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 font-bold"
              />
            </div>
            <button 
              type="submit"
              disabled={!newName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-[11px] font-black py-3 rounded uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Store in Memory
            </button>
          </form>
        </div>

        {/* Saved Presets Library */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Presets Library</h4>
            <span className="text-[9px] text-slate-600 font-black">{presets.length} / 64 SLOTS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {presets.map(preset => (
              <div 
                key={preset.id}
                className={`bg-[#2d2d2d] border rounded-lg p-3 flex flex-col gap-3 group transition-all relative ${
                  currentType === preset.type && currentDuration === preset.duration 
                  ? 'border-blue-500 bg-blue-900/10' 
                  : 'border-[#3f3f3f] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-sm shrink-0">{transitionIcons[preset.type] || '🎬'}</span>
                    <span className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{preset.name}</span>
                  </div>
                  <button 
                    onClick={() => onDeletePreset(preset.id)}
                    className="text-slate-600 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-black/60 px-2 py-0.5 rounded text-blue-400 font-black uppercase tracking-widest border border-blue-900/30">{preset.type}</span>
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{preset.duration}ms</span>
                </div>

                <button 
                  onClick={() => onApplyPreset(preset)}
                  className={`mt-1 w-full text-[10px] font-black py-2 rounded-md uppercase tracking-widest transition-all ${
                    currentType === preset.type && currentDuration === preset.duration
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                    : 'bg-[#3a3a3a] hover:bg-slate-700 text-slate-300 border border-black/20'
                  }`}
                >
                  Recall
                </button>
              </div>
            ))}
            {presets.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-[#333] rounded-xl">
                <span className="text-3xl mb-4">📺</span>
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Empty Library</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPresetPanel;
