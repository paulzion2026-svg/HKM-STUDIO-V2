
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [activeTab, setActiveTab] = useState('Display');
  const [externalSubTab, setExternalSubTab] = useState(1);
  const [localSettings, setLocalSettings] = useState<AppSettings>({
    ...settings,
    language: 'English', inputSize: '208x156', fullscreen1Display: '2', fullscreen2Display: 'None',
    ffmpegFileTypes: '.mov,*.qt,*.mxf,*.mp4,*.mpg,*.ts,*.m4v,*.webm',
    mpeg2VideoDecoder: 'Auto', mpegAudioDecoder: 'Auto', x264VideoDecoder: 'Auto',
    preferredDeinterlacingCamera: 'Blend', preferredDeinterlacingPlayback: 'Blend',
    quickPlayTransition: 'Fade', quickPlayDuration: 500, ftbDuration: 500,
    displayMethod: 'Auto', graphicsAdapter: 'Intel(R) HD Graphics 4000'
  });

  if (!isOpen) return null;

  const tabs = [
    'Display', 'Outputs / NDI / SRT', 'Options', 'Performance', 'Decoders', 
    'Recording', 'External Output', 'Audio', 'Audio Outputs', 
    'Web Controller', 'Tally Lights', 'Shortcuts', 'Activators', 
    'Scripting', 'Alerts', 'About'
  ];

  const updateField = (field: keyof AppSettings, value: any) => setLocalSettings(prev => ({ ...prev, [field]: value }));

  // Fix: Made children optional to prevent JSX parsing errors in some environments
  const ControlGroup = ({ label, children, horizontal = false }: { label: string; children?: React.ReactNode; horizontal?: boolean }) => (
    <div className={`flex ${horizontal ? 'flex-row items-center justify-between gap-4' : 'flex-col gap-2'}`}>
       <label className="text-[10px] font-black text-violet-700 uppercase tracking-widest px-1 shrink-0">{label}</label>
       {children}
    </div>
  );

  const StyledSelect = ({ value, onChange, options, className = "" }: any) => (
    <div className={`relative group ${className}`}>
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full bg-white border border-teal-200 rounded-lg px-4 py-2 text-xs text-violet-950 font-bold outline-none cursor-pointer shadow-sm hover:border-violet-500 transition-all appearance-none"
      >
        {options.map((opt: any) => <option key={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-teal-600 group-hover:text-violet-600 transition-colors">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );

  const CheckboxRow = ({ label, checked, onChange, desc }: any) => (
    <label className="flex items-start gap-3 cursor-pointer group py-1">
       <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 w-4 h-4 rounded accent-violet-600 cursor-pointer" />
       <div className="flex flex-col">
          <span className="text-xs font-bold text-violet-900 group-hover:text-violet-600 transition-colors">{label}</span>
          {desc && <span className="text-[10px] text-teal-600">{desc}</span>}
       </div>
    </label>
  );

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-violet-950/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-emerald-50 border border-teal-200 rounded-[50px] shadow-[0_40px_120px_rgba(4,120,87,0.3)] w-full max-w-6xl h-full max-h-[95vh] flex overflow-hidden ring-1 ring-white/50">
        
        {/* Navigation Rail */}
        <aside className="w-72 bg-violet-700 border-r border-teal-200 flex flex-col py-10 px-6 shrink-0 overflow-hidden">
           <div className="mb-6 flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-2xl ring-1 ring-emerald-300">
                 <svg className="w-8 h-8 text-violet-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /></svg>
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">HKM System</h1>
           </div>
           
           <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2">
              {tabs.map(tab => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3.5 text-left text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border shrink-0 ${
                    activeTab === tab 
                    ? 'bg-emerald-400 border-emerald-300 text-violet-950 shadow-xl translate-x-2' 
                    : 'bg-violet-800/20 border-transparent text-violet-200 hover:text-white hover:bg-violet-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </nav>

           <div className="mt-4 grid grid-cols-2 gap-2 pt-4 border-t border-violet-500/30 shrink-0">
              <button className="py-2.5 rounded-xl bg-violet-800/50 border border-violet-500 text-[9px] font-black uppercase tracking-widest text-violet-100 hover:border-emerald-400 hover:text-white transition-all">Import</button>
              <button className="py-2.5 rounded-xl bg-violet-800/50 border border-violet-500 text-[9px] font-black uppercase tracking-widest text-violet-100 hover:border-emerald-400 hover:text-white transition-all">Export</button>
           </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden">
           <header className="h-20 px-10 flex items-center justify-between shrink-0 bg-cyan-100/20 border-b border-teal-100">
              <h2 className="text-3xl font-black text-violet-950/20 uppercase tracking-tighter select-none">{activeTab}</h2>
              <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/60 border border-teal-200 text-teal-600 hover:text-violet-950 transition-all flex items-center justify-center text-xl shadow-sm">✕</button>
           </header>

           <div className="flex-1 px-10 py-8 overflow-y-auto custom-scrollbar bg-emerald-50">
              {activeTab === 'Display' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-8 space-y-6 shadow-sm">
                      <ControlGroup label="Theme" horizontal><StyledSelect className="w-72" value={localSettings.theme} onChange={(e:any)=>updateField('theme', e.target.value)} options={['Charcoal8', 'Blue Matrix', 'Mint Pro']} /></ControlGroup>
                      <div className="flex items-center gap-12">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Preview Colour:</span>
                            <div className="w-8 h-8 rounded bg-orange-500 border border-black/20 shadow-inner"></div>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Output Colour:</span>
                            <div className="w-8 h-8 rounded bg-emerald-700 border border-black/20 shadow-inner"></div>
                         </div>
                      </div>
                      <ControlGroup label="Master Frame Rate" horizontal><StyledSelect className="w-72" value={localSettings.masterFrameRate} options={['PAL 25p', 'NTSC 30p', 'NTSC 60p']} /></ControlGroup>
                      <ControlGroup label="Output Size" horizontal><StyledSelect className="w-72" value={localSettings.outputSize} options={['1280x720', '1920x1080', '3840x2160']} /></ControlGroup>
                      <ControlGroup label="Output Aspect Ratio" horizontal><StyledSelect className="w-72" value={localSettings.aspectRatio} options={['Widescreen', 'Normal', 'Anamorphic']} /></ControlGroup>
                      
                      <div className="h-px bg-teal-100 my-4"></div>

                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Fullscreen:</span>
                         <button className="px-8 py-2.5 rounded-lg bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest shadow-md">Fullscreen 1</button>
                         <button className="px-8 py-2.5 rounded-lg bg-[#222] text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/10">Fullscreen 2</button>
                      </div>

                      <ControlGroup label="Display" horizontal><StyledSelect className="w-72" value={localSettings.fullscreen1Display} options={['1', '2', 'None']} /></ControlGroup>
                      
                      <ControlGroup label="Position" horizontal>
                         <div className="flex gap-2">
                           {[0,0,0,0].map((v, i) => <input key={i} type="number" defaultValue={v} disabled className="w-14 bg-cyan-50 border border-teal-100 rounded px-2 py-1 text-xs opacity-50" />)}
                         </div>
                      </ControlGroup>

                      <div className="grid grid-cols-3 gap-4">
                         <CheckboxRow label="Hide Cursor" checked={localSettings.hideCursor} onChange={(v:any)=>updateField('hideCursor', v)} />
                         <CheckboxRow label="On Top" checked={localSettings.onTop} onChange={(v:any)=>updateField('onTop', v)} />
                         <CheckboxRow label="Minimise" checked={localSettings.minimize} onChange={(v:any)=>updateField('minimize', v)} />
                      </div>

                      <ControlGroup label="Input Size" horizontal><StyledSelect className="w-72" value={localSettings.inputSize} options={['208x156', '240x180', '320x240', '400x300']} /></ControlGroup>
                   </div>
                </div>
              )}

              {activeTab === 'Outputs / NDI / SRT' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-8 space-y-6 shadow-sm">
                      <table className="w-full text-left">
                         <thead className="text-[9px] font-black text-teal-600 uppercase tracking-widest">
                            <tr>
                               <th className="pb-4">Slot</th>
                               <th className="pb-4">Type</th>
                               <th className="pb-4">Source</th>
                               <th className="pb-4">NDI Status</th>
                               <th className="pb-4">Overlays</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-teal-50">
                            {[1, 2].map(n => (
                               <tr key={n}>
                                  <td className="py-3"><div className="w-6 h-6 bg-[#222] text-white flex items-center justify-center text-[10px] font-black rounded">{n}</div></td>
                                  <td className="py-3 text-[10px] font-bold text-violet-950">Fullscreen</td>
                                  <td className="py-3"><StyledSelect className="w-48" options={['Output']} /></td>
                                  <td className="py-3"></td>
                                  <td className="py-3"><StyledSelect className="w-32" options={['All On']} /></td>
                               </tr>
                            ))}
                            <tr className="h-4"></tr>
                            {[1, 2, 3, 4].map(n => (
                               <tr key={n}>
                                  <td className="py-3"><div className="w-6 h-6 bg-[#222] text-white flex items-center justify-center text-[10px] font-black rounded">{n}</div></td>
                                  <td className="py-3 text-[10px] font-bold text-violet-950">Output</td>
                                  <td className="py-3"><StyledSelect className="w-48" options={['Output']} /></td>
                                  <td className="py-3">
                                     <div className="flex gap-2">
                                        <button className="px-4 py-1.5 bg-[#222] border border-white/10 rounded text-[9px] font-black text-slate-400 uppercase">NDI Off</button>
                                        <button className="p-1.5 bg-[#222] rounded text-slate-500">⚙️</button>
                                     </div>
                                  </td>
                                  <td className="py-3"><StyledSelect className="w-32" options={['All On']} /></td>
                               </tr>
                            ))}
                         </tbody>
                      </table>

                      <div className="flex gap-4">
                         <button className="px-8 py-2 bg-blue-700 text-white text-[10px] font-black uppercase rounded">Additional NDI Outputs</button>
                      </div>

                      <div className="bg-cyan-100/30 p-6 rounded-2xl border border-teal-100 space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-violet-900 uppercase">Cameras / Calls / Audio Inputs</span>
                            <button className="px-6 py-1.5 bg-[#222] rounded text-[9px] font-black text-slate-400">NDI Off</button>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-violet-900 uppercase">Audio Outputs</span>
                            <button className="px-6 py-1.5 bg-[#222] rounded text-[9px] font-black text-slate-400">NDI Off</button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] bg-blue-100 px-4 py-1.5 rounded inline-block">MultiView Layout</h4>
                         <div className="flex gap-4">
                            <button className="px-8 py-2 bg-emerald-700 text-white text-[10px] font-black uppercase rounded shadow-lg">MultiView 1</button>
                            <button className="px-8 py-2 bg-[#222] text-slate-400 text-[10px] font-black uppercase rounded">MultiView 2</button>
                         </div>
                         <div className="flex gap-3 mt-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`w-14 h-10 border rounded cursor-pointer ${i===1 ? 'bg-emerald-900/10 border-emerald-500' : 'bg-[#222] border-white/10'}`}></div>)}
                            <div className="w-14 h-10 bg-[#222] border border-white/10 flex items-center justify-center text-[8px] font-black text-slate-500 rounded">Legacy</div>
                         </div>
                         <button className="w-full py-2 bg-[#222] border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded mt-4">Customise Layout</button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'Options' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-8 space-y-6 shadow-sm">
                      <ControlGroup label="Language" horizontal><StyledSelect className="w-72" value={localSettings.language} options={['English', 'Spanish', 'French']} /></ControlGroup>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                         <div className="space-y-1">
                            <CheckboxRow label="Start in Advanced mode" checked={localSettings.startAdvancedMode} />
                            <CheckboxRow label="Start Fullscreen display" checked={localSettings.startFullscreen} />
                            <CheckboxRow label="Start Maximised" checked={localSettings.startMaximized} />
                            <CheckboxRow label="Start External Output" />
                            <CheckboxRow label="Start SRT Output" />
                            <CheckboxRow label="Remember Window Position" checked={true} />
                         </div>
                         <div className="space-y-1">
                            <CheckboxRow label="Display confirmation for Record, External, Stream and MultiCorder buttons" checked={true} />
                            <CheckboxRow label="Display confirmation for Input Close button" />
                            <div className="h-4"></div>
                            <CheckboxRow label="Automatically Play Output Input with Transition" checked={true} />
                            <CheckboxRow label="Automatically Restart Output Input with Transition" />
                            <CheckboxRow label="Automatically Pause Preview Input after Transition" checked={true} />
                         </div>
                      </div>

                      <div className="h-px bg-teal-100"></div>

                      <div className="space-y-6">
                         <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Transition Display:</span>
                            {['QuickPlay', 'Transitions 2-4', 'FTB', 'Overlay', 'T-Bar'].map(t => (
                               <CheckboxRow key={t} label={t} checked={true} />
                            ))}
                            <CheckboxRow label="Production Clocks" />
                         </div>

                         <div className="grid grid-cols-2 gap-12">
                            <ControlGroup label="QuickPlay Transition" horizontal><StyledSelect className="w-48" value={localSettings.quickPlayTransition} options={['Fade', 'Wipe', 'Slide']} /></ControlGroup>
                            <ControlGroup label="Duration" horizontal>
                               <div className="flex items-center gap-2"><input type="number" defaultValue={500} className="w-24 bg-cyan-50 border border-teal-100 rounded px-3 py-1.5 text-xs font-bold" /><span className="text-[10px] font-bold text-teal-600">Milliseconds</span></div>
                            </ControlGroup>
                         </div>

                         <ControlGroup label="Fade To Black Duration" horizontal>
                            <div className="flex items-center gap-2"><input type="number" defaultValue={500} className="w-24 bg-cyan-50 border border-teal-100 rounded px-3 py-1.5 text-xs font-bold" /><span className="text-[10px] font-bold text-teal-600">Milliseconds</span></div>
                         </ControlGroup>
                      </div>

                      <div className="h-px bg-teal-100"></div>

                      <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                         <CheckboxRow label="Activate QuickPlay by clicking Preview Window" />
                         <CheckboxRow label="Enable Sony VISCA over IP with NDI" />
                         <CheckboxRow label="Enable Triggers on T-Bar" checked={true} />
                         <CheckboxRow label="HKM Control Surface Enabled" checked={true} />
                         <CheckboxRow label="Controller Plug And Play Enabled" checked={true} />
                         <CheckboxRow label="Save Data Sources in Global Settings" />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'Performance' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-8 space-y-6 shadow-sm">
                      <ControlGroup label="Graphics Adapter">
                         <div className="flex gap-2">
                            <input type="text" value={`In Use: ${localSettings.graphicsAdapter}`} disabled className="flex-1 bg-[#222] text-white border border-white/10 rounded-sm px-4 py-2.5 text-sm font-bold" />
                            <button className="w-10 h-10 bg-[#222] text-white font-black rounded-sm border border-white/10">?</button>
                         </div>
                      </ControlGroup>

                      <div className="space-y-2 ml-1">
                         <div className="flex gap-8">
                            <CheckboxRow label="Low Latency Capture" />
                            <div className="flex items-center gap-2">
                               <CheckboxRow label="High Input Performance Mode" />
                               <span className="text-[9px] text-blue-600 font-bold italic">For graphics cards with 3GB+ memory only</span>
                            </div>
                         </div>
                         <CheckboxRow label="Show preview thumbnails when browsing NDI sources" checked={true} />
                         <CheckboxRow label="Disable Windows Update when HKM is running" checked={true} />
                         <CheckboxRow label="Show GPU / CPU alerts" />
                      </div>

                      <ControlGroup label="Display Method" horizontal><StyledSelect className="w-64" value={localSettings.displayMethod} options={['Auto', 'Legacy', 'DirectX 11']} /></ControlGroup>
                   </div>
                </div>
              )}

              {activeTab === 'Decoders' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-8 space-y-8 shadow-sm">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Preferred Deinterlacing:</h4>
                         <ControlGroup label="Camera" horizontal><StyledSelect className="w-64" value={localSettings.preferredDeinterlacingCamera} options={['Blend', 'Discard', 'Bob']} /></ControlGroup>
                         <ControlGroup label="Video Playback" horizontal><StyledSelect className="w-64" value={localSettings.preferredDeinterlacingPlayback} options={['Blend', 'Discard', 'Bob']} /></ControlGroup>
                      </div>

                      <div className="h-px bg-teal-100"></div>

                      <ControlGroup label="FFMPEG: Play the file types below using the FFMPEG decoder (Example: *.mov,*.qt,*.mxf)">
                         <input type="text" value={localSettings.ffmpegFileTypes} onChange={(e)=>updateField('ffmpegFileTypes', e.target.value)} className="w-full bg-cyan-50 border border-teal-100 rounded-sm px-4 py-2 text-xs font-mono text-violet-900" />
                      </ControlGroup>

                      <div className="h-px bg-teal-100"></div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-violet-700 uppercase tracking-widest">Direct Show:</h4>
                         <div className="grid grid-cols-[120px_1fr_auto] items-center gap-6">
                            <span className="text-xs font-bold text-violet-950">MPEG 2 Video:</span>
                            <StyledSelect value={localSettings.mpeg2VideoDecoder} options={['Auto', 'Microsoft DTV-DVD Video Decoder']} />
                            <button className="px-8 py-2 bg-[#222] text-slate-400 text-[10px] font-black uppercase rounded border border-white/10 shadow-sm">Properties</button>
                         </div>
                         <CheckboxRow label="Use HKM Deinterlacing" />

                         <div className="grid grid-cols-[120px_1fr_auto] items-center gap-6">
                            <span className="text-xs font-bold text-violet-950">MPEG Audio:</span>
                            <StyledSelect value={localSettings.mpegAudioDecoder} options={['Auto', 'AAC Filter']} />
                            <button className="px-8 py-2 bg-[#222] text-slate-400 text-[10px] font-black uppercase rounded border border-white/10 shadow-sm">Properties</button>
                         </div>

                         <div className="grid grid-cols-[120px_1fr_auto] items-center gap-6">
                            <span className="text-xs font-bold text-violet-950">x264 Video:</span>
                            <StyledSelect value={localSettings.x264VideoDecoder} options={['Auto', 'Internal Filter']} />
                            <button className="px-8 py-2 bg-[#222] text-slate-400 text-[10px] font-black uppercase rounded border border-white/10 shadow-sm">Properties</button>
                         </div>
                         
                         <div className="grid grid-cols-[120px_1fr] items-center gap-6 pt-4">
                            <span className="text-xs font-bold text-violet-950">Filters:</span>
                            <button className="py-2 bg-[#222] text-slate-400 text-[10px] font-black uppercase rounded border border-white/10 tracking-widest">Blocked Filter List</button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'Recording' && (
                <div className="max-w-4xl space-y-10 animate-in slide-in-from-bottom-4">
                   <div className="bg-white border border-teal-100 rounded-3xl p-10 space-y-8 shadow-sm">
                      <ControlGroup label="Default Folder for Recordings">
                         <div className="flex gap-3">
                            <input type="text" defaultValue="C:\Users\Client\OneDrive\Dokument\HKMStorage" className="flex-1 bg-cyan-50 border border-teal-200 rounded-xl px-4 py-3 text-xs font-mono text-blue-600" />
                            <button className="px-10 py-3 bg-violet-700 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Browse</button>
                         </div>
                      </ControlGroup>
                      
                      <ControlGroup label="Filename Format">
                         <input type="text" defaultValue="{0} - {1:dd MMMM yyyy - hh-mm-ss tt}" className="w-full bg-cyan-50 border border-teal-200 rounded-xl px-4 py-3 text-xs font-mono text-violet-900" />
                         <p className="text-[10px] text-teal-600 font-bold italic mt-2">Example - 06 January 2026 - 05-21-13 AM</p>
                      </ControlGroup>

                      <ControlGroup label="Recording Memory Buffer">
                         <input type="range" className="w-full accent-violet-600" defaultValue={10} min={0} max={100} />
                         <div className="flex justify-between text-[8px] font-black text-teal-400 uppercase mt-2">
                            {[...Array(21)].map((_, i) => <div key={i} className="w-px h-1.5 bg-teal-200"></div>)}
                         </div>
                         <p className="text-center text-xs font-black text-violet-950 mt-4">10 Frames (Between 40 MB and 80 MB for 1080p)</p>
                      </ControlGroup>

                      <CheckboxRow label="Automatically Setup Recording With Previous Settings" checked={false} onChange={() => {}} />
                   </div>
                </div>
              )}

              {['External Output', 'Audio', 'Audio Outputs', 'Web Controller', 'Tally Lights', 'Alerts', 'About'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-64 opacity-30 animate-pulse">
                   <div className="text-6xl mb-4">🛠️</div>
                   <h3 className="text-2xl font-black text-violet-900 uppercase tracking-[0.5em]">{activeTab} ENGINE READY</h3>
                </div>
              )}
           </div>

           <footer className="h-28 px-10 border-t border-teal-100 flex items-center justify-between shrink-0 bg-cyan-100/40">
              <div className="flex items-center gap-6">
                 <CheckboxRow label="Show Advanced Settings" checked={false} onChange={() => {}} />
              </div>
              <div className="flex items-center gap-6">
                 <button onClick={onClose} className="text-xs font-black text-teal-600 uppercase tracking-[0.3em] hover:text-violet-950 transition-all px-6">Discard Signals</button>
                 <div className="flex gap-3">
                    <button onClick={() => { onSave(localSettings); onClose(); }} className="px-16 py-4 rounded-[20px] bg-violet-950 text-white text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-black hover:scale-[1.03] active:scale-95 transition-all">OK</button>
                    <button onClick={onClose} className="px-16 py-4 rounded-[20px] bg-white border border-teal-200 text-violet-900 text-xs font-black uppercase tracking-[0.4em] shadow-sm hover:bg-emerald-50 transition-all">Cancel</button>
                 </div>
              </div>
           </footer>
        </main>
      </div>
    </div>
  );
};

export default SettingsModal;
