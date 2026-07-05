import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, Network, Shield, Settings, X, Moon, Sun } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, theme, toggleTheme }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-ksp-navy/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)] 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-ksp-gold/20 blur-md rounded-full"></div>
              <Shield className="text-ksp-gold w-8 h-8 md:w-10 md:h-10 relative z-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wider">Sentin<span className="text-ksp-gold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">AI</span></h1>
              <p className="text-[10px] md:text-[11px] text-ksp-blue dark:text-ksp-blueLight uppercase tracking-widest font-semibold mt-0.5">KSP Command Center</p>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavLink to="/" onClick={() => setIsOpen(false)} className={({isActive}) => `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
            {({isActive}) => (
              <>
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-ksp-blue/10 dark:from-ksp-blue/20 to-transparent border-l-2 border-ksp-blue"></div>}
                {!isActive && <div className="absolute inset-0 bg-slate-100/0 hover:bg-slate-100 dark:bg-slate-800/0 dark:group-hover:bg-slate-800/40 transition-colors"></div>}
                <LayoutDashboard className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-ksp-blue' : 'group-hover:text-ksp-blue'}`} />
                <span className="relative z-10">Command Center</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/ai-copilot" onClick={() => setIsOpen(false)} className={({isActive}) => `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
            {({isActive}) => (
              <>
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-ksp-gold/10 dark:from-ksp-gold/20 to-transparent border-l-2 border-ksp-gold"></div>}
                {!isActive && <div className="absolute inset-0 bg-slate-100/0 hover:bg-slate-100 dark:bg-slate-800/0 dark:group-hover:bg-slate-800/40 transition-colors"></div>}
                <MessageSquareText className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-ksp-gold' : 'group-hover:text-ksp-gold'}`} />
                <span className="relative z-10">AI Co-Pilot</span>
              </>
            )}
          </NavLink>
          
          <NavLink to="/network" onClick={() => setIsOpen(false)} className={({isActive}) => `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
            {({isActive}) => (
              <>
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 dark:from-emerald-500/20 to-transparent border-l-2 border-emerald-500"></div>}
                {!isActive && <div className="absolute inset-0 bg-slate-100/0 hover:bg-slate-100 dark:bg-slate-800/0 dark:group-hover:bg-slate-800/40 transition-colors"></div>}
                <Network className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-emerald-500 dark:text-emerald-400' : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-300'}`} />
                <span className="relative z-10">Suspect Network</span>
              </>
            )}
          </NavLink>
        </nav>
        
        {/* System Status */}
        <div className="px-6 mb-4 mt-auto">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Catalyst Sync</p>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Live</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-400 h-1.5 rounded-full w-full"></div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ksp-blue to-ksp-navy border border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Inspector" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Insp. Raj Kumar</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cyber Cell</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={toggleTheme}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
