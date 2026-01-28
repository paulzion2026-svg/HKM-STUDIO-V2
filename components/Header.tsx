import React from 'react';

interface HeaderProps {
  isLive: boolean;
  isConnecting: boolean;
  onGoLive: () => void;
  onTabChange: (tab: 'sources' | 'bible' | 'titler') => void;
  activeTab: string;
  isBottomVisible: boolean;
  onOpenSystemSettings?: () => void;
  gpuAcceleration: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  isLive, isConnecting, onGoLive, onTabChange, activeTab, isBottomVisible, onOpenSystemSettings, gpuAcceleration 
}) => {
  const getTabStyle = (tab: string) => {
    const isActive = activeTab === tab;
    if (isActive) {
      return isBottomVisible 
        ? 'bg-[#4169e1] text-white border-b-2 border-white' 
        : 'bg-[#4169e1]/40 text-white/60 border-b border-white/20';
    }
    return 'bg-[#1e293b] text-slate-400 border border-black/40';
  };

  return (
    <header className="h-14 bg-[#0f172a] border-b border-black flex items-center px-2 gap-1 shrink-0">
      <div className="flex flex-col items-center justify-center px-4 mr-2">
        <div className="flex items-center gap-2">
          {/* Professional Crown Logo */}
          <div className="w-6 h-6 flex items-center justify-center text-[#d4af37]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
            </svg>
          </div>
          <span className="text-[14px] font-black text-[#d4af37] tracking-tighter uppercase leading-none">HKM Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-black/20 p-1 rounded">
        <button className="bg-[#4169e1] hover:bg-[#5279f2] px-3 py-1.5 rounded-sm text-[10px] font-bold border border-black/40">New</button>
        <button className="bg-[#4169e1] hover:bg-[#5279f2] px-3 py-1.5 rounded-sm text-[10px] font-bold border border-black/40">Open</button>
        <button className="bg-[#4169e1] hover:bg-[#5279f2] px-3 py-1.5 rounded-sm text-[10px] font-bold border border-black/40">Save</button>
        
        <div className="flex bg-[#1e293b] rounded border border-black/40">
          <button className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:bg-[#2d333d]">Save As</button>
          <div className="w-px bg-black/40"></div>
          <button className="px-1 py-1 hover:bg-[#2d333d] text-slate-400">▼</button>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4 overflow-hidden">
        <button onClick={() => onTabChange('sources')} className={`h-9 px-3 flex flex-col items-center justify-center rounded-sm text-[9px] font-bold transition-all ${getTabStyle('sources')}`}>
          <span className="text-sm">🎞️</span> Sources
        </button>
        <button onClick={() => onTabChange('bible')} className={`h-9 px-3 flex flex-col items-center justify-center rounded-sm text-[9px] font-bold transition-all ${getTabStyle('bible')}`}>
          <span className="text-sm">📖</span> Scripture
        </button>
        <button onClick={() => onTabChange('titler')} className={`h-9 px-3 flex flex-col items-center justify-center rounded-sm text-[9px] font-bold transition-all ${getTabStyle('titler')}`}>
          <span className="text-sm">T</span> Titler
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded border border-[#1e293b] text-[9px] font-bold">
          <div className={`w-2 h-2 rounded-full transition-colors ${gpuAcceleration ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div> 
          {gpuAcceleration ? 'NVENC (GPU)' : 'SOFTWARE (CPU)'}
        </div>
        <button onClick={onOpenSystemSettings} className="bg-[#1e293b] hover:bg-[#2d333d] p-1.5 rounded-sm text-slate-500 font-bold border border-black/40 flex items-center justify-center" title="System Settings">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /></svg>
        </button>
        <button 
          onClick={onGoLive}
          disabled={isConnecting}
          className={`px-4 py-1.5 rounded-sm font-black text-xs transition-all uppercase tracking-tight flex items-center gap-2 ${
            isLive ? 'bg-red-600 text-white ring-1 ring-red-500 animate-pulse' : 
            isConnecting ? 'bg-[#1e293b] text-yellow-500 cursor-wait' :
            'bg-[#065f46] text-white hover:bg-[#047857]'
          }`}
        >
          {isConnecting && <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>}
          {isLive ? 'End Stream' : isConnecting ? 'Connecting...' : 'Stream'}
        </button>
        <button className="bg-[#1e293b] p-1.5 rounded-sm text-slate-500 font-bold border border-black/40">?</button>
      </div>
    </header>
  );
};

export default Header;