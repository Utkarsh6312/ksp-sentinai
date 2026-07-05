import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ShieldAlert, Users, FileText, AlertTriangle, Activity } from 'lucide-react';
import mockData from '../data/mockSchema.json';
import CrimeHeatmap from './Maps/CrimeHeatmap';

const Dashboard = ({ theme }) => {
  // Aggregate KPIs
  const totalCases = mockData.CaseMaster.length;
  const totalArrests = mockData.ArrestSurrender.length;
  
  // Aggregate Heinous vs Non-Heinous
  const gravityData = useMemo(() => {
    const counts = {};
    mockData.CaseMaster.forEach(c => {
      const g = mockData.GravityOffence.find(go => go.GravityOffenceID === c.GravityOffenceID)?.LookupValue || 'Unknown';
      counts[g] = (counts[g] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, []);
  
  const COLORS = ['#e11d48', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="p-4 md:p-8 page-enter h-full overflow-y-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div className="relative">
          <div className="absolute -left-4 top-1 w-1 h-12 bg-ksp-blue rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Command Center</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-center text-sm">
            <Activity className="w-4 h-4 mr-2 text-ksp-blue dark:text-ksp-blueLight animate-pulse" />
            Real-time KSP Intelligence & Analytics Dashboard
          </p>
        </div>
        <div className="glass-panel px-5 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 flex items-center space-x-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span>Last updated: <span className="text-ksp-gold dark:text-ksp-goldLight font-semibold tracking-wide">Just now</span></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-ksp-blue/10 dark:bg-ksp-blue/20 rounded-full blur-[40px] group-hover:bg-ksp-blue/20 dark:group-hover:bg-ksp-blue/30 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Active Cases</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white glow-text-blue">{totalCases}</h3>
            </div>
            <div className="p-3.5 bg-ksp-blue/10 dark:bg-ksp-blue/20 rounded-xl border border-ksp-blue/20 dark:border-ksp-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <FileText className="w-6 h-6 text-ksp-blue dark:text-ksp-blueLight" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[40px] group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/30 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Arrests</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{totalArrests}</h3>
            </div>
            <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] dark:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-ksp-crimson/10 dark:bg-ksp-crimson/20 rounded-full blur-[40px] group-hover:bg-ksp-crimson/20 dark:group-hover:bg-ksp-crimson/30 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Heinous Crimes</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white drop-shadow-[0_0_10px_rgba(225,29,72,0.2)] dark:drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                {gravityData.find(d => d.name === 'Heinous')?.value || 0}
              </h3>
            </div>
            <div className="p-3.5 bg-ksp-crimson/10 dark:bg-ksp-crimson/20 rounded-xl border border-ksp-crimson/20 dark:border-ksp-crimson/30 shadow-[0_0_15px_rgba(225,29,72,0.15)] dark:shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <ShieldAlert className="w-6 h-6 text-ksp-crimson dark:text-ksp-crimsonLight" />
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-ksp-gold/10 dark:bg-ksp-gold/20 rounded-full blur-[40px] group-hover:bg-ksp-gold/20 dark:group-hover:bg-ksp-gold/30 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">High Risk Zones</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white glow-text-gold">2</h3>
            </div>
            <div className="p-3.5 bg-ksp-gold/10 dark:bg-ksp-gold/20 rounded-xl border border-ksp-gold/20 dark:border-ksp-gold/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="w-6 h-6 text-ksp-gold dark:text-ksp-goldLight" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <div className="lg:col-span-1 glass-panel p-7 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-ksp-blue/30 dark:via-ksp-blue/50 to-transparent opacity-50"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <span className="w-2 h-6 bg-ksp-blue rounded-full mr-3"></span>
            Gravity of Offence
          </h3>
          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gravityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="rgba(0,0,0,0)"
                >
                  {gravityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} 
                          style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
                    borderRadius: '12px', 
                    color: theme === 'dark' ? '#fff' : '#0f172a',
                    boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#0f172a', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalCases}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Total</span>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {gravityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-7 rounded-2xl relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-ksp-crimson/30 dark:via-ksp-crimson/50 to-transparent opacity-50"></div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <span className="w-2 h-6 bg-ksp-crimson rounded-full mr-3"></span>
              Live Crime Heatmap (Geospatial)
            </h3>
            <span className="text-xs bg-ksp-crimson/10 dark:bg-ksp-crimson/20 text-ksp-crimson dark:text-ksp-crimsonLight px-3 py-1 rounded-full border border-ksp-crimson/20 dark:border-ksp-crimson/30 uppercase tracking-widest font-bold flex items-center">
              <div className="w-1.5 h-1.5 bg-ksp-crimson dark:bg-ksp-crimsonLight rounded-full mr-2 animate-ping"></div>
              Live Tracking
            </span>
          </div>
          <div className="ring-1 ring-slate-200 dark:ring-white/10 rounded-xl overflow-hidden shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <CrimeHeatmap theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
