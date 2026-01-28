import React, { useState, useEffect, useMemo } from 'react';
import { BibleTheme, MotionEffect } from '../types';

// Mock large-scale theme generation (200 Full, 200 Lower Thirds)
const generateThemeLibrary = (): BibleTheme[] => {
  const library: BibleTheme[] = [];
  const categories: ('full' | 'lowerthird')[] = ['full', 'lowerthird'];
  const colors = ['#4169e1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  const motions: MotionEffect[] = ['particles', 'bubbles', 'flares', 'clouds', 'energy', 'snow', 'none'];

  categories.forEach(cat => {
    for (let i = 1; i <= 200; i++) {
      const colorIndex = i % colors.length;
      const motionIndex = i % motions.length;
      const isAnimated = i % 3 === 0;
      
      library.push({
        id: `${cat}-${i}`,
        name: `${cat === 'full' ? 'Majestic' : 'Grace'} Theme ${i}`,
        category: cat,
        background: i % 2 === 0 
          ? `linear-gradient(135deg, ${colors[colorIndex]}cc, #000000)` 
          : colors[colorIndex],
        textColor: '#ffffff',
        accentColor: colors[(colorIndex + 2) % colors.length],
        fontFamily: i % 5 === 0 ? 'Playfair Display' : 'Inter',
        motionEffect: motions[motionIndex],
        motionIntensity: 50 + (i % 50),
        overlayOpacity: 0.8,
        isAnimated: isAnimated
      });
    }
  });
  return library;
};

const THEME_LIBRARY = generateThemeLibrary();

interface ThemeCardProps {
  theme: BibleTheme;
  isActive: boolean;
  onSelect: (theme: BibleTheme) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(theme)}
      className={`relative group cursor-pointer rounded-lg border-2 transition-all h-32 overflow-hidden flex flex-col ${isActive ? 'border-blue-600 ring-2 ring-blue-400/20' : 'border-slate-200 hover:border-slate-400'}`}
    >
      <div className="flex-1 relative" style={{ background: theme.background }}>
         {theme.isAnimated && (
           <div className="absolute top-1 right-1 px-1 bg-yellow-400 text-[8px] font-black text-black rounded uppercase">Motion</div>
         )}
         <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{theme.category === 'full' ? 'FULL' : 'LT'}</span>
         </div>
      </div>
      <div className="bg-white p-2 flex items-center justify-between shrink-0">
         <span className="text-[9px] font-black text-slate-700 truncate pr-2 uppercase italic tracking-tighter">{theme.name}</span>
         {isActive && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
      </div>
    </div>
  );
};

interface ScriptureOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScriptureOptionsModal: React.FC<ScriptureOptionsModalProps> = ({ isOpen, onClose }) => {
  const [activeTopTab, setActiveTopTab] = useState('Themes');
  const [activeSideTab, setActiveSideTab] = useState('Library');
  const [themeCategory, setThemeCategory] = useState<'full' | 'lowerthird'>('full');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [maxWords, setMaxWords] = useState(40);

  useEffect(() => {
    const saved = localStorage.getItem('hkm_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.maxWordsPerSlide) setMaxWords(parsed.maxWordsPerSlide);
      if (parsed.activeBibleThemeId) setSelectedThemeId(parsed.activeBibleThemeId);
    }
  }, [isOpen]);

