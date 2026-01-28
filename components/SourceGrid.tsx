import React, { useEffect, useRef, useState, useMemo } from 'react';
import { StudioSource } from '../types';
import AudioMeter from './AudioMeter';

interface InputThumbProps {
  source: StudioSource;
  index: number;
  isProgram: boolean;
  isPreview: boolean;
  performanceMode: boolean;
  gpuAcceleration: boolean;
  activeLayers: number[];
  onToggleLayer: (layer: number) => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onRemove: () => void;
  onToggleLoop: () => void;
  onTogglePlay: () => void;
  onToggleMonitor: () => void;
  onToggleMute: () => void;
  onSetVolume: (vol: number) => void;
  onOpenSettings: () => void;
  // Professional refinement: renaming onQuick to onQuickAction for consistency
  onQuickAction: () => void;
  onSeek: (id: string, time: number) => void;
  sourceTimesRef: React.RefObject<Map<string, number> | null>;
}

const InputThumb: React.FC<InputThumbProps> = ({ 
  // Professional refinement: updated destructuring to use onQuickAction
  source, index, isProgram, isPreview, performanceMode, gpuAcceleration, activeLayers = [], onToggleLayer, onClick, onDoubleClick, onRemove, onToggleLoop, onTogglePlay, onToggleMonitor, onToggleMute, onSetVolume, onOpenSettings, onQuickAction, onSeek, sourceTimesRef
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const markIn = source.settings?.markIn;
  const markOut = source.settings?.markOut;

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail.id === source.id && !isDragging) {
        setCurrentTime(e.detail.time);
        if (videoRef.current) videoRef.current.currentTime = e.detail.time;
      }
    };
    window.addEventListener('hkm_seek_sync', handler);
    return () => window.removeEventListener('hkm_seek_sync', handler);
  }, [source.id, isDragging]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !source) return;
    if (source.stream) { 
      if (el.srcObject !== source.stream) el.srcObject = source.stream;
    }
    else if (source.mediaUrl) {
      if (!el.src.includes(source.mediaUrl)) el.src = source.mediaUrl;
    }
    el.volume = (source.volume ?? 100) / 100;
  }, [source]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !source) return;
    
    if (!source.isPaused) {
      if (el.paused) el.play().catch(() => {});
    } else {
      if (!el.paused) el.pause();
    }
  }, [source.isPaused, source.id]);
  
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !source) return;
    const handleTimeUpdate = () => { 
      if (!el.paused && !isDragging) { 
        setCurrentTime(el.currentTime); 
        sourceTimesRef.current?.set(source.id, el.currentTime); 

        if (markOut !== undefined && el.currentTime >= markOut) {
          const restartPos = markIn !== undefined ? markIn : 0;
          el.currentTime = restartPos;
          setCurrentTime(restartPos);
          onSeek(source.id, restartPos);
        }
      } 
    };
    const handleLoadedMetadata = () => { 
      if (el.duration) setDuration(el.duration); 
      const stored = sourceTimesRef.current?.get(source.id);
      const markInVal = source.settings?.markIn || 0;
      const initialTime = (stored !== undefined && stored >= markInVal) ? stored : markInVal;
      el.currentTime = initialTime;
      setCurrentTime(initialTime);
    };
    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [source.id, isDragging, sourceTimesRef, markIn, markOut, onSeek]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
    onSeek(source.id, val);
  };

  const formatTimeCompact = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isMedia = ['video', 'audio'].includes(source.type);
  const ButtonBase = "bg-[#1e293b] border border-black/60 text-[10px] font-black uppercase rounded-sm hover:bg-[#2d333d] active:bg-[#0f172a] transition-all flex items-center justify-center text-slate-300";

  const rangeLeft = markIn !== undefined && duration > 0 ? (markIn / duration) * 100 : 0;
  const rangeRight = markOut !== undefined && duration > 0 ? (markOut / duration) * 100 : 100;
  const rangeWidth = rangeRight - rangeLeft;

  return (
    <div className={`w-[260px] h-[230px] bg-[#0a0a0a] border border-[#111] rounded-sm flex flex-col overflow-hidden relative shadow-2xl shrink-0 group ${isProgram ? 'ring-2 ring-red-600 z-10' : isPreview ? 'ring-2 ring-emerald-600 z-10' : ''}`}>
      {/* Header */}
      <div className={`h-6 shrink-0 flex items-center justify-between border-b border-black/40 ${isProgram ? 'bg-red-700' : isPreview ? 'bg-emerald-700' : 'bg-[#1e293b]'}`}>
        <div className="flex items-center flex-1 min-w-0 h-full">
          <div className="w-6 h-full bg-black/30 flex items-center justify-center text-[11px] font-black text-white shrink-0">{index + 1}</div>
          <span className="text-[10px] font-black px-2 truncate uppercase tracking-tighter text-slate-200">{source.name}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="px-2 h-full text-xs font-bold text-white/40 hover:text-white hover:bg-red-600/20 transition-all">✕</button>
      </div>

      {/* Media Content */}
      <div className="flex-1 bg-black relative cursor-pointer flex" onClick={onClick} onDoubleClick={onDoubleClick}>
        <div className="flex-1 relative overflow-hidden bg-[#050505]">
          {source.type === 'image' ? (
            <img src={source.mediaUrl} className="w-full h-full object-contain" alt="" />
          ) : (source.type === 'bible' && source.bibleText) ? (
            <div className="w-full h-full bg-[#4169e1]/20 flex flex-col items-center justify-center p-2 text-center">
               <span className="text-[9px] font-serif text-white/60 leading-tight">"{source.bibleText.slice(0, 60)}..."</span>
            </div>
          ) : (source.stream || source.mediaUrl) ? (
            <video ref={videoRef} autoPlay={false} muted={true} playsInline className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl">{index + 1}</div>
          )}
          
          {isMedia && duration > 0 && (
            <div className="absolute bottom-0 inset-x-0 h-7 bg-black/90 flex flex-col justify-center px-1 border-t border-white/10 z-30 group/scrub">
              <div className="flex justify-between px-1 mb-0.5">
                <span className="text-[8px] font-bold text-blue-400 tabular-nums">{formatTimeCompact(currentTime)}</span>
                <span className="text-[8px] font-bold text-slate-500 tabular-nums">-{formatTimeCompact(duration - currentTime)}</span>
              </div>
              <div className="relative h-1 bg-white/10 rounded-full mx-1">
                {(markIn !== undefined || markOut !== undefined) && (
                  <div className="absolute inset-y-0 bg-blue-500/30 z-0" style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}></div>
                )}
                <div className="absolute inset-y-0 left-0 bg-[#4169e1] shadow-[0_0_8px_#4169e1] z-10" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                <input type="range" min="0" max={duration} step="0.1" value={currentTime} onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)} onChange={handleScrub} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40" />
              </div>
            </div>
          )}
        </div>
        
        {source.hasAudio && (
          <div className="w-8 bg-[#0f172a] border-l border-black/60 flex flex-col items-center py-2 shrink-0">
             <div className="flex-1 w-2 relative mb-2">
                <AudioMeter source={source.stream || videoRef.current} barCount={15} className="w-2 h-full opacity-60" />
             </div>
             <div className="h-16 w-1 bg-black/60 rounded-full relative group/volume">
                <input type="range" min="0" max={100} value={source.volume ?? 100} onChange={(e) => onSetVolume(Number(e.target.value))} className="absolute inset-x-[-18px] inset-y-0 w-24 h-6 opacity-0 cursor-ns-resize rotate-270" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)' }} />
                <div className="absolute inset-x-0 bottom-0 bg-emerald-500 shadow-[0_0_5px_#10b981]" style={{ height: `${source.volume ?? 100}%` }}></div>
             </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="p-1 bg-[#1e293b] border-t border-black/60 flex flex-col gap-1 shrink-0 h-[72px]">
        {/* Row 1 */}
        <div className="grid grid-cols-[auto_1fr_1fr_1.5fr] gap-1 items-center">
           <div className="grid grid-cols-3 gap-0.5 pr-1 border-r border-black/20 shrink-0">
              {[1, 2, 3].map(n => (
                <button 
                  key={n} 
                  onClick={(e) => { e.stopPropagation(); onToggleLayer(n); }} 
                  className={`${ButtonBase} w-7 h-7 text-[10px] ${activeLayers.includes(n) ? 'bg-[#2563eb] text-white border-blue-400 shadow-[0_0_5px_rgba(37,99,235,0.5)]' : ''}`}
                >
                  {n}
                </button>
              ))}
           </div>
           <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className={`${ButtonBase} h-7`} title="Play/Pause">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
           </button>
           <button onClick={(e) => { e.stopPropagation(); onToggleLoop(); }} className={`${ButtonBase} h-7`} title="Toggle Loop">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
           </button>
           {/* Professional actualization: using onQuickAction */}
           <button onClick={(e) => { e.stopPropagation(); onQuickAction(); }} className={`${ButtonBase} h-7 text-white font-black tracking-widest text-[11px] bg-[#334155]`}>QUICK</button>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[auto_1fr_1fr_1.5fr] gap-1 items-center">
           <div className="grid grid-cols-3 gap-0.5 pr-1 border-r border-black/20 shrink-0">
              {[4, 5, 6].map(n => (
                <button 
                  key={n} 
                  onClick={(e) => { e.stopPropagation(); onToggleLayer(n); }} 
                  className={`${ButtonBase} w-7 h-7 text-[10px] ${activeLayers.includes(n) ? 'bg-[#2563eb] text-white border-blue-400 shadow-[0_0_5px_rgba(37,99,235,0.5)]' : ''}`}
                >
                  {n}
                </button>
              ))}
           </div>
           <button onClick={(e) => { e.stopPropagation(); onOpenSettings(); }} className={`${ButtonBase} h-7`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
           </button>
           <button onClick={(e) => { e.stopPropagation(); onToggleMonitor(); }} className={`${ButtonBase} h-7 ${source.isMonitored ? 'text-sky-400 border-sky-600 bg-sky-950/20 shadow-[inset_0_0_8px_rgba(56,189,248,0.2)]' : ''}`}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
           </button>
           <button 
             disabled={!source.hasAudio} 
             onClick={(e) => { e.stopPropagation(); onToggleMute(); }} 
             className={`flex-1 h-7 text-[10px] font-black rounded-sm border border-black/40 transition-all tracking-widest ${!source.hasAudio ? 'bg-[#0f172a] text-slate-700 opacity-20 cursor-not-allowed grayscale' : !source.isMuted ? 'bg-emerald-600 text-black border-emerald-400' : 'bg-[#1e293b] text-slate-500'}`}
           >
             AUDIO
           </button>
        </div>
      </div>
    </div>
  );
};

