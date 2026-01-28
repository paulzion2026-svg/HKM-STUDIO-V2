
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StudioSource, OverlayLayer, SourceType, TransitionType, AppSettings, StreamDestination, RecordingSettings, TransitionPreset, MultiCorderSettings, MultiCorderInput, SourceInputSettings } from './types';
import MainMixer from './components/MainMixer';
import SourceGrid from './components/SourceGrid';
import BibleProjection from './components/BibleProjection';
import TitlerPanel from './components/TitlerPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import AddInputModal from './components/AddInputModal';
import SettingsModal from './components/SettingsModal';
import StreamSettingsModal from './components/StreamSettingsModal';
import RecordingSettingsModal from './components/RecordingSettingsModal';
import MultiCorderModal from './components/MultiCorderModal';
import InputSettingsModal from './components/InputSettingsModal';
import TransitionPresetPanel from './components/TransitionPresetPanel';
import ScriptureOptionsModal from './components/ScriptureOptionsModal';
import { nativeBroadcast } from './services/nativeBroadcastService';

const App: React.FC = () => {
  const [sources, setSources] = useState<StudioSource[]>(() => {
    const defaultBlank: StudioSource = {
      id: 'blank-source-default',
      name: 'BLANK',
      type: 'blank',
      isActive: true,
      volume: 0,
      hasAudio: false,
      settings: {
        category: 'None', aspectRatio: 'Source', sourceAspectRatio: 'Widescreen', mouseClickAction: 'Preview',
        deinterlaceBlend: false, sharpen: false, mirror: false, flattenLayers: false, autoMixAudio: true,
        autoPlayWithTransition: true, autoRestartWithTransition: false, autoPauseAfterTransition: true,
        zoom: 1, zoomX: 1, zoomY: 1, panX: 0, panY: 0, rotate: 0, rotateX: 0, rotateY: 0, perspective: 1000,
        mirrorX: false, mirrorY: false, cropX1: 0, cropY1: 0, cropX2: 1280, cropY2: 720,
        red: 0, green: 0, blue: 0, saturation: 1, brightness: 1, contrast: 1, hue: 0, blur: 0, sepia: 0,
        blackStretch: 0, whiteStretch: 255, alpha: 255, chromaKeyEnabled: false, chromaKeyColor: '#00ff00',
        chromaKeyTolerance: 0.1, lumaKeyEnabled: false, lumaKeyThreshold: 0.1, alphaChannelMode: 'Auto',
        borderEnabled: false, borderThickness: 0, borderColor: '#ffffff', borderRadius: 0,
        multiLayers: Array.from({ length: 10 }, (_, i) => ({ index: i + 1, sourceId: 'None', enabled: true }))
      }
    };
    try {
      const saved = localStorage.getItem('hkm_sources');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed : [defaultBlank];
    } catch { return [defaultBlank]; }
  });
  
  const sourceTimes = useRef<Map<string, number>>(new Map());

  const [previewId, setPreviewId] = useState<string | null>(() => sources.length > 0 ? sources[0].id : null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [activeInputSettingsId, setActiveInputSettingsId] = useState<string | null>(null);

  const [overlays, setOverlays] = useState<OverlayLayer[]>(() => {
    try {
      const saved = localStorage.getItem('hkm_overlays');
      if (!saved) return [{ id: 'lt-1', type: 'lower-third', visible: false, content: { line1: 'GUEST SPEAKER', line2: 'Pastor John Doe' } }];
      return JSON.parse(saved);
    } catch { return []; }
  });

  const [multiCorderSettings, setMultiCorderSettings] = useState<MultiCorderSettings>(() => {
    try {
      const saved = localStorage.getItem('hkm_multicorder');
      return saved ? JSON.parse(saved) : {
        format: 'FFMPEG', codec: 'MPEG-2', videoQuality: '8M', audioQuality: '384k', audioSource: 'Input',
        newFileEvery: 'None', recordNdiOriginal: true, compressionQuality: 90, wavFileRecord: false,
        showUnsupported: false, baseFolder: 'C:\\HKMStorage\\MultiCorder', isRecording: false
      };
    } catch { return { format: 'FFMPEG', codec: 'MPEG-2', videoQuality: '8M', audioQuality: '384k', audioSource: 'Input', newFileEvery: 'None', recordNdiOriginal: true, compressionQuality: 90, wavFileRecord: false, showUnsupported: false, baseFolder: 'C:\\HKMStorage\\MultiCorder', isRecording: false }; }
  });

  const [isMultiCorderOpen, setIsMultiCorderOpen] = useState(false);

  const [streamDestinations, setStreamDestinations] = useState<StreamDestination[]>(() => {
    try {
      const saved = localStorage.getItem('hkm_destinations');
      return saved ? JSON.parse(saved) : [1, 2, 3, 4, 5].map(i => ({ id: `dest-${i}`, name: `FEED 0${i}`, platform: 'rtmp', url: '', key: '', enabled: i === 1, status: 'idle', quality: 'H264 720p 2.5mbps AAC 128kbps', encoder: 'FFMPEG', useHardwareEncoder: true, bitrate: 0 }));
    } catch { return []; }
  });

  const [recordingSettings, setRecordingSettings] = useState<RecordingSettings>(() => {
    try {
      const saved = localStorage.getItem('hkm_recording_settings');
      return saved ? JSON.parse(saved) : {
        output: '1', enabled: true, format: 'MP4', filename: 'C:\\HKMStorage\\capture.mp4', size: '1280x720', frameRate: 'PAL 25p', bitrate: 8, useHardwareEncoder: true, faultTolerant: true, audioSource: 'Master', audioDelay: 0, audioBitrate: 384, newFileEvery: 'None', mp4Profile: 'H264Baseline', ffmpegCodec: 'MPEG-2', ffmpegFormat: 'Transport Stream (.ts)', ffmpegVideoQuality: '8M', ffmpegAudioQuality: '384k', aviQuality: 'HQ', aviCodec: 'HKM Video Codec', wmvFps: 25, wmvQuality: 90, wmvCodec: 'WMV1', wmvAudioCodec: 'WMA 9.2 - 64 kbps', wmvPort: 8080, wavFileRecord: false
      };
    } catch { return { output: '1', enabled: true, format: 'MP4', filename: 'C:\\HKMStorage\\capture.mp4', size: '1280x720', frameRate: 'PAL 25p', bitrate: 8, useHardwareEncoder: true, faultTolerant: true, audioSource: 'Master', audioDelay: 0, audioBitrate: 384, newFileEvery: 'None', mp4Profile: 'H264Baseline', ffmpegCodec: 'MPEG-2', ffmpegFormat: 'Transport Stream (.ts)', ffmpegVideoQuality: '8M', ffmpegAudioQuality: '384k', aviQuality: 'HQ', aviCodec: 'HKM Video Codec', wmvFps: 25, wmvQuality: 90, wmvCodec: 'WMV1', wmvAudioCodec: 'WMA 9.2 - 64 kbps', wmvPort: 8080, wavFileRecord: false }; }
  });

  const [layerAssignments, setLayerAssignments] = useState<Record<number, string | null>>({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('hkm_settings');
      return saved ? JSON.parse(saved) : { theme: 'Church Blue', previewColor: '#10b981', outputColor: '#ef4444', masterFrameRate: 'PAL 25p', outputSize: '1280x720', aspectRatio: 'Widescreen', performanceMode: false, gpuAcceleration: true, maxWordsPerSlide: 40 };
    } catch { return { theme: 'Church Blue', previewColor: '#10b981', outputColor: '#ef4444', masterFrameRate: 'PAL 25p', outputSize: '1280x720', aspectRatio: 'Widescreen', performanceMode: false, gpuAcceleration: true, maxWordsPerSlide: 40 }; }
  });

  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordConnecting, setIsRecordConnecting] = useState(false);

  const [activeTab, setActiveTab] = useState<'sources' | 'bible' | 'titler'>('sources');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isStreamSettingsOpen, setIsStreamSettingsOpen] = useState(false);
  const [isRecordingSettingsOpen, setIsRecordingSettingsOpen] = useState(false);
  const [isTransitionPresetOpen, setIsTransitionPresetOpen] = useState(false);
  const [isScriptureOptionsOpen, setIsScriptureOptionsOpen] = useState(false);
  const [isAudioMonitoring, setIsAudioMonitoring] = useState(false);
  
  const [ftbActive, setFtbActive] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(500);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem('hkm_sources', JSON.stringify(sources.map(s => ({ ...s, stream: undefined }))));
    localStorage.setItem('hkm_overlays', JSON.stringify(overlays));
    localStorage.setItem('hkm_settings', JSON.stringify(settings));
    localStorage.setItem('hkm_destinations', JSON.stringify(streamDestinations));
    localStorage.setItem('hkm_recording_settings', JSON.stringify(recordingSettings));
    localStorage.setItem('hkm_multicorder', JSON.stringify(multiCorderSettings));
  }, [sources, overlays, settings, streamDestinations, recordingSettings, multiCorderSettings]);

  const handleTake = useCallback(() => {
    const oldPrev = previewId;
    const oldProg = programId;
    
    const previewSource = sources.find(s => s.id === oldPrev);
    if (previewSource?.type === 'bible') {
      setProgramId(oldPrev);
    } else {
      setProgramId(oldPrev);
      setPreviewId(oldProg);
    }
  }, [previewId, programId, sources]);

  const handleAutoTransition = useCallback(async (type: TransitionType, overrideDuration?: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionType(type);
    const dur = overrideDuration ?? transitionDuration;
    await new Promise(resolve => setTimeout(resolve, dur));
    
    const oldPrev = previewId;
    const oldProg = programId;
    const previewSource = sources.find(s => s.id === oldPrev);
    
    if (previewSource?.type === 'bible') {
      setProgramId(oldPrev);
    } else {
      setProgramId(oldPrev);
      setPreviewId(oldProg);
    }
    
    setIsTransitioning(false);
  }, [isTransitioning, transitionDuration, previewId, programId, sources]);

  const handleGoLive = async () => {
    if (isLive) {
      await nativeBroadcast.stopNativeBroadcast();
      setStreamDestinations(prev => prev.map(d => ({ ...d, status: 'idle', bitrate: 0 })));
      setIsLive(false); setIsConnecting(false);
      return;
    }
    const preflight = await nativeBroadcast.preflightCheck();
    if (!preflight.ready && !window.confirm(`${preflight.ready ? '' : preflight.reason}\n\nProceed?`)) return;

    setIsConnecting(true);
    setStreamDestinations(prev => prev.map(d => d.enabled ? { ...d, status: 'connecting' } : d));
    try {
      await nativeBroadcast.startNativeBroadcast(streamDestinations, settings);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStreamDestinations(prev => prev.map(d => d.enabled ? { ...d, status: 'live', bitrate: 4500 } : d));
      setIsConnecting(false); setIsLive(true);
    } catch {
      setIsConnecting(false);
      setStreamDestinations(prev => prev.map(d => d.enabled ? { ...d, status: 'error' } : d));
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) { setIsRecording(false); return; }
    setIsRecordConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRecording(true);
    setIsRecordConnecting(false);
  };

  const handleUpdateSourceSettings = (sourceId: string, updates: Partial<SourceInputSettings>, name?: string) => {
    setSources(prev => prev.map(s => s.id === sourceId ? { 
      ...s, 
      name: name !== undefined ? name : s.name,
      settings: { ...(s.settings || ({} as any)), ...updates } 
    } : s));
  };

  const handleToggleLayer = (layer: number, sourceId: string) => {
    setLayerAssignments(prev => {
      const newAssignments = { ...prev };
      if (sourceId === programId) setProgramId(null);
      Object.keys(newAssignments).forEach(key => {
        const l = parseInt(key);
        if (newAssignments[l] === sourceId && l !== layer) newAssignments[l] = null;
      });
      newAssignments[layer] = prev[layer] === sourceId ? null : sourceId;
      return newAssignments;
    });
  };

  const handleSelectProgram = (id: string | null) => {
    if (!id) { setProgramId(null); return; }
    setLayerAssignments(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[parseInt(key)] === id) next[parseInt(key)] = null;
      });
      return next;
    });
    setProgramId(id);
  };

  const handleCentralSeek = (id: string, time: number) => {
    sourceTimes.current.set(id, time);
    const event = new CustomEvent('hkm_seek_sync', { detail: { id, time } });
    window.dispatchEvent(event);
  };

  return (
    <div className={`h-screen flex flex-col bg-[#0f172a] text-slate-200 overflow-hidden`}>
      <Header 
        isLive={isLive} isConnecting={isConnecting} onGoLive={handleGoLive}
        onTabChange={setActiveTab} activeTab={activeTab} isBottomVisible={true}
        onOpenSystemSettings={() => setIsSettingsModalOpen(true)}
        gpuAcceleration={settings.gpuAcceleration}
      />

      <main className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
        <div className="flex-[1.2] min-h-0">
          <MainMixer 
            previewSource={sources.find(s => s.id === previewId)}
            programSource={sources.find(s => s.id === programId)}
            layerSources={Object.values(layerAssignments).map(id => sources.find(s => s.id === id))}
            overlays={overlays} onTake={handleTake} onSwap={handleTake} onAuto={handleAutoTransition}
            ftbActive={ftbActive} onToggleFTB={() => setFtbActive(!ftbActive)}
            duration={transitionDuration} setDuration={setTransitionDuration}
            isTransitioning={isTransitioning} isMonitoring={isAudioMonitoring}
            gpuAcceleration={settings.gpuAcceleration} sourceTimesRef={sourceTimes}
            onOpenPresets={() => setIsTransitionPresetOpen(true)}
            onSeek={handleCentralSeek}
            onUpdateSourceSettings={handleUpdateSourceSettings}
          />
        </div>

        <div className="flex-1 min-h-0 border-t border-black bg-[#0f172a] flex flex-col overflow-hidden">
          {activeTab === 'sources' && (
            <SourceGrid 
              sources={sources} layerAssignments={layerAssignments}
              onToggleLayer={handleToggleLayer}
              onSelectPreview={setPreviewId} 
              onSelectProgram={handleSelectProgram}
              onRemoveSource={(id) => {
                setSources(prev => prev.filter(s => s.id !== id));
                if (previewId === id) setPreviewId(null);
                if (programId === id) setProgramId(null);
              }}
              onToggleLoop={(id) => setSources(prev => prev.map(s => s.id === id ? { ...s, isLooping: !s.isLooping } : s))}
              onTogglePlay={(id) => setSources(prev => prev.map(s => s.id === id ? { ...s, isPaused: !s.isPaused } : s))}
              onToggleMonitor={(id) => setSources(prev => prev.map(s => s.id === id ? { ...s, isMonitored: !s.isMonitored } : s))}
              onToggleMute={(id) => setSources(prev => prev.map(s => s.id === id ? { ...s, isMuted: !s.isMuted } : s))}
              onSetVolume={(id, vol) => setSources(prev => prev.map(s => s.id === id ? { ...s, volume: vol } : s))}
              onOpenSettings={(id) => setActiveInputSettingsId(id)} 
              onQuickAction={handleSelectProgram}
              onSeek={handleCentralSeek}
              previewId={previewId} programId={programId} performanceMode={settings.performanceMode}
              gpuAcceleration={settings.gpuAcceleration} sourceTimesRef={sourceTimes}
            />
          )}
          {activeTab === 'bible' && (
            <BibleProjection 
              onOpenOptions={() => setIsScriptureOptionsOpen(true)}
              // Pass true if the Bible input is on Program OR active on any Layer
              isProgramLive={
                (sources.find(s => s.id === programId)?.type === 'bible') ||
                Object.values(layerAssignments).some(id => id && sources.find(s => s.id === id)?.type === 'bible')
              }
              onProject={(text, ref, forceLive, part) => {
                setSources(prev => {
                  const existingBible = prev.find(s => s.type === 'bible');
                  if (existingBible) {
                    const updated = prev.map(s => s.id === existingBible.id ? { ...s, bibleText: text, bibleRef: ref, biblePart: part, name: `SCRIPTURE: ${ref}${part || ""}` } : s);
                    if (forceLive) {
                      // If it's not already on program AND not on a layer, force it to program
                      const isOnLayer = Object.values(layerAssignments).includes(existingBible.id);
                      if (programId !== existingBible.id && !isOnLayer) {
                         setProgramId(existingBible.id);
                      }
                    }
                    setPreviewId(existingBible.id);
                    return updated;
                  }
                  const id = 'bible-' + Date.now();
                  const newSource: StudioSource = { id, name: `SCRIPTURE: ${ref}${part || ""}`, type: 'bible', bibleText: text, bibleRef: ref, biblePart: part, isActive: true, hasAudio: false };
                  const nextSources = (prev.length === 1 && prev[0].id === 'blank-source-default') ? [newSource] : [...prev, newSource];
                  
                  if (forceLive) {
                    setProgramId(id);
                  }
                  setPreviewId(id);
                  return nextSources;
                });
              }}
              onPushToOverlay={(text) => setOverlays(prev => prev.map(o => o.id === 'lt-1' ? { ...o, content: { ...o.content, line1: text }, visible: true } : o))}
            />
          )}
          {activeTab === 'titler' && (
            <TitlerPanel overlays={overlays} onToggleOverlay={(id) => setOverlays(prev => prev.map(o => o.id === id ? { ...o, visible: !o.visible } : o))} onUpdateContent={(id, content) => setOverlays(prev => prev.map(o => o.id === id ? { ...o, content } : o))} />
          )}
        </div>
      </main>

      <Footer 
        isLive={isLive} isConnecting={isConnecting} onGoLive={handleGoLive}
        isRecording={isRecording} isRecordConnecting={isRecordConnecting} onToggleRecording={handleToggleRecording}
        onOpenRecordingSettings={() => setIsRecordingSettingsOpen(true)}
        onOpenMultiCorder={() => setIsMultiCorderOpen(true)}
        onAddInput={() => setIsAddModalOpen(true)}
        isMonitoring={isAudioMonitoring} onToggleMonitor={() => setIsAudioMonitoring(!isAudioMonitoring)}
        performanceMode={settings.performanceMode} onTogglePerformance={() => setSettings(prev => ({ ...prev, performanceMode: !prev.performanceMode }))}
        streamDestinations={streamDestinations} gpuEnabled={settings.gpuAcceleration}
        onOpenStreamSettings={() => setIsStreamSettingsOpen(true)}
      />

      <AddInputModal 
        isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
        onSelect={(type, configs) => {
          const newSources: StudioSource[] = configs.map(config => {
            let hasAudio = false;
            if (type === 'audio' || type === 'audio-input') hasAudio = true;
            else if (type === 'video' || type === 'camera' || type === 'stream') hasAudio = true; 
            else hasAudio = false;

            return { 
              id: Math.random().toString(36).substr(2, 9), 
              name: config.file?.name || config.url || config.name || type.toUpperCase(), 
              type, stream: config.stream,
              mediaUrl: config.file ? URL.createObjectURL(config.file) : config.url, 
              color: config.color, isActive: true, volume: 100, hasAudio,
              settings: {
                category: 'None', aspectRatio: 'Source', sourceAspectRatio: 'Widescreen', mouseClickAction: 'Preview',
                deinterlaceBlend: false, sharpen: false, mirror: false, flattenLayers: false, autoMixAudio: true,
                autoPlayWithTransition: true, autoRestartWithTransition: false, autoPauseAfterTransition: true,
                zoom: 1, zoomX: 1, zoomY: 1, panX: 0, panY: 0, rotate: 0, rotateX: 0, rotateY: 0, perspective: 1000,
                mirrorX: false, mirrorY: false, cropX1: 0, cropY1: 0, cropX2: 1280, cropY2: 720,
                red: 0, green: 0, blue: 0, saturation: 1, brightness: 1, contrast: 1, hue: 0, blur: 0, sepia: 0,
                blackStretch: 0, whiteStretch: 255, alpha: 255, chromaKeyEnabled: false, chromaKeyColor: '#00ff00',
                chromaKeyTolerance: 0.1, lumaKeyEnabled: false, lumaKeyThreshold: 0.1, alphaChannelMode: 'Auto',
                borderEnabled: false, borderThickness: 0, borderColor: '#ffffff', borderRadius: 0,
                multiLayers: Array.from({ length: 10 }, (_, i) => ({ index: i + 1, sourceId: 'None', enabled: true }))
              }
            };
          });
          setSources(prev => (prev.length === 1 && prev[0].id === 'blank-source-default') ? newSources : [...prev, ...newSources]);
          if (!previewId || previewId === 'blank-source-default') setPreviewId(newSources[0].id);
        }}
      />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} settings={settings} onSave={setSettings} />
      <StreamSettingsModal isOpen={isStreamSettingsOpen} onClose={() => setIsStreamSettingsOpen(false)} destinations={streamDestinations} onUpdateDestinations={setStreamDestinations} />
      <RecordingSettingsModal isOpen={isRecordingSettingsOpen} onClose={() => setIsRecordingSettingsOpen(false)} settings={recordingSettings} onSave={setRecordingSettings} />
      <MultiCorderModal isOpen={isMultiCorderOpen} onClose={() => setIsMultiCorderOpen(false)} sources={sources} settings={multiCorderSettings} onSave={setMultiCorderSettings} />
      <ScriptureOptionsModal isOpen={isScriptureOptionsOpen} onClose={() => setIsScriptureOptionsOpen(false)} />
      {activeInputSettingsId && <InputSettingsModal isOpen={!!activeInputSettingsId} onClose={() => setActiveInputSettingsId(null)} source={sources.find(s => s.id === activeInputSettingsId)!} allSources={sources} onUpdate={handleUpdateSourceSettings} />}
      {isTransitionPresetOpen && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-white/5 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <TransitionPresetPanel presets={[]} currentType={transitionType} currentDuration={transitionDuration} onApplyPreset={(p) => { setTransitionType(p.type); setTransitionDuration(p.duration); setIsTransitionPresetOpen(false); }} onSavePreset={() => {}} onDeletePreset={() => {}} onClose={() => setIsTransitionPresetOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