  const filteredThemes = useMemo(() => {
    return THEME_LIBRARY.filter(t => 
      t.category === themeCategory && 
      (searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [themeCategory, searchQuery]);

  const handleApplyTheme = (theme: BibleTheme) => {
    setSelectedThemeId(theme.id);
    const saved = localStorage.getItem('hkm_settings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.activeBibleThemeId = theme.id;
    localStorage.setItem('hkm_settings', JSON.stringify(settings));
    
    // Broadcast change to other components
    window.dispatchEvent(new CustomEvent('hkm_theme_update', { detail: theme }));
  };

  const handleMaxWordsChange = (val: number) => {
    setMaxWords(val);
    const saved = localStorage.getItem('hkm_settings');
    const settings = saved ? JSON.parse(saved) : {};
    settings.maxWordsPerSlide = val;
    localStorage.setItem('hkm_settings', JSON.stringify(settings));
  };

  const getSideTabs = () => {
    switch (activeTopTab) {
      case 'Themes': return ['Library', 'Motion', 'Presets', 'History'];
      case 'Configure': return ['Display', 'Aspect', 'Transitions', 'Copyright', 'Background', 'Layout', 'Text'];
      case 'Bibles': return ['Versions', 'Search', 'Filters'];
      default: return ['General'];
    }
  };

  const sideTabs = getSideTabs();

  if (!isOpen) return null;

  const topTabs = ['Themes', 'Configure', 'Bibles'];

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#f0f4f8] border-2 border-blue-900/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-sans select-none h-[85vh]">
        
        {/* Modal Header */}
        <div className="h-12 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-between px-6 shrink-0 border-b border-black/20">
          <div className="flex items-center gap-3">
             <div className="text-white text-xl">📖</div>
             <h1 className="text-white text-sm font-black tracking-widest uppercase italic">Scripture Engine Settings</h1>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-red-500 text-white rounded-full transition-all text-xs">✕</button>
        </div>

        {/* Top Tab Bar */}
        <div className="flex px-4 pt-4 gap-2 shrink-0 bg-blue-900/5 border-b border-blue-200">
          {topTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTopTab(tab)}
              className={`px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-t-xl transition-all border-t border-x ${
                activeTopTab === tab 
                ? 'bg-white border-blue-200 text-blue-900 shadow-xl' 
                : 'bg-slate-200/50 border-transparent text-slate-500 hover:bg-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Side Tabs Navigation */}
          <div className="w-44 bg-white/50 flex flex-col gap-1 p-4 shrink-0 border-r border-blue-100">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Navigation</h4>
            {sideTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSideTab(tab)}
                className={`py-3 px-4 text-left text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                  activeSideTab === tab 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Scroll View */}
          <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar-blue">
            
            {activeTopTab === 'Themes' && activeSideTab === 'Library' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8 gap-4 shrink-0">
                   <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button 
                        onClick={() => setThemeCategory('full')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${themeCategory === 'full' ? 'bg-white text-blue-800 shadow-md' : 'text-slate-400'}`}
                      >
                        Full Frame
                      </button>
                      <button 
                        onClick={() => setThemeCategory('lowerthird')}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${themeCategory === 'lowerthird' ? 'bg-white text-blue-800 shadow-md' : 'text-slate-400'}`}
                      >
                        Lower Thirds
                      </button>
                   </div>
                   <div className="relative flex-1 max-w-sm">
                      <input 
                        type="text" 
                        placeholder="Search Library (200+ presets)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 text-xs font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔍</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                   {filteredThemes.map(theme => (
                     <ThemeCard 
                       key={theme.id} 
                       theme={theme} 
                       isActive={selectedThemeId === theme.id} 
                       onSelect={handleApplyTheme} 
                     />
                   ))}
                </div>
              </div>
            )}

            {activeTopTab === 'Themes' && activeSideTab === 'Motion' && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                     <h3 className="text-sm font-black text-blue-900 uppercase italic mb-4">Live Particle Engine</h3>
                     <p className="text-xs text-blue-800/60 leading-relaxed mb-6">Select a secondary motion overlay to run on top of your selected bible theme.</p>
                     
                     <div className="grid grid-cols-3 gap-4">
                        {['Holy Particles', 'Deep Bubbles', 'Ethereal Flares', 'Atmospheric Clouds', 'Energy Waves', 'Graceful Snow'].map(m => (
                          <button key={m} className="p-4 bg-white border border-blue-100 rounded-xl text-[10px] font-black uppercase text-blue-900 hover:bg-blue-600 hover:text-white transition-all">{m}</button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Motion Intensity</h4>
                     <input type="range" className="w-full accent-blue-600" />
                     <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                        <span>Subtle</span>
                        <span>Hyper-Dynamic</span>
                     </div>
                  </div>
               </div>
            )}

            {activeTopTab === 'Configure' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                 {activeSideTab === 'Aspect' && (
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Max Words Per Slide</span>
                           <span className="bg-blue-100 px-3 py-1 rounded text-[11px] font-black text-blue-700">{maxWords} Words</span>
                        </div>
                        <input 
                          type="range" min="10" max="150" step="5" value={maxWords} 
                          onChange={(e) => handleMaxWordsChange(parseInt(e.target.value))}
                          className="w-full accent-blue-600" 
                        />
                        <p className="text-[10px] text-slate-400 mt-3 italic">HKM Engine will automatically calculate PART A/B/C logic based on this threshold.</p>
                      </div>
                    </div>
                 )}
                 {/* Placeholder for other configure tabs */}
                 {activeSideTab !== 'Aspect' && (
                    <div className="flex flex-col items-center justify-center h-64 opacity-20">
                       <div className="text-5xl mb-4">⚙️</div>
                       <span className="text-xs font-black uppercase tracking-widest">Operational Module: {activeSideTab}</span>
                    </div>
                 )}
              </div>
            )}

          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="h-16 bg-white border-t border-blue-200 px-8 flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Library Ready</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[9px] font-black text-blue-900/40 uppercase tracking-widest">Total Presets: 400</span>
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-8 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Cancel</button>
              <button onClick={onClose} className="px-10 py-2.5 rounded-xl bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/30 hover:bg-blue-800 transition-all">Apply to Signal</button>
           </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar-blue::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-blue::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-blue::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f0f4f8; }
        .custom-scrollbar-blue::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
};

export default ScriptureOptionsModal;