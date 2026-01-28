
import React from 'react';

interface SidebarProps {
  activeTab: 'sources' | 'bible' | 'titler';
  onTabChange: (tab: 'sources' | 'bible' | 'titler') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'sources', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Sources' },
    { id: 'bible', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Bible' },
    { id: 'titler', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', label: 'Titles' },
  ] as const;

  return (
    <nav className="w-20 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center py-4 gap-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all group ${
            activeTab === tab.id 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
            : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
          <span className="text-[10px] mt-1 font-bold uppercase">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
