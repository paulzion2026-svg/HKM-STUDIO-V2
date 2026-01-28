
import React, { useState } from 'react';

interface WebInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string, width: number, height: number) => void;
}

const WebInputModal: React.FC<WebInputModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  if (!isOpen) return null;

  const handleConfirm = () => {
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    onConfirm(finalUrl, width, height);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#2d2d2d] border border-[#444] rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#333]">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Web Browser Settings</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-[#262626]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">URL / File Path</label>
            <input
              autoFocus
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-[#1a1a1a] border border-[#444] rounded px-3 py-2 text-xs text-blue-400 focus:outline-none focus:border-blue-500 w-full font-mono"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="bg-[#1a1a1a] border border-[#444] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="bg-[#1a1a1a] border border-[#444] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-full"
              />
            </div>
          </div>

          <div className="mt-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded">
            <p className="text-[9px] text-blue-300 leading-relaxed italic">
              Note: Some websites may prevent being embedded in frames for security reasons (X-Frame-Options).
            </p>
          </div>
        </div>

        <div className="px-4 py-3 bg-[#1a1a1a] border-t border-[#333] flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-1.5 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-[#333]">CANCEL</button>
           <button 
             onClick={handleConfirm}
             className="px-6 py-1.5 rounded text-[10px] font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 uppercase tracking-widest"
           >
             OK
           </button>
        </div>
      </div>
    </div>
  );
};

export default WebInputModal;
