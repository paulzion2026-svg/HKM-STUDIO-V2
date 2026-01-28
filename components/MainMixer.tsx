
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { StudioSource, OverlayLayer, TransitionType, SourceInputSettings, BibleTheme } from '../types';
import AudioMeter from './AudioMeter';

interface SafeZonesOverlayProps {
  visible: boolean;
}

const SafeZonesOverlay: React.FC<SafeZonesOverlayProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden">
      <div className="absolute inset-[5%] border border-white/10 ring-1 ring-black/20"></div>
      <div className="absolute inset-[10%] border border-white/20 ring-1 ring-black/20">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-2 bg-white/20"></div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-2 bg-white/20"></div>
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-px bg-white/20"></div>
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-px bg-white/20"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-px bg-white/40 shadow-sm"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-white/40 shadow-sm"></div>
    </div>
  );
};

interface MediaScrubberProps {
  mediaRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onSeek: (time: number) => void;
  themeColor?: string;
  source: StudioSource;
  onUpdateSettings: (updates: Partial<SourceInputSettings>) => void;
}

const MediaScrubber: React.FC<MediaScrubberProps> = ({ mediaRef, isActive, onSeek, themeColor = "blue", source, onUpdateSettings }) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const markIn = source.settings?.markIn;
  const markOut = source.settings?.markOut;

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !isActive) return;

    const syncHandler = (e: any) => {
      if (e.detail.id === source.id && !isDragging) {
        setTime(e.detail.time);
      }
    };
    window.addEventListener('hkm_seek_sync', syncHandler);

    const updateMetadata = () => { if (el.duration) setDuration(el.duration); };
    const updateTime = () => { 
      if (!isDragging) {
        const current = el.currentTime || 0;
        setTime(current);
        if (markOut !== undefined && current >= markOut) {
          const restartPos = markIn !== undefined ? markIn : 0;
          el.currentTime = restartPos;
          onSeek(restartPos);
        }
      } 
    };

    el.addEventListener('loadedmetadata', updateMetadata);
    el.addEventListener('timeupdate', updateTime);
    
    return () => {
      window.removeEventListener('hkm_seek_sync', syncHandler);
      el.removeEventListener('loadedmetadata', updateMetadata);
      el.removeEventListener('timeupdate', updateTime);
    };
  }, [mediaRef, isActive, isDragging, source.id, markIn, markOut, onSeek]);

  if (!isActive || duration === 0) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const rangeLeft = markIn !== undefined ? (markIn / duration) * 100 : 0;
  const rangeRight = markOut !== undefined ? (markOut / duration) * 100 : 100;
  const rangeWidth = rangeRight - rangeLeft;

  return (
    <div className="absolute bottom-0 inset-x-0 h-8 bg-black/80 backdrop-blur-sm flex items-center px-3 gap-2 z-[100] border-t border-white/5 group/scrubber select-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex gap-1 shrink-0">
        <button onClick={() => onUpdateSettings({ markIn: time })} className="w-5 h-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[10px] font-black text-blue-400 flex items-center justify-center transition-all">&#123;</button>
        <button onClick={() => onUpdateSettings({ markOut: time })} className="w-5 h-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[10px] font-black text-red-400 flex items-center justify-center transition-all">&#125;</button>
      </div>
      <div className="min-w-[50px]">
        <span className={`text-[10px] font-mono font-black ${themeColor === 'red' ? 'text-red-400' : 'text-emerald-400'} tabular-nums tracking-tighter`}>{formatTime(time)}</span>
      </div>
      <div className="flex-1 relative h-2 bg-white/10 rounded-full overflow-hidden group/track cursor-pointer">
        {(markIn !== undefined || markOut !== undefined) && (
          <div className="absolute inset-y-0 bg-blue-500/30 border-x border-blue-500/50 z-0" style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }}></div>
        )}
        <div className={`absolute inset-y-0 left-0 transition-all duration-75 bg-blue-600 shadow-[0_0_8px_#2563eb] z-10`} style={{ width: `${(time / duration) * 100}%` }}></div>
        <input type="range" min="0" max={duration} step="0.01" value={time} onMouseDown={() => setIsDragging(true)} onMouseUp={() => setIsDragging(false)} onChange={(e) => { const nt = parseFloat(e.target.value); setTime(nt); onSeek(nt); }} className="absolute inset-0 w-full h-full opacity-0 z-20" />
      </div>
      <div className="min-w-[50px] text-right text-[10px] font-mono font-bold text-slate-500 tracking-tighter tabular-nums">-{formatTime(duration - time)}</div>
    </div>
  );
};

