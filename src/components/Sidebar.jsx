import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  BarChart3, 
  MapPin, 
  Network, 
  Users, 
  BellRing, 
  FileText, 
  Settings, 
  Shield, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Command Centre', path: '/', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'AI Chatbot', path: '/ai-copilot', icon: <MessageSquareText className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Crime Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Hotspot Map', path: '/hotspots', icon: <MapPin className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Suspect Network', path: '/network', icon: <Network className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Recent Offenders', path: '/offenders', icon: <Users className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Alerts & Notifications', path: '/alerts', icon: <BellRing className="w-5 h-5" />, badge: 7, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Reports', path: '/reports', icon: <FileText className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" />, roles: ['Admin', 'Investigator', 'Analyst'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentUser?.role || 'Analyst'));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#0b1120]/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1120] border-r border-[#1e293b] flex flex-col 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-[#1e293b]">
          <Shield className="text-ksp-gold w-8 h-8 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center">
              Sentin<span className="text-ksp-gold">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">KSP COMMAND CENTER</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
          <div className="space-y-1 px-3">
            {visibleMenuItems.map((item) => (
              <NavLink 
                key={item.name}
                to={item.path} 
                onClick={() => setIsOpen(false)} 
                className={({isActive}) => `
                  sidebar-link group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'sidebar-link-active bg-[#1e293b] text-white' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/50'}
                `}
              >
                {({isActive}) => (
                  <div className="flex items-center space-x-3">
                    <div className={`${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-[#1e293b] bg-[#0b1120]">
          <div className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1e293b] overflow-hidden border border-slate-700 flex items-center justify-center text-[#a855f7] font-bold">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1120] rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white truncate max-w-[100px]">{currentUser?.name || 'Unknown User'}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{currentUser?.role || 'Role'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
