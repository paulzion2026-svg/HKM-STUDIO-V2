
import React from 'react';
import { OverlayLayer } from '../types';

interface TitlerPanelProps {
  overlays: OverlayLayer[];
  onToggleOverlay: (id: string) => void;
  onUpdateContent: (id: string, content: { line1: string; line2?: string }) => void;
}

const TitlerPanel: React.FC<TitlerPanelProps> = ({ overlays, onToggleOverlay, onUpdateContent }) => {
  return (
    <div className="p-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Lower Thirds</h3>
        <button className="text-[10px] text-blue-400 font-bold hover:underline">+ ADD TEMPLATE</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overlays.map(overlay => (
          <div key={overlay.id} className={`bg-slate-800 rounded-lg p-4 border transition-all ${overlay.visible ? 'border-blue-500 ring-2 ring-blue-900/20' : 'border-slate-700'}`}>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <input 
                  type="text"
                  value={overlay.content.line1}
                  onChange={e => onUpdateContent(overlay.id, { ...overlay.content, line1: e.target.value })}
                  placeholder="Line 1 (e.g. Speaker Name)"
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text"
                  value={overlay.content.line2}
                  onChange={e => onUpdateContent(overlay.id, { ...overlay.content, line2: e.target.value })}
                  placeholder="Line 2 (e.g. Title)"
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <button 
                onClick={() => onToggleOverlay(overlay.id)}
                className={`w-16 rounded-lg font-bold text-xs transition-colors ${
                  overlay.visible ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                }`}
              >
                {overlay.visible ? 'LIVE' : 'SHOW'}
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
               <span className="font-mono">ID: {overlay.id}</span>
               <div className="flex gap-2">
                  <button className="hover:text-blue-400">EDIT STYLE</button>
                  <button className="hover:text-red-400">DELETE</button>
               </div>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center p-8">
           <span className="text-xs text-slate-600 font-bold">TEMPLATES LIBRARY (FREE)</span>
        </div>
      </div>
    </div>
  );
};

export default TitlerPanel;
