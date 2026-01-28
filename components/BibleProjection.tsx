
import React, { useState, useEffect, useMemo, useRef } from 'react';

interface BibleBook {
  name: string;
  short: string;
  chapters: number;
  id: number;
  testament: 'Old' | 'New';
}

const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 1, name: "Genesis", short: "Gen", chapters: 50, testament: 'Old' },
  { id: 2, name: "Exodus", short: "Exo", chapters: 40, testament: 'Old' },
  { id: 3, name: "Leviticus", short: "Lev", chapters: 27, testament: 'Old' },
  { id: 4, name: "Numbers", short: "Num", chapters: 36, testament: 'Old' },
  { id: 5, name: "Deuteronomy", short: "Deu", chapters: 34, testament: 'Old' },
  { id: 6, name: "Joshua", short: "Jos", chapters: 24, testament: 'Old' },
  { id: 7, name: "Judges", short: "Jdg", chapters: 21, testament: 'Old' },
  { id: 8, name: "Ruth", short: "Rut", chapters: 4, testament: 'Old' },
  { id: 9, name: "1 Samuel", short: "1Sa", chapters: 31, testament: 'Old' },
  { id: 10, name: "2 Samuel", short: "2Sa", chapters: 24, testament: 'Old' },
  { id: 11, name: "1 Kings", short: "1Ki", chapters: 22, testament: 'Old' },
  { id: 12, name: "2 Kings", short: "2Ki", chapters: 25, testament: 'Old' },
  { id: 13, name: "1 Chronicles", short: "1Ch", chapters: 29, testament: 'Old' },
  { id: 14, name: "2 Chronicles", short: "2Ch", chapters: 36, testament: 'Old' },
  { id: 15, name: "Ezra", short: "Ezr", chapters: 10, testament: 'Old' },
  { id: 16, name: "Nehemiah", short: "Neh", chapters: 13, testament: 'Old' },
  { id: 17, name: "Esther", short: "Est", chapters: 10, testament: 'Old' },
  { id: 18, name: "Job", short: "Job", chapters: 42, testament: 'Old' },
  { id: 19, name: "Psalms", short: "Psa", chapters: 150, testament: 'Old' },
  { id: 20, name: "Proverbs", short: "Pro", chapters: 31, testament: 'Old' },
  { id: 21, name: "Ecclesiastes", short: "Ecc", chapters: 12, testament: 'Old' },
  { id: 22, name: "Song of Solomon", short: "Sng", chapters: 8, testament: 'Old' },
  { id: 23, name: "Isaiah", short: "Isa", chapters: 66, testament: 'Old' },
  { id: 24, name: "Jeremiah", short: "Jer", chapters: 52, testament: 'Old' },
  { id: 25, name: "Lamentations", short: "Lam", chapters: 5, testament: 'Old' },
  { id: 26, name: "Ezekiel", short: "Ezk", chapters: 48, testament: 'Old' },
  { id: 27, name: "Daniel", short: "Dan", chapters: 12, testament: 'Old' },
  { id: 28, name: "Hosea", short: "Hos", chapters: 14, testament: 'Old' },
  { id: 29, name: "Joel", short: "Jol", chapters: 3, testament: 'Old' },
  { id: 30, name: "Amos", short: "Amo", chapters: 9, testament: 'Old' },
  { id: 31, name: "Obadiah", short: "Oba", chapters: 1, testament: 'Old' },
  { id: 32, name: "Jonah", short: "Jon", chapters: 4, testament: 'Old' },
  { id: 33, name: "Micah", short: "Mic", chapters: 7, testament: 'Old' },
  { id: 34, name: "Nahum", short: "Nah", chapters: 3, testament: 'Old' },
  { id: 35, name: "Habakkuk", short: "Hab", chapters: 3, testament: 'Old' },
  { id: 36, name: "Zephaniah", short: "Zep", chapters: 3, testament: 'Old' },
  { id: 37, name: "Haggai", short: "Hag", chapters: 2, testament: 'Old' },
  { id: 38, name: "Zechariah", short: "Zec", chapters: 14, testament: 'Old' },
  { id: 39, name: "Malachi", short: "Mal", chapters: 4, testament: 'Old' },
  // New Testament
  { id: 40, name: "Matthew", short: "Mat", chapters: 28, testament: 'New' },
  { id: 41, name: "Mark", short: "Mrk", chapters: 16, testament: 'New' },
  { id: 42, name: "Luke", short: "Luk", chapters: 24, testament: 'New' },
  { id: 43, name: "John", short: "Joh", chapters: 21, testament: 'New' },
  { id: 44, name: "Acts", short: "Act", chapters: 28, testament: 'New' },
  { id: 45, name: "Romans", short: "Rom", chapters: 16, testament: 'New' },
  { id: 46, name: "1 Corinthians", short: "1Co", chapters: 16, testament: 'New' },
  { id: 47, name: "2 Corinthians", short: "2Co", chapters: 13, testament: 'New' },
  { id: 48, name: "Galatians", short: "Gal", chapters: 6, testament: 'New' },
  { id: 49, name: "Ephesians", short: "Eph", chapters: 6, testament: 'New' },
  { id: 50, name: "Philippians", short: "Phi", chapters: 4, testament: 'New' },
  { id: 51, name: "Colossians", short: "Col", chapters: 4, testament: 'New' },
  { id: 52, name: "1 Thessalonians", short: "1Th", chapters: 5, testament: 'New' },
  { id: 53, name: "2 Thessalonians", short: "2Th", chapters: 3, testament: 'New' },
  { id: 54, name: "1 Timothy", short: "1Ti", chapters: 6, testament: 'New' },
  { id: 55, name: "2 Timothy", short: "2Ti", chapters: 4, testament: 'New' },
  { id: 56, name: "Titus", short: "Tit", chapters: 3, testament: 'New' },
  { id: 57, name: "Philemon", short: "Phm", chapters: 1, testament: 'New' },
  { id: 58, name: "Hebrews", short: "Heb", chapters: 13, testament: 'New' },
  { id: 59, name: "James", short: "Jam", chapters: 5, testament: 'New' },
  { id: 60, name: "1 Peter", short: "1Pe", chapters: 5, testament: 'New' },
  { id: 61, name: "2 Peter", short: "2Pe", chapters: 3, testament: 'New' },
  { id: 62, name: "1 John", short: "1Jn", chapters: 5, testament: 'New' },
  { id: 63, name: "2 John", short: "2Jn", chapters: 1, testament: 'New' },
  { id: 64, name: "3 John", short: "3Jn", chapters: 1, testament: 'New' },
  { id: 65, name: "Jude", short: "Jud", chapters: 1, testament: 'New' },
  { id: 66, name: "Revelation", short: "Rev", chapters: 22, testament: 'New' },
];

