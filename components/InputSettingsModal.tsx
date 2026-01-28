
import React, { useState, useRef, useEffect } from 'react';
import { StudioSource, SourceInputSettings } from '../types';

interface InputSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: StudioSource;
  allSources: StudioSource[];
  onUpdate: (sourceId: string, updates: Partial<SourceInputSettings>, name?: string) => void;
}

const InputSettingsModal: React.FC<InputSettingsModalProps> = ({ isOpen, onClose, source, allSources, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('General');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fix: Made children optional to prevent JSX parsing errors in some environments
  const ControlGroup = ({ label, children, horizontal = false }: { label: string; children?: React.ReactNode; horizontal?: boolean }) => (
    <div className={`flex ${horizontal ? 'flex-row items-center justify-between gap-4' : 'flex-col gap-2'}`}>
       <label className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-1 shrink-0">{label}</label>
       {children}
    </div>
  );

  const defaultSettings: SourceInputSettings = {
    category: 'None',
    aspectRatio: 'Source',
    sourceAspectRatio: 'Widescreen',
    mouseClickAction: 'Preview',
    deinterlaceBlend: false,
    sharpen: false,
    mirror: false,
    flattenLayers: false,
    autoMixAudio: true,
    autoPlayWithTransition: true,
    autoRestartWithTransition: false,
    autoPauseAfterTransition: true,
    zoom: 1, zoomX: 1, zoomY: 1, panX: 0, panY: 0, rotate: 0, rotateX: 0, rotateY: 0, perspective: 1000, mirrorX: false, mirrorY: false,
    cropX1: 0, cropY1: 0, cropX2: 1280, cropY2: 720,
    red: 0, green: 0, blue: 0, saturation: 1, brightness: 1, contrast: 1, hue: 0, blur: 0, sepia: 0, blackStretch: 0, whiteStretch: 255, alpha: 255,
    chromaKeyEnabled: false, chromaKeyColor: '#00ff00', chromaKeyTolerance: 0.1,
    lumaKeyEnabled: false, lumaKeyThreshold: 0.1,
    alphaChannelMode: 'Auto',
    borderEnabled: false, borderThickness: 0, borderColor: '#ffffff', borderRadius: 0,
    multiLayers: Array.from({ length: 10 }, (_, i) => ({ index: i + 1, sourceId: 'None', enabled: true }))
  };

  const settings = source.settings || defaultSettings;

  useEffect(() => {
    if (isOpen && videoRef.current && source) {
      const el = videoRef.current;
      if (source.stream) {
        el.srcObject = source.stream;
      } else if (source.mediaUrl) {
        el.src = source.mediaUrl;
      }
      el.play().catch(() => {});
    }
  }, [isOpen, source]);

  if (!isOpen) return null;

  const tabs = ['General', 'Color', 'Position', 'Layers', 'PTZ', 'Advanced'];
  const updateField = (field: keyof SourceInputSettings, value: any) => onUpdate(source.id, { [field]: value });

  const categoryOptions = [
    { label: '--- Workflow ---', value: 'None', disabled: true },
    { label: 'None', value: 'None' },
    { label: 'Worship', value: 'Worship' },
    { label: 'Sermon', value: 'Sermon' },
    { label: 'Lower Thirds', value: 'Lower Thirds' },
    { label: 'Overlay', value: 'Overlay' },
    { label: '--- Source Types ---', value: 'Type_Header', disabled: true },
    { label: 'Camera', value: 'Camera' },
    { label: 'NDI', value: 'NDI' },
    { label: 'Video', value: 'Video' },
    { label: 'Image', value: 'Image' },
    { label: 'Web', value: 'Web' },
    { label: 'PowerPoint', value: 'PowerPoint' },
    { label: 'Bible / Scripture', value: 'Bible' },
    { label: 'Audio', value: 'Audio' },
    { label: 'SRT / Stream', value: 'Stream' },
    { label: 'Color / Solid', value: 'Color' }
  ];

  const previewStyle: React.CSSProperties = {
    transform: `
      perspective(${settings.perspective}px)
      rotateX(${settings.rotateX}deg)
      rotateY(${settings.rotateY}deg)
      rotateZ(${settings.rotate}deg)
      scale(${settings.zoomX * settings.zoom * ((settings.mirror || settings.mirrorX) ? -1 : 1)}, ${settings.zoomY * settings.zoom * (settings.mirrorY ? -1 : 1)})
      translate(${settings.panX * 100}%, ${settings.panY * 100}%)
    `,
    filter: `
      saturate(${settings.saturation}) 
      brightness(${settings.brightness})
      contrast(${settings.contrast})
      hue-rotate(${settings.hue}deg)
      blur(${settings.blur}px)
      sepia(${settings.sepia})
      opacity(${settings.alpha / 255})
      ${settings.sharpen ? 'contrast(1.2) brightness(1.05)' : ''}
    `,
    border: settings.borderEnabled ? `${settings.borderThickness}px solid ${settings.borderColor}` : 'none',
    borderRadius: `${settings.borderRadius}px`,
    transition: 'transform 0.1s ease-out, filter 0.1s ease-out',
    transformOrigin: 'center center',
    width: '100%',
    height: '100%',
    // SYNC FIX: Ensure real-size containment
    objectFit: settings.aspectRatio === 'Widescreen' ? 'cover' : 'contain',
    backgroundColor: 'black'
  };

  const ModernSlider = ({ label, value, min, max, step = 0.01, field, resetValue = 0 }: any) => (
    <div className="space-y-1.5 flex flex-col">
      <div className="flex justify-between items-center px-1">
         <span className="text-[9px] font-black text-violet-700 uppercase tracking-widest">{label}</span>
         <span className="text-[9px] font-mono text-emerald-600 font-bold">{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="range" min={min} max={max} step={step} value={value} 
          onChange={(e) => updateField(field, parseFloat(e.target.value))}
          className="flex-1 accent-violet-600 h-1 bg-violet-100 rounded-full appearance-none cursor-pointer"
        />
        <button onClick={() => updateField(field, resetValue)} className="text-[8px] font-black text-violet-300 hover:text-violet-900 uppercase">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-violet-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-emerald-50 border border-teal-200 rounded-[32px] shadow-2xl w-full max-w-2xl h-full max-h-[96vh] flex flex-col overflow-hidden ring-1 ring-white/50">
        
        <header className="h-14 px-6 flex items-center justify-between border-b border-teal-100 bg-white/60 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-700 flex items-center justify-center text-white text-xs font-black">
                 {source.id.slice(0, 1).toUpperCase()}
              </div>
              <div>
                 <h2 className="text-xs font-black text-violet-950 uppercase tracking-tight">{source.name}</h2>
                 <p className="text-[8px] text-teal-600 font-bold uppercase tracking-widest leading-none">Parameters • {source.id.slice(0, 8)}</p>
              </div>
           </div>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-teal-200 text-teal-500 hover:text-violet-950 transition-all flex items-center justify-center text-sm shadow-sm">✕</button>
        </header>

        <div className="p-3 bg-cyan-50/30 border-b border-teal-100 shrink-0 flex flex-col items-center">
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl relative ring-4 ring-white border border-teal-100 group">
             <div className="absolute inset-0 flex items-center justify-center">
                {source.type === 'image' ? (
                  <img src={source.mediaUrl} style={previewStyle} alt="" />
                ) : source.type === 'color' ? (
                  <div style={{...previewStyle, backgroundColor: source.color}} className="w-full h-full"></div>
                ) : (
                  <video ref={videoRef} style={previewStyle} muted playsInline className="w-full h-full" />
                )}
             </div>
             <div className="absolute inset-0 pointer-events-none opacity-10 border border-white/40">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40"></div>
             </div>
          </div>
        </div>

        <nav className="h-10 bg-white border-b border-teal-100 flex px-4 shrink-0 overflow-x-auto scrollbar-hide">
           {tabs.map(tab => (
             <button 
               key={tab} onClick={() => setActiveTab(tab)}
               className={`px-4 h-full text-[9px] font-black uppercase tracking-widest transition-all relative border-b-2 ${
                 activeTab === tab ? 'text-violet-700 border-violet-600' : 'text-teal-400 border-transparent hover:text-violet-600'
               }`}
             >
               {tab}
             </button>
           ))}
        </nav>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-white/40">
          <div className="max-w-xl mx-auto space-y-6">
            {activeTab === 'General' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-violet-700 uppercase tracking-widest px-1">Name</label>
                  <input 
                    type="text" 
                    defaultValue={source.name} 
                    className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-violet-950 font-bold outline-none shadow-sm focus:border-violet-500 transition-all"
                    onChange={(e) => onUpdate(source.id, {}, e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-violet-700 uppercase tracking-widest px-1">Aspect Ratio</label>
                    <select value={settings.aspectRatio} onChange={(e) => updateField('aspectRatio', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-violet-950 font-bold outline-none shadow-sm">
                      <option>Source</option><option>Widescreen</option><option>Normal</option><option>Anamorphic</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-violet-700 uppercase tracking-widest px-1">Mouse Click Action</label>
                    <select value={settings.mouseClickAction} onChange={(e) => updateField('mouseClickAction', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-violet-950 font-bold outline-none shadow-sm">
                      <option>Preview</option><option>Cut</option><option>QuickPlay</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-violet-700 uppercase tracking-widest px-1">Category / Grouping</label>
                    <select value={settings.category} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-violet-950 font-bold outline-none shadow-sm focus:ring-2 focus:ring-violet-500/20 transition-all">
                      {categoryOptions.map((opt, i) => (
                        <option key={i} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-violet-700 uppercase tracking-widest px-1">Source Aspect Ratio</label>
                    <select value={settings.sourceAspectRatio} onChange={(e) => updateField('sourceAspectRatio', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-violet-950 font-bold outline-none shadow-sm">
                      <option>Widescreen</option><option>Normal</option><option>Square</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 pt-4 border-t border-teal-100">
                   <div className="space-y-3">
                      {[
                        { field: 'deinterlaceBlend', label: 'Deinterlace Blend' },
                        { field: 'sharpen', label: 'Sharpen' },
                        { field: 'mirror', label: 'Mirror' },
                        { field: 'flattenLayers', label: 'Flatten Layers' }
                      ].map(cb => (
                        <label key={cb.field} className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" checked={(settings as any)[cb.field]} onChange={(e) => updateField(cb.field as any, e.target.checked)} className="w-4 h-4 rounded border-teal-200 accent-violet-600" />
                           <span className="text-[10px] font-bold text-violet-950 group-hover:text-violet-600 transition-colors">{cb.label}</span>
                        </label>
                      ))}
                   </div>
                   <div className="space-y-3">
                      {[
                        { field: 'autoMixAudio', label: 'Automatically mix audio' },
                        { field: 'autoPlayWithTransition', label: 'Automatically Play with Transition' },
                        { field: 'autoRestartWithTransition', label: 'Automatically Restart with Transition' },
                        { field: 'autoPauseAfterTransition', label: 'Automatically Pause after Transition' }
                      ].map(cb => (
                        <label key={cb.field} className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" checked={(settings as any)[cb.field]} onChange={(e) => updateField(cb.field as any, e.target.checked)} className="w-4 h-4 rounded border-teal-200 accent-emerald-600" />
                           <span className="text-[10px] font-bold text-violet-950 group-hover:text-emerald-600 transition-colors">{cb.label}</span>
                        </label>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Advanced' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300 pb-10">
                {/* Alpha & Reflection Row */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <ControlGroup label="Alpha Channel Mode">
                        <select value={settings.alphaChannelMode} onChange={(e) => updateField('alphaChannelMode', e.target.value)} className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-violet-950 font-bold outline-none shadow-sm">
                           <option>Auto</option><option>Straight</option><option>Premultiplied</option><option>None</option>
                        </select>
                     </ControlGroup>
                     <div className="flex gap-4">
                        <button onClick={() => updateField('mirrorX', !settings.mirrorX)} className={`flex-1 p-3 rounded-xl border font-black text-[9px] uppercase transition-all ${settings.mirrorX ? 'bg-violet-700 text-white border-violet-500' : 'bg-white border-teal-100 text-teal-600'}`}>Mirror X</button>
                        <button onClick={() => updateField('mirrorY', !settings.mirrorY)} className={`flex-1 p-3 rounded-xl border font-black text-[9px] uppercase transition-all ${settings.mirrorY ? 'bg-violet-700 text-white border-violet-500' : 'bg-white border-teal-100 text-teal-600'}`}>Mirror Y</button>
                     </div>
                  </div>

                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-teal-100 space-y-4">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Signal Integrity</h4>
                        <div onClick={() => updateField('deinterlaceBlend', !settings.deinterlaceBlend)} className={`w-8 h-4 rounded-full relative cursor-pointer ${settings.deinterlaceBlend ? 'bg-emerald-500' : 'bg-teal-200'}`}>
                           <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.deinterlaceBlend ? 'left-4.5' : 'left-0.5'}`}></div>
                        </div>
                     </div>
                     <p className="text-[9px] text-teal-700 font-bold leading-relaxed italic">Bypass standard deinterlacing for low-latency NDI/SDI production workflows.</p>
                  </div>
                </div>

                {/* Keying Engine */}
                <div className="bg-white border border-teal-100 rounded-[24px] p-6 space-y-6 shadow-sm">
                   <div className="flex items-center justify-between border-b border-teal-50 pb-4">
                      <h4 className="text-[10px] font-black text-violet-950 uppercase tracking-[0.2em]">Broadcast Keying Engine</h4>
                      <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={settings.chromaKeyEnabled} onChange={(e) => updateField('chromaKeyEnabled', e.target.checked)} className="accent-violet-600" />
                            <span className="text-[10px] font-black text-violet-700 uppercase">Chroma</span>
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={settings.lumaKeyEnabled} onChange={(e) => updateField('lumaKeyEnabled', e.target.checked)} className="accent-violet-600" />
                            <span className="text-[10px] font-black text-violet-700 uppercase">Luma</span>
                         </label>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8 opacity-90">
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-teal-600 uppercase">Key Color</span>
                            <input type="color" value={settings.chromaKeyColor} onChange={(e) => updateField('chromaKeyColor', e.target.value)} className="w-12 h-6 rounded cursor-pointer border-none bg-transparent" />
                         </div>
                         <ModernSlider label="Tolerance" field="chromaKeyTolerance" value={settings.chromaKeyTolerance} min={0} max={1} step={0.01} />
                      </div>
                      <div className="space-y-4 border-l border-teal-50 pl-8">
                         <ModernSlider label="Luma Threshold" field="lumaKeyThreshold" value={settings.lumaKeyThreshold} min={0} max={1} step={0.01} />
                         <ModernSlider label="Luma Smoothness" field="blackStretch" value={settings.blackStretch} min={0} max={255} step={1} />
                      </div>
                   </div>
                </div>

                {/* Border Management */}
                <div className="bg-white border border-teal-100 rounded-[24px] p-6 space-y-6 shadow-sm">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-violet-950 uppercase tracking-[0.2em]">Visual Borders</h4>
                      <div onClick={() => updateField('borderEnabled', !settings.borderEnabled)} className={`w-10 h-5 rounded-full relative cursor-pointer ${settings.borderEnabled ? 'bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.4)]' : 'bg-teal-200'}`}>
                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.borderEnabled ? 'left-6' : 'left-1'}`}></div>
                      </div>
                   </div>
                   
                   <div className={`grid grid-cols-2 gap-8 transition-opacity duration-300 ${settings.borderEnabled ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-teal-600 uppercase">Border Color</span>
                            <input type="color" value={settings.borderColor} onChange={(e) => updateField('borderColor', e.target.value)} className="w-12 h-6 rounded cursor-pointer border-none bg-transparent" />
                         </div>
                         <ModernSlider label="Thickness (px)" field="borderThickness" value={settings.borderThickness} min={0} max={20} step={1} />
                      </div>
                      <div className="space-y-4">
                         <ModernSlider label="Corner Radius" field="borderRadius" value={settings.borderRadius} min={0} max={100} step={1} />
                         <div className="p-3 bg-violet-50 rounded-xl flex items-center justify-center">
                            <span className="text-[8px] font-black text-violet-400 uppercase text-center">Hardware Accelerated Borders</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'Position' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <ModernSlider label="Global Scale" field="zoom" value={settings.zoom} min={0.1} max={5} resetValue={1} />
                <div className="grid grid-cols-2 gap-4">
                  <ModernSlider label="Zoom X" field="zoomX" value={settings.zoomX} min={0.1} max={5} resetValue={1} />
                  <ModernSlider label="Zoom Y" field="zoomY" value={settings.zoomY} min={0.1} max={5} resetValue={1} />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-teal-100 pt-4">
                  <ModernSlider label="X-Pan" field="panX" value={settings.panX} min={-2} max={2} resetValue={0} />
                  <ModernSlider label="Y-Pan" field="panY" value={settings.panY} min={-2} max={2} resetValue={0} />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-teal-100 pt-4">
                   <ModernSlider label="Rotate X" field="rotateX" value={settings.rotateX} min={-180} max={180} step={1} resetValue={0} />
                   <ModernSlider label="Rotate Y" field="rotateY" value={settings.rotateY} min={-180} max={180} step={1} resetValue={0} />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-teal-100 pt-4">
                   <ModernSlider label="Rotate Z" field="rotate" value={settings.rotate} min={-180} max={180} step={1} resetValue={0} />
                   <ModernSlider label="Perspective" field="perspective" value={settings.perspective} min={100} max={3000} step={1} resetValue={1000} />
                </div>
              </div>
            )}
            {activeTab === 'Color' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <ModernSlider label="Saturation" field="saturation" value={settings.saturation} min={0} max={4} resetValue={1} />
                <ModernSlider label="Hue Rotate" field="hue" value={settings.hue} min={0} max={360} step={1} resetValue={0} />
                <div className="grid grid-cols-2 gap-6 pt-2">
                   <ModernSlider label="Brightness" field="brightness" value={settings.brightness} min={0} max={3} resetValue={1} />
                   <ModernSlider label="Contrast" field="contrast" value={settings.contrast} min={0} max={3} resetValue={1} />
                </div>
                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-teal-100">
                   <ModernSlider label="Blur Radius" field="blur" value={settings.blur} min={0} max={20} resetValue={0} />
                   <ModernSlider label="Sepia Tone" field="sepia" value={settings.sepia} min={0} max={1} resetValue={0} />
                </div>
                <div className="pt-2 border-t border-teal-100">
                   <ModernSlider label="Master Alpha" field="alpha" value={settings.alpha} min={0} max={255} step={1} resetValue={255} />
                </div>
              </div>
            )}
            {activeTab === 'Layers' && (
              <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300 pb-4">
                 {settings.multiLayers.slice(0, 4).map(layer => (
                   <div key={layer.index} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-teal-100 hover:border-violet-300 transition-all shadow-sm">
                      <div className="w-6 h-6 rounded bg-teal-50 text-[8px] font-black flex items-center justify-center text-teal-600">#{layer.index}</div>
                      <select value={layer.sourceId} onChange={(e) => { const newLayers = [...settings.multiLayers]; newLayers[layer.index-1].sourceId = e.target.value; updateField('multiLayers', newLayers); }} className="flex-1 bg-transparent text-[10px] text-violet-950 font-bold outline-none">
                         <option>NONE</option>
                         {allSources.filter(s => s.id !== source.id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <div onClick={() => { const newLayers = [...settings.multiLayers]; newLayers[layer.index-1].enabled = !layer.enabled; updateField('multiLayers', newLayers); }} className={`w-8 h-4 rounded-full relative cursor-pointer ${layer.enabled ? 'bg-emerald-500' : 'bg-teal-200'}`}>
                         <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${layer.enabled ? 'left-4.5' : 'left-0.5'}`}></div>
                      </div>
                   </div>
                 ))}
              </div>
            )}
            {activeTab === 'PTZ' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                 <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map(p => (
                      <button key={p} className="bg-white border border-teal-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-violet-600 hover:bg-violet-50 transition-all shadow-sm">
                         <span className="text-[9px] font-black text-violet-700 uppercase">Preset {p}</span>
                         <span className="text-[10px] text-teal-500 font-bold">RECALL</span>
                      </button>
                    ))}
                 </div>
                 <div className="bg-cyan-100/30 p-4 rounded-2xl border border-teal-100 flex items-center justify-center">
                    <button className="px-8 py-3 bg-violet-700 text-white text-[10px] font-black uppercase rounded-xl shadow-lg">Store Current View as Preset</button>
                 </div>
              </div>
            )}
          </div>
        </main>

        <footer className="h-16 px-6 border-t border-teal-100 flex items-center justify-between bg-white/60 shrink-0">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest Diagnostic">Diagnostic</span>
              <span className="text-[9px] font-bold text-violet-900 leading-none">GPU Core Engine • {settings.perspective}px Perspective</span>
           </div>
           <div className="flex gap-2">
              <button onClick={onClose} className="px-6 py-2 rounded-xl text-[9px] font-black text-teal-600 uppercase tracking-widest hover:text-violet-950">Discard</button>
              <button onClick={() => { onUpdate(source.id, settings); onClose(); }} className="px-10 py-2 rounded-xl bg-violet-950 text-white text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">Commit Changes</button>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default InputSettingsModal;
