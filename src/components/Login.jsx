import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setIsLoading(false);
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    setUsername(role);
    setPassword(role);
  };

  return (
    <div className="min-h-screen bg-ksp-navy flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#a855f7]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="bg-[#1e293b]/50 p-4 rounded-2xl border border-[#334155] shadow-2xl mb-4 backdrop-blur-sm">
            <Shield className="w-12 h-12 text-[#a855f7]" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wider mb-2">Sentin<span className="text-[#a855f7]">AI</span></h1>
          <p className="text-slate-400 text-sm text-center">Secure Intelligence Platform</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-[#1e293b] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-[#0b1120] border border-[#1e293b] text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b1120] border border-[#1e293b] text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#a855f7] transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#a855f7] to-[#7e22ce] hover:from-[#9333ea] hover:to-[#6b21a8] text-white rounded-lg py-3 font-bold shadow-lg shadow-[#a855f7]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Helper for Datathon */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Datathon Demo Accounts</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => handleDemoFill('admin')} className="text-xs bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors">
              Admin
            </button>
            <button onClick={() => handleDemoFill('investigator')} className="text-xs bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors">
              Investigator
            </button>
            <button onClick={() => handleDemoFill('analyst')} className="text-xs bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors">
              Analyst
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-3">Click a role to auto-fill credentials.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