interface MainMixerProps {
  previewSource?: StudioSource;
  programSource?: StudioSource;
  layerSources?: (StudioSource | undefined)[];
  overlays: OverlayLayer[];
  onTake: () => void;
  onSwap: () => void;
  onAuto: (type: TransitionType) => void;
  ftbActive: boolean;
  onToggleFTB: () => void;
  duration: number;
  setDuration: (d: number) => void;
  isTransitioning: boolean;
  isMonitoring: boolean;
  gpuAcceleration: boolean;
  sourceTimesRef: React.RefObject<Map<string, number> | null>;
  onOpenPresets?: () => void;
  onSeek: (id: string, time: number) => void;
  onUpdateSourceSettings: (id: string, updates: Partial<SourceInputSettings>) => void;
}

const MainMixer: React.FC<MainMixerProps> = ({ 
  previewSource, programSource, layerSources = [], onTake, onSwap, onAuto, ftbActive, onToggleFTB, duration, setDuration, isTransitioning, sourceTimesRef, onSeek, onUpdateSourceSettings
}) => {
  const previewRef = useRef<HTMLVideoElement>(null);
  const programRef = useRef<HTMLVideoElement>(null);
  const layerRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [showPreviewSafeZones, setShowPreviewSafeZones] = useState(false);
  const [showProgramSafeZones, setShowProgramSafeZones] = useState(false);
  const [activeTheme, setActiveTheme] = useState<BibleTheme | null>(null);
  
  const transitionDefinitions = useMemo(() => [
    { base: 'fade' as TransitionType, label: 'Fade' },
    { base: 'merge' as TransitionType, label: 'Merge' },
    { base: 'wipe' as TransitionType, label: 'Wipe' },
    { base: 'slide' as TransitionType, label: 'Slide' },
    { base: 'zoom' as TransitionType, label: 'Zoom' },
    { base: 'crossZoom' as TransitionType, label: 'CrossZoom' },
    { base: 'fly' as TransitionType, label: 'Fly' },
    { base: 'cube' as TransitionType, label: 'Cube' },
    { base: 'flyRotate' as TransitionType, label: 'FlyRot' },
    { base: 'verticalWipe' as TransitionType, label: 'V-Wipe' },
  ], []);

  useEffect(() => {
    const handleThemeUpdate = (e: any) => setActiveTheme(e.detail);
    window.addEventListener('hkm_theme_update', handleThemeUpdate);
    return () => window.removeEventListener('hkm_theme_update', handleThemeUpdate);
  }, []);

  const applySource = useCallback((el: HTMLVideoElement, source: StudioSource | undefined, shouldPlay: boolean, isProgramFeed: boolean) => {
    if (!el) return;
    if (!source) { 
      if (el.src || el.srcObject) {
        el.pause(); el.src = ""; el.srcObject = null; el.load();
      }
      return; 
    }
    if (source.mediaUrl) {
      if (!el.src.includes(source.mediaUrl)) { el.src = source.mediaUrl; el.load(); }
    } else if (source.stream) {
      if (el.srcObject !== source.stream) { el.srcObject = source.stream; }
    }
    el.volume = (source.volume ?? 100) / 100;
    const targetMute = isProgramFeed ? (source.isMuted || ftbActive) : true;
    if (el.muted !== targetMute) el.muted = targetMute;
    if (source.type === 'video' || source.type === 'audio') {
      if (shouldPlay && !source.isPaused) { if (el.paused) el.play().catch(() => {}); }
      else { if (!el.paused) el.pause(); }
    } else if (source.stream) {
      if (el.paused) el.play().catch(() => {});
    }
  }, [ftbActive]);

  useEffect(() => { if (programRef.current) applySource(programRef.current, programSource, true, true); }, [programSource, applySource]);
  useEffect(() => { if (previewRef.current) applySource(previewRef.current, previewSource, false, false); }, [previewSource, applySource]);

  const renderContent = (source: StudioSource | undefined, ref: any, isMuted = true) => {
    if (!source) return <div className="w-full h-full bg-[#0d0d0f] flex items-center justify-center relative overflow-hidden">
      <span className="text-[14px] font-black text-white/20 uppercase tracking-[0.8em]">NO SIGNAL</span>
    </div>;

    if (source.type === 'bible') {
      if (!source.bibleText || source.bibleText.trim() === '') {
         return <div className="w-full h-full bg-transparent"></div>;
      }

      const theme = activeTheme || {
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        textColor: '#ffffff',
        accentColor: '#d4af37',
        fontFamily: 'Playfair Display',
        motionEffect: 'flares',
        category: 'full'
      };

      const textLength = source.bibleText?.length || 0;
      // Maximized preview font sizes using REM to fit the smaller container
      const fontSize = textLength > 1000 ? '0.9rem' :
                       textLength > 600 ? '1.1rem' :
                       textLength > 400 ? '1.3rem' :
                       textLength > 200 ? '1.6rem' : 
                       textLength > 100 ? '2.0rem' : '2.8rem';
      
      const isLT = theme.category === 'lowerthird';

      return (
        <div className={`w-full h-full relative overflow-hidden transition-all duration-700 flex flex-col ${isLT ? 'justify-end pb-[5%]' : 'items-center justify-center'}`} style={{ background: isLT ? 'transparent' : theme.background, color: theme.textColor, fontFamily: theme.fontFamily }}>
          {!isLT && theme.motionEffect !== 'none' && (
             <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className={`motion-layer motion-${theme.motionEffect}`}></div>
             </div>
          )}
          
          <div className={`transition-all duration-700 ${isLT ? 'w-[90%] mx-auto bg-black/80 border-l-8 border-blue-500 p-6 shadow-2xl animate-in slide-in-from-left' : 'w-full h-full flex flex-col items-center justify-center px-[5%] py-[4%] text-center'}`} style={{ borderColor: theme.accentColor }}>
            <div className={`${isLT ? 'mb-1' : 'mb-2 shrink-0'}`}>
               <h2 className={`${isLT ? 'text-[0.9rem]' : 'text-[1.2rem]'} font-serif uppercase tracking-[0.25em] drop-shadow-md`} style={{ color: theme.accentColor }}>
                 {source.bibleRef}
               </h2>
               {!isLT && <div className="w-16 h-[2px] bg-white/20 mt-2 mx-auto shadow-sm"></div>}
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
              <p className="font-serif italic leading-relaxed transition-all duration-300 drop-shadow-lg" style={{ fontSize: isLT ? '1.2rem' : fontSize }}>
                "{source.bibleText}"
              </p>
            </div>

            {source.biblePart && !isLT && (
              <div className="absolute bottom-[2%] inset-x-0 flex justify-center">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{source.biblePart}</span>
              </div>
            )}
          </div>
          <style>{`
            .motion-particles { background: radial-gradient(circle, #fff 1%, transparent 1%); background-size: 20px 20px; animation: moveParticles 20s linear infinite; }
            .motion-bubbles { background: radial-gradient(circle, #ffffff22 10%, transparent 10%); background-size: 60px 60px; animation: moveBubbles 15s linear infinite; }
            .motion-flares { background: radial-gradient(circle at 50% 50%, #ffffff22 0%, transparent 70%); animation: flashFlares 10s ease-in-out infinite; }
            @keyframes moveParticles { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
            @keyframes moveBubbles { from { background-position: 0 500px; } to { background-position: 0 0; } }
            @keyframes flashFlares { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
          `}</style>
        </div>
      );
    }

    const s = source.settings;
    const style: React.CSSProperties = s ? {
      transform: `perspective(${s.perspective}px) rotateX(${s.rotateX}deg) rotateY(${s.rotateY}deg) rotateZ(${s.rotate}deg) scale(${(s.zoomX || 1) * s.zoom}, ${(s.zoomY || 1) * s.zoom}) translate(${s.panX * 100}%, ${s.panY * 100}%)`,
      filter: `saturate(${s.saturation}) brightness(${s.brightness}) contrast(${s.contrast}) blur(${s.blur}px)`,
      objectFit: 'cover', backgroundColor: 'transparent'
    } : { objectFit: 'contain', backgroundColor: 'transparent' };
    
    if (source.stream || source.mediaUrl) return <video ref={ref} autoPlay={false} muted={isMuted} playsInline style={style} className="w-full h-full" />;
    return <div className="w-full h-full bg-black"></div>;
  };

  return (
    <div className="h-full w-full flex bg-[#0f172a] gap-2 p-2">
      
      {/* PREVIEW COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Completely separate div above content */}
        <div className={`h-7 flex items-center justify-between px-3 rounded-t-sm mb-1 ${previewSource ? 'bg-emerald-800' : 'bg-[#1e293b]'}`}>
           <span className="text-[10px] font-black text-white uppercase tracking-wider truncate mr-2">{previewSource?.name || 'PREVIEW'}</span>
           <button onClick={() => setShowPreviewSafeZones(!showPreviewSafeZones)} className={`h-4 px-2 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-all ${showPreviewSafeZones ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/30 text-slate-400 border-white/10'}`}>Safe</button>
        </div>
        
        {/* Video Content Container */}
        <div className={`flex-1 relative border-2 bg-black flex flex-col items-center justify-center overflow-hidden group rounded-b-sm ${previewSource ? 'border-emerald-600' : 'border-[#1e293b]'}`}>
           {/* Inner wrapper - removed padding bottom to eliminate black bar */}
           <div className="w-full h-full flex items-center justify-center p-0 relative">
              <div className="aspect-video w-full max-w-full max-h-full relative shadow-2xl bg-black overflow-hidden flex items-center justify-center">
                 {renderContent(previewSource, previewRef)}
                 <SafeZonesOverlay visible={showPreviewSafeZones} />
              </div>
           </div>
           {/* Scrubber - now overlay on top */}
           {previewSource && <MediaScrubber source={previewSource} mediaRef={previewRef} themeColor="green" isActive={!!previewSource && (previewSource.type === 'video' || previewSource.type === 'audio')} onSeek={(t) => onSeek(previewSource.id, t)} onUpdateSettings={(u) => onUpdateSourceSettings(previewSource.id, u)} />}
        </div>
      </div>

      {/* CENTER CONTROLS - Aligned to account for header offset */}
      <div className="flex gap-1 shrink-0 h-full pt-[32px] z-[100]">
        <div className="w-[80px] flex flex-col bg-[#0f172a] border-y border-l border-black/60 p-0.5 gap-0.5 shrink-0 relative overflow-hidden">
          <button onClick={onSwap} className="w-full bg-[#f36c21] h-7 rounded-sm text-[9px] font-black text-white uppercase shadow-lg active:scale-95 shrink-0">⇄ SWAP</button>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-0.5">
            <button onClick={onTake} className="w-full h-7 bg-[#1e293b] text-slate-200 rounded-sm text-[9px] font-black uppercase tracking-widest shrink-0 border border-white/5 hover:bg-[#2d333d]">Cut</button>
            {transitionDefinitions.map((def) => (
              <button key={def.base} onClick={() => onAuto(def.base)} className="w-full h-7 bg-[#1e293b] text-slate-300 rounded-sm text-[9px] font-black uppercase tracking-tighter hover:bg-[#2d333d] transition-all shrink-0 border border-white/5">{def.label}</button>
            ))}
            <button onClick={() => onAuto('stinger1')} className="w-full h-7 bg-[#1e293b] text-slate-400 rounded-sm text-[9px] font-black uppercase tracking-tighter hover:bg-[#2d333d] shrink-0 border border-white/5">Stinger 1</button>
          </div>
          
          <button onClick={onToggleFTB} className={`w-full h-8 rounded-sm text-[9px] font-black border border-black/20 transition-all shrink-0 ${ftbActive ? 'bg-red-600 text-white animate-pulse' : 'bg-[#1e293b] text-slate-200'}`}>FTB</button>
        </div>

        <div className="w-[30px] flex flex-col bg-[#0f172a] border-y border-r border-black/60 p-0.5 items-center justify-center relative">
           <div className="h-full w-full bg-black rounded-sm border border-white/10 relative overflow-hidden flex justify-center">
              <AudioMeter source={programRef.current} barCount={48} className="w-full h-full opacity-100" vertical={true} />
              <div className="absolute top-1 left-0 right-0 text-center pointer-events-none">
                 <span className="text-[6px] font-black text-white/50 bg-black/50 px-0.5 rounded">M</span>
              </div>
           </div>
        </div>
      </div>

      {/* PROGRAM COLUMN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Completely separate div */}
        <div className={`h-7 flex items-center justify-between px-3 rounded-t-sm mb-1 ${programSource ? 'bg-red-800' : 'bg-[#1e293b]'}`}>
           <span className="text-[10px] font-black text-white uppercase tracking-wider truncate mr-2">{programSource?.name || 'PROGRAM'}</span>
           <button onClick={() => setShowProgramSafeZones(!showProgramSafeZones)} className={`h-4 px-2 rounded-sm text-[8px] font-black uppercase tracking-widest border transition-all ${showProgramSafeZones ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/30 text-slate-400 border-white/10'}`}>Safe</button>
        </div>
        
        {/* Video Content Container */}
        <div className={`flex-1 relative border-2 bg-black flex flex-col items-center justify-center overflow-hidden group rounded-b-sm ${programSource ? 'border-red-600' : 'border-[#1e293b]'}`}>
           {/* Inner wrapper - removed padding bottom to eliminate black bar */}
           <div className="w-full h-full flex items-center justify-center p-0 relative">
              <div className="aspect-video w-full max-w-full max-h-full relative shadow-2xl bg-black overflow-hidden flex items-center justify-center">
                 {/* Layer 0: Main Program */}
                 {renderContent(programSource, programRef, false)}
                 
                 {/* Layers 1-6: Overlays */}
                 {layerSources.map((layerSource, idx) => {
                    if (!layerSource) return null;
                    return (
                      <div key={idx} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                         {renderContent(layerSource, (el: HTMLVideoElement) => { 
                             if(layerRefs.current) layerRefs.current[idx] = el; 
                             if(el && layerSource) applySource(el, layerSource, true, true);
                         }, false)}
                      </div>
                    );
                 })}

                 <SafeZonesOverlay visible={showProgramSafeZones} />
              </div>
           </div>
           {programSource && <MediaScrubber source={programSource} mediaRef={programRef} themeColor="red" isActive={!!programSource && (programSource.type === 'video' || programSource.type === 'audio')} onSeek={(t) => onSeek(programSource.id, t)} onUpdateSettings={(u) => onUpdateSourceSettings(programSource.id, u)} />}
        </div>
      </div>

    </div>
  );
};

export default MainMixer;