interface PlaceholderThumbProps {
  index: number;
}

const PlaceholderThumb: React.FC<PlaceholderThumbProps> = ({ index }) => {
  return (
    <div className="w-[260px] h-[230px] bg-black/10 border border-white/5 border-dashed rounded-sm flex flex-col overflow-hidden opacity-30 select-none">
      <div className="h-6 bg-[#1e293b] border-b border-black/40 flex items-center">
        <div className="w-6 h-full bg-black/30 flex items-center justify-center text-[11px] font-black text-white/40 shrink-0">{index + 1}</div>
      </div>
      <div className="flex-1 flex items-center justify-center text-white/5 font-black text-6xl">{index + 1}</div>
      <div className="p-1 bg-[#1e293b] border-t border-black/60 flex flex-col gap-1 shrink-0 h-[72px]">
        <div className="grid grid-cols-[auto_1fr_1fr_1.5fr] gap-1 items-center opacity-20">
           <div className="grid grid-cols-3 gap-0.5 pr-1 border-r border-black/20">
              {[1, 2, 3].map(n => <div key={n} className="w-7 h-7 bg-[#2d333d] rounded-sm"></div>)}
           </div>
           <div className="h-7 bg-[#2d333d] rounded-sm"></div>
           <div className="h-7 bg-[#2d333d] rounded-sm"></div>
           <div className="h-7 bg-[#2d333d] rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

interface SourceGridProps {
  sources: StudioSource[];
  layerAssignments: Record<number, string | null>;
  onToggleLayer: (layer: number, sourceId: string) => void;
  onSelectPreview: (id: string) => void;
  onSelectProgram: (id: string) => void;
  onRemoveSource: (id: string) => void;
  onToggleLoop: (id: string) => void;
  onTogglePlay: (id: string) => void;
  onToggleMonitor: (id: string) => void;
  onToggleMute: (id: string) => void;
  onSetVolume: (id: string, vol: number) => void;
  onOpenSettings: (id: string) => void;
  onQuickAction: (id: string) => void;
  onSeek: (id: string, time: number) => void;
  previewId: string | null;
  programId: string | null;
  performanceMode: boolean;
  gpuAcceleration: boolean;
  sourceTimesRef: React.RefObject<Map<string, number> | null>;
}

type WorkflowGroup = 'All' | 'Capture' | 'Assets' | 'Worship' | 'Feeds';

const WORKFLOWS: { value: WorkflowGroup; label: string; color: string; types: string[] }[] = [
  { value: 'All', label: 'MASTER', color: '#4169e1', types: [] },
  { value: 'Capture', label: 'CAPTURE', color: '#ef4444', types: ['camera', 'ndi', 'audio-input', 'screen', 'video-call', 'zoom'] },
  { value: 'Assets', label: 'ASSETS', color: '#10b981', types: ['video', 'audio', 'image', 'photos', 'list'] },
  { value: 'Worship', label: 'WORSHIP', color: '#8b5cf6', types: ['bible', 'powerpoint', 'title'] },
  { value: 'Feeds', label: 'FEEDS', color: '#f59e0b', types: ['web', 'stream', 'color'] }
];

const SourceGrid: React.FC<SourceGridProps> = ({ 
  sources = [], layerAssignments = {}, onToggleLayer, onSelectPreview, onSelectProgram, onRemoveSource, onToggleLoop, onTogglePlay, onToggleMonitor, onToggleMute, onSetVolume, onOpenSettings, onQuickAction, onSeek, previewId, programId, performanceMode, gpuAcceleration, sourceTimesRef 
}) => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowGroup>('All');
  
  const filteredSources = useMemo(() => {
    if (activeWorkflow === 'All') return sources;
    const workflow = WORKFLOWS.find(w => w.value === activeWorkflow);
    return sources.filter(s => workflow?.types.includes(s.type) || s.settings?.category === activeWorkflow);
  }, [sources, activeWorkflow]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      <div className="h-11 flex items-center justify-between px-3 bg-[#111317] border-b border-black shrink-0 z-50 select-none shadow-2xl">
        <div className="flex items-center gap-1">
          {WORKFLOWS.map(wf => {
            const isActive = activeWorkflow === wf.value;
            const count = sources.filter(s => wf.value === 'All' ? true : (wf.types.includes(s.type) || s.settings?.category === wf.value)).length;
            return (
              <button
                key={wf.value}
                onClick={() => setActiveWorkflow(wf.value)}
                className={`flex items-center h-8 px-4 rounded-sm transition-all relative group ${isActive ? 'bg-[#1e293b] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-50'}`}>{wf.label}</span>
                {count > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold ${isActive ? 'bg-[#2563eb] text-white' : 'bg-[#1e293b] text-slate-600'}`}>{count}</span>}
                {isActive && <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ backgroundColor: wf.color }}></div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-[#0f172a]">
        <div className="flex flex-wrap gap-3 content-start pb-20">
          {filteredSources.map((source) => (
            <InputThumb 
              key={source.id} 
              index={sources.findIndex(s => s.id === source.id)} 
              source={source} 
              isProgram={programId === source.id} 
              isPreview={previewId === source.id}
              performanceMode={performanceMode}
              gpuAcceleration={gpuAcceleration}
              activeLayers={[1, 2, 3, 4, 5, 6].filter(n => layerAssignments[n] === source.id)}
              onToggleLayer={(n) => onToggleLayer(n, source.id)}
              onClick={() => onSelectPreview(source.id)} 
              onDoubleClick={() => onSelectProgram(source.id)} 
              onRemove={() => onRemoveSource(source.id)}
              onToggleLoop={() => onToggleLoop(source.id)}
              onTogglePlay={() => onTogglePlay(source.id)}
              onToggleMonitor={() => onToggleMonitor(source.id)}
              onToggleMute={() => onToggleMute(source.id)}
              onSetVolume={(vol) => onSetVolume(source.id, vol)}
              onOpenSettings={() => onOpenSettings(source.id)}
              // Professional actualization: correctly passing onQuickAction from SourceGrid to InputThumb
              onQuickAction={() => onQuickAction(source.id)}
              onSeek={onSeek}
              sourceTimesRef={sourceTimesRef}
            />
          ))}
          {activeWorkflow === 'All' && sources.every(s => s.type !== 'blank') && [...Array(Math.max(0, 12 - sources.length))].map((_, i) => (
            <PlaceholderThumb key={i} index={sources.length + i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SourceGrid;