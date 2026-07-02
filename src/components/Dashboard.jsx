import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ShieldAlert, Users, FileText, AlertTriangle } from 'lucide-react';
import mockData from '../data/mockSchema.json';
import CrimeHeatmap from './Maps/CrimeHeatmap';

const Dashboard = () => {
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
  
  const COLORS = ['#e11d48', '#3b82f6', '#fbbf24', '#10b981'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Command Center</h2>
          <p className="text-slate-400 mt-1">Real-time KSP Intelligence & Analytics Dashboard</p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-300 shadow-xl backdrop-blur-md">
          Last updated: <span className="text-ksp-gold font-medium">Just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ksp-blue/10 rounded-full blur-2xl group-hover:bg-ksp-blue/20 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Active Cases</p>
              <h3 className="text-4xl font-bold text-white">{totalCases}</h3>
            </div>
            <div className="p-3 bg-ksp-blue/20 rounded-xl">
              <FileText className="w-6 h-6 text-ksp-blue" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Arrests</p>
              <h3 className="text-4xl font-bold text-white">{totalArrests}</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ksp-crimson/10 rounded-full blur-2xl group-hover:bg-ksp-crimson/20 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Heinous Crimes</p>
              <h3 className="text-4xl font-bold text-white">
                {gravityData.find(d => d.name === 'Heinous')?.value || 0}
              </h3>
            </div>
            <div className="p-3 bg-ksp-crimson/20 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-ksp-crimson" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-ksp-gold/10 rounded-full blur-2xl group-hover:bg-ksp-gold/20 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">High Risk Zones</p>
              <h3 className="text-4xl font-bold text-white">2</h3>
            </div>
            <div className="p-3 bg-ksp-gold/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-ksp-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Gravity of Offence</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gravityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gravityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            {gravityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-slate-300">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Live Crime Heatmap (Geospatial)</h3>
          <CrimeHeatmap />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