const BIBLE_VERSIONS = [
  { id: "KJV", name: "King James Version" },
  { id: "NKJV", name: "New King James Version" },
  { id: "NIV", name: "New International Version" },
  { id: "ESV", name: "English Standard Version" },
  { id: "NLT", name: "New Living Translation" },
  { id: "AMP", name: "Amplified Bible" },
  { id: "NASB", name: "New American Standard Bible" },
  { id: "RSV", name: "Revised Standard Version" },
  { id: "ASV", name: "American Standard Version" },
  { id: "WEB", name: "World English Bible" },
  { id: "YLT", name: "Young's Literal Translation" },
  { id: "SUV", name: "Swahili Union Version" },
];

const cleanText = (text: string = "") => {
  if (!text) return "";
  return text.replace(/<S>\d+<\/S>/g, '').replace(/<[^>]*>/g, '').trim();
};

const splitTextIntoChunks = (text: string, maxWords: number) => {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return [text];
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }
  return chunks;
};

interface BibleProjectionProps {
  onProject: (text: string, ref: string, forceLive?: boolean, part?: string) => void;
  onOpenOptions: () => void;
  onPushToOverlay?: (text: string) => void;
  isProgramLive: boolean; // Controls whether updates go to Program or Preview
}

const BibleProjection: React.FC<BibleProjectionProps> = ({ onProject, onOpenOptions, onPushToOverlay, isProgramLive }) => {
  const [selectedVersion, setSelectedVersion] = useState("KJV");
  const [selectedBook, setSelectedBook] = useState<BibleBook>(BIBLE_BOOKS[0]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0); 
  const [maxWordsPerSlide, setMaxWordsPerSlide] = useState(35); 
  const [versesContent, setVersesContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleared, setIsCleared] = useState(false); // Used to temporarily clear/stop projection
  
  // Default to 'books' so the explorer grid is open initially
  const [selectionOverlay, setSelectionOverlay] = useState<'none' | 'books' | 'chapters' | 'verses'>('books');
  const versesContainerRef = useRef<HTMLDivElement>(null);

  const fetchVerses = async (version: string, bookId: number, chapter: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://bolls.life/get-chapter/${version}/${bookId}/${chapter}/`);
      const data = await response.json();
      setVersesContent(data);
    } catch (err) {
      setVersesContent([{ verse: 1, text: "Scripture offline." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchVerses(selectedVersion, selectedBook.id, selectedChapter); }, [selectedVersion, selectedBook, selectedChapter]);

  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem('hkm_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.maxWordsPerSlide && parsed.maxWordsPerSlide !== maxWordsPerSlide) setMaxWordsPerSlide(parsed.maxWordsPerSlide);
      }
    };
    const interval = setInterval(checkSettings, 1000);
    return () => clearInterval(interval);
  }, [maxWordsPerSlide]);

  const currentVerseData = useMemo(() => {
    const v = versesContent.find(v => v.verse === selectedVerse);
    if (!v) return { chunks: [""], totalChunks: 0 };
    const chunks = splitTextIntoChunks(cleanText(v.text), maxWordsPerSlide);
    return { chunks, totalChunks: chunks.length };
  }, [versesContent, selectedVerse, maxWordsPerSlide]);

  const currentVerseText = useMemo(() => currentVerseData.chunks[currentChunkIndex] || "", [currentVerseData, currentChunkIndex]);

  // Effect to handle updates when user scrolls/clicks verse or changes parts
  useEffect(() => {
    if (versesContent.length > 0) {
      if (isCleared) {
        // Stop projection immediately (clear text) if cleared state is active
        onProject("", "", isProgramLive, "");
      } else {
        const partLabel = currentVerseData.totalChunks > 1 ? ` [PART ${String.fromCharCode(65 + currentChunkIndex)}]` : "";
        onProject(currentVerseText, `${selectedBook.name} ${selectedChapter}:${selectedVerse}${partLabel}`, isProgramLive, partLabel);
      }
    }
  }, [selectedVerse, currentChunkIndex, isProgramLive, versesContent, selectedBook, selectedChapter, onProject, currentVerseText, currentVerseData.totalChunks, isCleared]);

  const handleScrollToVerse = (verseNum: number) => {
    // Immediate scroll with 'auto' behavior to satisfy "pop up from selected verse" requirement
    setTimeout(() => {
      const element = document.getElementById(`verse-${verseNum}`);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }, 50);
  };

  const handleVerseSelect = (v: number) => { 
    // If clicking the currently selected verse AND it is currently live/projected, toggle clear
    if (v === selectedVerse && isProgramLive && !isCleared) {
      setIsCleared(true);
    } else {
      setIsCleared(false);
      setSelectedVerse(v); 
      setCurrentChunkIndex(0); 
      handleScrollToVerse(v);
    }
  };

  const navigateVerse = (direction: 'next' | 'prev') => {
    const currentIndex = versesContent.findIndex(v => v.verse === selectedVerse);
    if (currentIndex === -1) return;
    
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < versesContent.length) {
        const newVerse = versesContent[newIndex].verse;
        handleVerseSelect(newVerse);
    }
  };

  return (
    <div className="h-full w-full flex bg-[#0f172a] overflow-hidden select-none relative">
      
      {/* Sidebar - Versions - Always Visible */}
      <div className="w-48 bg-[#1e293b] border-r border-black/40 flex flex-col shrink-0 p-2 gap-1 overflow-y-auto z-10">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-2">Versions</h3>
        {BIBLE_VERSIONS.map(v => (
          <button key={v.id} onClick={() => setSelectedVersion(v.id)} className={`w-full p-3 rounded text-[11px] font-black uppercase transition-all ${selectedVersion === v.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>{v.id}</button>
        ))}
      </div>

      {/* Main Content Area - Overlay sits inside here to keep sidebar accessible */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Explorer Overlay */}
        {selectionOverlay !== 'none' && (
          <div className="absolute inset-0 z-[50] bg-[#0f172a] flex flex-col p-8 overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-white font-black uppercase tracking-widest italic flex items-center gap-2">
                <span className="text-blue-500">EXPLORER:</span>
                <span>{selectionOverlay}</span>
                {selectionOverlay !== 'books' && <span className="text-slate-500 text-sm ml-2">({selectedBook.name}{selectionOverlay === 'verses' ? ` ${selectedChapter}` : ''})</span>}
              </h2>
              <button onClick={() => setSelectionOverlay('none')} className="text-white/60 hover:text-white text-2xl font-black">✕</button>
            </div>
            
            {selectionOverlay === 'books' && (
              <div className="space-y-8 pb-12">
                <div>
                   <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 sticky top-0 bg-[#0f172a] py-2 z-10">Old Testament</h3>
                   <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {BIBLE_BOOKS.filter(b => b.testament === 'Old').map(b => (
                      <button key={b.id} onClick={() => { setSelectedBook(b); setSelectionOverlay('chapters'); }} className="p-3 bg-white/5 border border-white/10 rounded hover:bg-blue-600 hover:border-blue-500 transition-all text-[10px] font-black uppercase text-white truncate">{b.name}</button>
                    ))}
                   </div>
                </div>
                <div>
                   <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-4 sticky top-0 bg-[#0f172a] py-2 z-10">New Testament</h3>
                   <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {BIBLE_BOOKS.filter(b => b.testament === 'New').map(b => (
                      <button key={b.id} onClick={() => { setSelectedBook(b); setSelectionOverlay('chapters'); }} className="p-3 bg-white/5 border border-white/10 rounded hover:bg-red-600 hover:border-red-500 transition-all text-[10px] font-black uppercase text-white truncate">{b.name}</button>
                    ))}
                   </div>
                </div>
              </div>
            )}
            
            {selectionOverlay === 'chapters' && (
              <div className="grid grid-cols-8 md:grid-cols-10 gap-3">
                {[...Array(selectedBook.chapters)].map((_, i) => (
                  <button key={i} onClick={() => { setSelectedChapter(i+1); setSelectionOverlay('verses'); }} className="aspect-square bg-white/5 border border-white/10 rounded flex items-center justify-center hover:bg-blue-600 text-white font-black text-lg">{i+1}</button>
                ))}
              </div>
            )}

            {selectionOverlay === 'verses' && (
              isLoading ? (
                 <div className="flex items-center justify-center h-64">
                   <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              ) : (
                <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
                  {versesContent.map(v => (
                     <button 
                       key={v.verse} 
                       onClick={() => { 
                         handleVerseSelect(v.verse); 
                         setSelectionOverlay('none'); 
                       }} 
                       className="aspect-square bg-white/5 border border-white/10 rounded flex items-center justify-center hover:bg-emerald-600 text-white font-black text-sm"
                     >
                       {v.verse}
                     </button>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        <div className="h-10 bg-blue-700 flex items-center justify-between px-6 shrink-0">
          <h3 className="text-[11px] font-black text-white uppercase italic tracking-widest">{selectedBook.name} {selectedChapter}</h3>
          <button onClick={onOpenOptions} className="bg-white/10 px-4 py-1 rounded text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all">Theme Library</button>
        </div>
        
        <div ref={versesContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scroll-smooth">
           {isLoading ? (
             <div className="h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div></div>
           ) : versesContent.map(v => (
             <div key={v.verse} id={`verse-${v.verse}`} onClick={() => handleVerseSelect(v.verse)} className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedVerse === v.verse ? (isCleared ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200') : 'hover:bg-slate-50 border-transparent'}`}>
               <div className="flex">
                  <span className={`font-serif font-black text-sm mr-4 ${isCleared && selectedVerse === v.verse ? 'text-amber-600' : 'text-blue-600'}`}>{v.verse}</span>
                  <span className={`text-[1.1rem] font-serif leading-relaxed ${selectedVerse === v.verse ? 'text-slate-900 font-bold' : 'text-slate-600'} ${isCleared && selectedVerse === v.verse ? 'opacity-50' : ''}`}>{cleanText(v.text)}</span>
               </div>
               {selectedVerse === v.verse && isCleared && <div className="mt-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">Projection Paused (Click to Resume)</div>}
             </div>
           ))}
        </div>
        
        <div className="h-14 bg-slate-100 border-t border-slate-300 flex items-center px-4 gap-2 shrink-0">
           <button onClick={() => setSelectionOverlay('books')} className="h-10 px-6 bg-white border border-slate-300 text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-slate-50">Index Explorer</button>
           
           <div className="flex items-center gap-1 mx-2">
              <button onClick={() => navigateVerse('prev')} className="h-10 w-12 flex items-center justify-center bg-white border border-slate-300 rounded shadow-sm hover:bg-blue-50 text-slate-600" title="Previous Verse">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => navigateVerse('next')} className="h-10 w-12 flex items-center justify-center bg-white border border-slate-300 rounded shadow-sm hover:bg-blue-50 text-slate-600" title="Next Verse">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>

           <div className="flex-1 flex justify-center items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isProgramLive ? (isCleared ? 'bg-amber-500' : 'bg-red-500 animate-pulse') : 'bg-emerald-500'}`}></div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isProgramLive ? (isCleared ? 'text-amber-600' : 'text-red-600') : 'text-emerald-600'}`}>
                {isProgramLive ? (isCleared ? 'LIVE CLEARED' : 'LIVE ON AIR') : 'PREVIEW MODE'}
              </span>
           </div>
           
           <button 
             onClick={() => setIsCleared(!isCleared)} 
             className={`h-10 px-8 text-white text-[10px] font-black uppercase tracking-widest rounded transition-all ${isCleared ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-800 hover:bg-black'}`}
           >
             {isCleared ? 'Resume' : 'Clear Live'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default BibleProjection;
