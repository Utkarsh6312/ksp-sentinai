import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import NetworkGraph from './components/NetworkGraph';

function App() {
  return (
    <div className="flex h-screen bg-ksp-dark overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 relative overflow-y-auto">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-ksp-blue/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-ksp-crimson/5 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 min-h-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-copilot" element={<Chatbot />} />
            <Route path="/network" element={<NetworkGraph />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
