import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2, Mail, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password || (!isLogin && !email)) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      const result = await login(username, password, role);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } else {
      const result = await register(username, password, email, role);
      if (result.success) {
        setError('Account creation is pending admin approval.');
        setIsLoading(false);
        // Clear form fields
        setUsername('');
        setPassword('');
        setEmail('');
        // Switch back to login view after 3 seconds
        setTimeout(() => {
          setIsLogin(true);
          setError('');
        }, 3000);
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }
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
          
          {/* Sign In / Sign Up Toggle */}
          <div className="flex mb-6 bg-[#0b1120] rounded-lg p-1 border border-[#1e293b]">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${isLogin ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center gap-2 ${!isLogin ? 'bg-[#1e293b] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-[#a855f7] bg-[#0b1120] border-[#1e293b] focus:ring-[#a855f7] focus:ring-offset-[#0b1120]"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Admin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="role"
                    value="investigator"
                    checked={role === 'investigator'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-[#a855f7] bg-[#0b1120] border-[#1e293b] focus:ring-[#a855f7] focus:ring-offset-[#0b1120]"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Investigator</span>
                </label>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#0b1120] border border-[#1e293b] text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#a855f7] transition-colors"
                  />
                </div>
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
                  <span>{isLogin ? 'Sign In to Terminal' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
