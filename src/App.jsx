import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, Shield } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import NetworkGraph from './components/NetworkGraph';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Theme state: default to dark, or read from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex h-[100dvh] bg-slate-50 dark:bg-ksp-dark text-slate-800 dark:text-slate-200 overflow-hidden font-sans flex-col md:flex-row transition-colors duration-300`}>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/90 dark:bg-ksp-navy/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 z-30 shadow-md">
        <div className="flex items-center space-x-2">
          <Shield className="text-ksp-gold w-6 h-6" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-wider">Sentin<span className="text-ksp-gold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">AI</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-ksp-blue/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 relative overflow-y-auto bg-slate-50 dark:bg-ksp-dark transition-colors duration-300">
        {/* Background glow effects - Visible primarily in dark mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] rounded-full bg-ksp-blue/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] rounded-full bg-ksp-crimson/5 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 min-h-full">
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/ai-copilot" element={<Chatbot theme={theme} />} />
            <Route path="/network" element={<NetworkGraph theme={theme} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
