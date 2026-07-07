import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Menu, Shield, AlertTriangle, X, Info } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import NetworkGraph from './components/NetworkGraph';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import Offenders from './components/Offenders';

import CrimeAnalytics from './components/CrimeAnalytics';
import HotspotMap from './components/HotspotMap';
import Alerts from './components/Alerts';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthenticatedLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) return;
    const mockAlerts = [
      { type: 'high', msg: 'Suspicious Activity Detected in Sector 4' },
      { type: 'high', msg: 'Facial Recognition Match: High Value Target near MG Road' },
      { type: 'medium', msg: 'Multiple calls from same location: Possible Disturbance' },
      { type: 'medium', msg: 'Unusual vehicle movement pattern flagged' },
      { type: 'info', msg: 'Patrol Team Delta reached designated waypoint' }
    ];

    const interval = setInterval(() => {
      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...randomAlert }]);
      
      // Auto dismiss after 5s
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    }, 35000); // Every 35 seconds

    return () => clearInterval(interval);
  }, [isAuth]);

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-[100dvh] bg-ksp-navy text-slate-200 overflow-hidden font-sans flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b1120] border-b border-[#1e293b] z-30">
        <div className="flex items-center space-x-2">
          <Shield className="text-ksp-gold w-6 h-6" />
          <h1 className="text-xl font-bold text-white tracking-wider">Sentin<span className="text-ksp-gold">AI</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-slate-400 hover:text-white bg-[#1e293b] p-2 rounded-lg border border-slate-700 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />
      
      <main className="flex-1 relative overflow-y-auto bg-ksp-navy">
        <div className="relative z-10 min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Global Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none w-80">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-fade-in-up transition-all ${
            toast.type === 'high' ? 'bg-rose-500/20 border-rose-500/50' :
            toast.type === 'medium' ? 'bg-amber-500/20 border-amber-500/50' :
            'bg-blue-500/20 border-blue-500/50'
          }`}>
            <div className={`mt-0.5 mr-3 flex-shrink-0 ${
              toast.type === 'high' ? 'text-rose-400' :
              toast.type === 'medium' ? 'text-amber-400' :
              'text-blue-400'
            }`}>
              {toast.type === 'info' ? <Info className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1 mr-2">
              <h4 className="text-white text-sm font-bold mb-1">System Alert</h4>
              <p className="text-slate-300 text-xs leading-snug">{toast.msg}</p>
            </div>
            <button onClick={() => dismissToast(toast.id)} className="text-slate-400 hover:text-white flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  // Force dark mode class on html body
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-copilot" element={<Chatbot />} />
          <Route path="/analytics" element={<CrimeAnalytics />} />
          <Route path="/hotspots" element={<HotspotMap />} />
          <Route path="/network" element={<NetworkGraph />} />
          <Route path="/offenders" element={<Offenders />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
