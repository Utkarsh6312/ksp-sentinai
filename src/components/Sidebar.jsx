import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, Network, Shield } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-ksp-navy border-r border-slate-800 flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <Shield className="text-ksp-gold w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">Sentin<span className="text-ksp-gold">AI</span></h1>
          <p className="text-xs text-slate-400 font-medium">Karnataka State Police</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink to="/" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-ksp-blue/10 text-ksp-blue' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Command Center</span>
        </NavLink>
        
        <NavLink to="/ai-copilot" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-ksp-blue/10 text-ksp-blue' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
          <MessageSquareText className="w-5 h-5" />
          <span className="font-medium">AI Co-Pilot</span>
        </NavLink>
        
        <NavLink to="/network" className={({isActive}) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-ksp-blue/10 text-ksp-blue' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
          <Network className="w-5 h-5" />
          <span className="font-medium">Suspect Network</span>
        </NavLink>
      </nav>
      
      <div className="p-4 m-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-2">System Status</p>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-400">All Systems Operational</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
