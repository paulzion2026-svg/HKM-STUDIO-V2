
import React, { useState } from 'react';

interface NDISourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSources: { id: string; name: string; lastSeen: number }[];
  onConfirm: (config: { type: 'instance' | 'hardware' | 'bridge', id?: string, name?: string, stream?: MediaStream }) => void;
}

const NDISourceModal: React.FC<NDISourceModalProps> = ({ isOpen, onClose, availableSources, onConfirm }) => {
  const [activeTab, setActiveTab] = useState<'network' | 'hardware'>('network');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCaptureHardware = async () => {
    setError(null);
    try {
      // Optimization: Using 'window' surface and 'detail' constraint for text-heavy BibleShow
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 }
        } as any,
        audio: {
          echoCancellation: false,
          noiseSuppression: false
        }
      });
      
      onConfirm({ type: 'hardware', stream });
    } catch (err: any) {
      console.error("Hardware capture failed:", err);
      if (err.name === 'NotAllowedError') {
        setError("Permission Denied: Browser or System blocked the request. If you are on macOS, ensure 'Screen Recording' is enabled for this browser in System Settings.");
      } else if (err.message.includes('Permissions policy')) {
        setError("Policy Block: Display capture is restricted by the environment policy.");
      } else {
        setError("Capture Error: " + err.message);
      }
    }
  };

  const handleConfirmInstance = () => {
    const source = availableSources.find(s => s.id === selectedId);
    if (source) {
      onConfirm({ type: 'instance', id: source.id, name: source.name });
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#2d2d2d] border border-[#444] rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#d4af37] rounded-sm text-black flex items-center justify-center text-[8px] font-black">NDI</div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">NDI® Source Selection</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex border-b border-[#333] bg-[#222]">
           <button 
             onClick={() => setActiveTab('network')}
             className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'network' ? 'bg-[#2d2d2d] text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Network Instances
           </button>
           <button 
             onClick={() => setActiveTab('hardware')}
             className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hardware' ? 'bg-[#2d2d2d] text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Hardware / BIBLESHOW
           </button>
        </div>

        <div className="p-6 bg-[#262626] min-h-[350px] flex flex-col">
          {error && (
            <div className="mb-4 p-4 bg-red-900/40 border border-red-500 rounded flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 text-red-200 font-black text-[10px] uppercase">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                SIGNAL ACQUISITION FAILED
              </div>
              <p className="text-[10px] text-red-100 leading-normal">{error}</p>
              <button onClick={handleCaptureHardware} className="mt-2 self-start bg-red-600 hover:bg-red-500 text-white text-[9px] font-black px-4 py-1.5 rounded uppercase tracking-widest">Retry Capture</button>
            </div>
          )}

          {activeTab === 'network' ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Local HKM Instances</span>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">Scanning Network...</span>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto bg-[#1a1a1a] rounded border border-[#333] mb-4">
                {availableSources.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 py-12 text-center px-8">
                     <svg className="w-8 h-8 mb-4 text-slate-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0M2 10h.01m19.98 0H22" />
                     </svg>
                     <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">To use Network NDI between instances, open another HKM Studio tab.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-[#333]">
                    {availableSources.map(source => (
                      <div 
                        key={source.id}
                        onClick={() => setSelectedId(source.id)}
                        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedId === source.id ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-[#222]'}`}
                      >
                        <div>
                          <h4 className="text-xs font-black text-white uppercase">{source.name}</h4>
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {source.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex gap-0.5 items-end h-3">
                              {[...Array(5)].map((_, i) => <div key={i} className="w-1 rounded-full bg-emerald-500" style={{ height: `${20 + i * 20}%` }}></div>)}
                           </div>
                           <span className="text-[7px] font-bold text-emerald-500 uppercase">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button 
                  disabled={!selectedId}
                  onClick={handleConfirmInstance}
                  className="px-8 py-2 rounded text-[10px] font-black text-white bg-blue-600 hover:bg-blue-500 uppercase tracking-widest disabled:opacity-20"
                >
                  Connect Instance
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-[#d4af37] mx-auto mb-4 border border-[#d4af37]/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-sm font-black text-white uppercase mb-2">Connect External BIBLESHOW</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-6">
                  Select the <strong>Window</strong> tab in the browser popup, then choose your <strong>BIBLESHOW</strong> software output window.
                </p>
                <button 
                  onClick={handleCaptureHardware}
                  className="w-full bg-[#d4af37] hover:bg-[#c4a030] text-black font-black py-3 rounded text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-yellow-900/10 active:scale-[0.98] transition-all"
                >
                  ⚡ Grab BIBLESHOW Output
                </button>
              </div>
              
              <div className="w-full border-t border-[#333] pt-6 flex flex-col gap-3">
                 <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hardware Troubleshooting:</span>
                 </div>
                 <p className="text-[8px] text-slate-500 leading-relaxed italic">
                   If the picker doesn't show BIBLESHOW, ensure the software is not minimized. <strong>macOS Users:</strong> System Preferences > Security & Privacy > Privacy > Screen Recording must be checked for your browser.
                 </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-[#1a1a1a] border-t border-[#333] flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-1.5 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-[#333]">CANCEL</button>
        </div>
      </div>
    </div>
  );
};

export default NDISourceModal;
