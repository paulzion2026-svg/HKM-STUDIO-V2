
import React, { useEffect, useState } from 'react';
import { StudioSource, OverlayLayer } from '../types';

const NDIOutput: React.FC = () => {
  const [source, setSource] = useState<Partial<StudioSource> | null>(null);
  const [overlays, setOverlays] = useState<OverlayLayer[]>([]);
  const [isFTB, setIsFTB] = useState(false);

  useEffect(() => {
    // Get the source ID from URL
    const params = new URLSearchParams(window.location.search);
    const sourceId = params.get('sourceId');
    
    if (!sourceId) return;

    // Listen only to the specific stream for this output window
    const channel = new BroadcastChannel(`hkm-stream-${sourceId}`);
    
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_PROGRAM') {
        setSource(payload.source);
        setOverlays(payload.overlays || []);
        setIsFTB(payload.ftbActive || false);
      }
    };

    // Initial Request
    channel.postMessage({ type: 'REQUEST_SYNC' });

    // Discovery Heartbeat (Clean feed also announces itself)
    const discovery = new BroadcastChannel('hkm-ndi-discovery');
    const interval = setInterval(() => {
      discovery.postMessage({
        type: 'NDI_HEARTBEAT',
        id: `OUTPUT-${sourceId}`,
        name: `Clean Feed (${sourceId})`
      });
    }, 2000);

    return () => {
      channel.close();
      discovery.close();
      clearInterval(interval);
    };
  }, []);

  const renderContent = () => {
    if (isFTB) return <div className="w-full h-full bg-black"></div>;
    if (!source) return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
         <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
         <p className="text-slate-600 mt-4 font-black uppercase tracking-widest text-2xl">Awaiting Signal...</p>
      </div>
    );

    switch (source.type) {
      case 'web':
        return (
          <iframe 
            src={source.mediaUrl} 
            className="w-full h-full border-none pointer-events-none"
            allow="autoplay; fullscreen; encrypted-media"
          />
        );
      case 'image':
        return <img src={source.mediaUrl} className="w-full h-full object-contain bg-black" alt="" />;
      case 'video':
        return <video src={source.mediaUrl} autoPlay muted loop className="w-full h-full object-cover" />;
      case 'color':
        return <div className="w-full h-full" style={{ backgroundColor: source.color }}></div>;
      case 'bible':
        // If text is cleared, render transparent for NDI Key/Fill workflows
        if (!source.bibleText || source.bibleText.trim() === '') {
           return <div className="w-full h-full bg-transparent"></div>;
        }

        const textLength = source.bibleText?.length || 0;
        // High-precision fluid scaling for 4K/1080p outputs:
        const fontSize = textLength > 600 ? '1.8rem' :
                         textLength > 450 ? '2.3rem' :
                         textLength > 300 ? '3.0rem' : 
                         textLength > 200 ? '4.0rem' : 
                         textLength > 100 ? '5.4rem' : '7.0rem';
        
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#1e3c72] select-none overflow-hidden relative">
             <div className="absolute inset-0 bg-black/15 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)]"></div>
             {/* Wide Padding Layout: px-[6%] and py-[6%] to ensure full verse visibility */}
             <div className="z-10 flex flex-col items-center justify-center h-full w-full py-[6%] px-[6%] text-center">
               
               {/* Reference */}
               <div className="absolute top-[6%] inset-x-0 flex flex-col items-center shrink-0">
                  <h2 className="text-4xl font-serif text-white/80 uppercase tracking-[0.3em] px-12 leading-none font-bold drop-shadow-2xl">
                    {source.bibleRef}
                  </h2>
                  <div className="w-40 h-[2px] bg-white/20 mt-6 shadow-2xl"></div>
               </div>

               {/* Verse Content: Expanded height bounds, aggressive scaling */}
               <div className="flex-1 flex items-center justify-center w-full mt-16 overflow-hidden relative">
                 <p className="font-serif leading-[1.3] text-white italic px-8 transition-all duration-300 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]" 
                    style={{ 
                      fontSize, 
                      overflowWrap: 'break-word',
                      textWrap: 'balance', 
                      letterSpacing: '-0.01em',
                      maxHeight: '100%' // Prevents overflow from being hidden or cropped incorrectly
                    } as any}>
                   "{source.bibleText}"
                 </p>
               </div>

               {/* Part Indicator */}
               {source.biblePart && (
                 <div className="absolute bottom-[6%] inset-x-0 flex justify-center">
                    <span className="text-xl font-black text-white/10 uppercase tracking-[0.6em]">{source.biblePart}</span>
                 </div>
               )}
             </div>
          </div>
        );
      default:
        return <div className="w-full h-full bg-black flex items-center justify-center text-slate-800 font-black text-4xl uppercase tracking-tighter">No Valid Input Signal</div>;
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {renderContent()}
      
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none p-12 flex items-end">
        {overlays.filter(o => o.visible).map(overlay => (
          <div key={overlay.id} className="bg-gradient-to-r from-[#003366]/90 to-transparent border-l-8 border-orange-500 px-8 py-4 shadow-2xl animate-in slide-in-from-left duration-700">
             <h3 className="text-white text-4xl font-black uppercase tracking-tight">{overlay.content.line1}</h3>
             <p className="text-orange-400 text-xl font-bold">{overlay.content.line2}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NDIOutput;
