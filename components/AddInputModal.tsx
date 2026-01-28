
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { SourceType } from '../types';

interface AddInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: SourceType, configs: any[]) => void;
}

const AddInputModal: React.FC<AddInputModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState<SourceType>('video');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [color, setColor] = useState('#3a612d');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { type: 'video', label: 'Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { type: 'camera', label: 'Camera / SDI', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
    { type: 'web', label: 'Browser', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { type: 'ndi', label: 'NDI® / IP', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { type: 'stream', label: 'SRT / Stream', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2 10h.01m19.98 0H22' },
    { type: 'title', label: 'Graphics / Titles', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { type: 'audio', label: 'Audio / Music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { type: 'color', label: 'Solid Color', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
  ] as {type: SourceType, label: string, icon: string}[];

  const stopTracks = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => { track.stop(); track.enabled = false; });
    }
  };

  useEffect(() => {
    if (isOpen && (activeTab === 'camera' || activeTab === 'audio-input')) {
      navigator.mediaDevices.enumerateDevices().then(d => {
        const kind = activeTab === 'camera' ? 'videoinput' : 'audioinput';
        const filtered = d.filter(device => device.kind === kind);
        setDevices(filtered);
        if (filtered.length > 0 && !selectedDeviceId) setSelectedDeviceId(filtered[0].deviceId);
      });
    }
  }, [activeTab, isOpen, selectedDeviceId]);

  useEffect(() => {
    let isMounted = true;
    let currentStream: MediaStream | null = null;

    const startPreview = async (deviceId: string) => {
      setErrorMessage(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia(activeTab === 'camera' 
          ? { video: { deviceId: { exact: deviceId }, width: 1280, height: 720 } }
          : { audio: { deviceId: { exact: deviceId } } }
        );
        if (!isMounted) { stopTracks(stream); return; }
        currentStream = stream; setPreviewStream(stream);
      } catch (err: any) { setErrorMessage(`Signal Blocked: ${err.message}`); }
    };

    if (isOpen && (activeTab === 'camera' || activeTab === 'audio-input')) {
      if (selectedDeviceId) startPreview(selectedDeviceId);
    } else { setPreviewStream(null); }
    return () => { isMounted = false; stopTracks(currentStream); };
  }, [isOpen, activeTab, selectedDeviceId]);

  useEffect(() => {
    if (videoPreviewRef.current && previewStream) videoPreviewRef.current.srcObject = previewStream;
  }, [previewStream]);

  const handleOk = () => {
    const type = activeTab as SourceType;
    let configs: any[] = selectedFiles.length > 0 ? selectedFiles.map(file => ({ file })) : [{ name: type.toUpperCase() }];
    if (type === 'web') configs = [{ url: (document.getElementById('web-url-input') as HTMLInputElement)?.value || 'https://hkm.studio' }];
    if (type === 'color') configs = [{ color: color }];
    onSelect(type, configs);
    setSelectedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <div className="bg-[#0f0f11] border border-white/10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,1)] w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-500">
        
        {/* Navigation Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 bg-black/40 border-r border-white/5 flex flex-col py-8 shrink-0">
            <div className="px-8 mb-8">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Signal Engine</h2>
              <h1 className="text-xl font-black text-white uppercase italic">Input Studio</h1>
            </div>
            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar px-3">
              {categories.map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => { setActiveTab(cat.type); setSelectedFiles([]); }}
                  className={`flex items-center gap-4 px-5 py-4 transition-all rounded-2xl group ${
                    activeTab === cat.type ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-white/30 hover:bg-white/5 hover:text-white/60'
                  }`}
                >
                  <svg className={`w-5 h-5 transition-transform ${activeTab === cat.type ? 'scale-110' : 'group-hover:scale-105'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={cat.icon} />
                  </svg>
                  <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Staging Area */}
          <main className="flex-1 p-12 bg-gradient-to-br from-white/5 to-transparent flex flex-col overflow-hidden">
            {['video', 'audio', 'image', 'title'].includes(activeTab) ? (
              <div className="flex-1 flex flex-col gap-8 overflow-hidden">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-black/20 flex flex-col items-center justify-center text-center p-12 hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group"
                >
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))} />
                  <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">Acquire Media</h3>
                  <p className="text-sm text-white/40 font-medium">Drop files or click to browse local storage</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="h-48 bg-black/40 rounded-3xl border border-white/5 p-6 flex flex-col gap-4 overflow-hidden animate-in slide-in-from-bottom-8">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Selection Queue ({selectedFiles.length})</span>
                      <button onClick={() => setSelectedFiles([])} className="text-[10px] text-red-500 font-bold hover:underline">Clear Queue</button>
                    </div>
                    <div className="flex-1 overflow-x-auto flex gap-3 pb-2 custom-scrollbar">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="min-w-[180px] bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between shrink-0">
                          <span className="text-[11px] font-bold text-white truncate">{file.name}</span>
                          <span className="text-[9px] text-white/30 font-black uppercase mt-1">{(file.size / (1024*1024)).toFixed(1)} MB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'camera' ? (
              <div className="flex-1 flex flex-col gap-8">
                 <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                    <video ref={videoPreviewRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {!previewStream && !errorMessage && <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-black tracking-widest animate-pulse">LOCKING SIGNAL...</div>}
                    {errorMessage && <div className="absolute inset-0 bg-red-600/20 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-4xl mb-4">⚠️</span>
                      <h4 className="text-lg font-black uppercase text-red-500">{errorMessage}</h4>
                    </div>}
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-2">Capture Matrix</label>
                    <select value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none">
                      {devices.map(d => <option key={d.deviceId} value={d.deviceId} className="bg-[#111]">{d.label || `Device ${d.deviceId.slice(0,6)}`}</option>)}
                    </select>
                 </div>
              </div>
            ) : activeTab === 'web' ? (
              <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full gap-8">
                <div className="text-center">
                   <div className="text-6xl mb-6">🌐</div>
                   <h2 className="text-3xl font-black text-white uppercase italic mb-2">Web Endpoint</h2>
                   <p className="text-white/40 text-sm">Integrate remote overlays or live websites directly</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] ml-4">Source URL</label>
                  <input id="web-url-input" type="text" defaultValue="https://hkm.studio" className="w-full bg-black border border-white/10 rounded-3xl px-8 py-5 text-lg font-mono text-blue-400 focus:border-blue-500 outline-none shadow-2xl" />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                 <div className="text-8xl mb-8">💎</div>
                 <h2 className="text-2xl font-black uppercase tracking-[0.8em]">{activeTab} Interface</h2>
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="h-28 bg-black/60 border-t border-white/5 flex items-center justify-end px-12 gap-8 shrink-0">
          <button onClick={onClose} className="text-xs font-black text-white/30 uppercase tracking-[0.4em] hover:text-white transition-all">Cancel</button>
          <button 
            onClick={handleOk} 
            disabled={(activeTab === 'camera' && !selectedDeviceId) || (['video', 'audio', 'image'].includes(activeTab) && selectedFiles.length === 0)}
            className="px-20 h-14 bg-blue-600 rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-blue-500 active:scale-95 disabled:opacity-20 transition-all shadow-blue-900/40"
          >
            Deploy Signal
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddInputModal;
