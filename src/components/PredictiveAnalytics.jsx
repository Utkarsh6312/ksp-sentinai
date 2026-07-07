import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Area, ComposedChart
} from 'recharts';
import { TrendingUp, AlertOctagon, BrainCircuit, Activity } from 'lucide-react';
import mockData from '../data/mockSchema.json';

const PredictiveAnalytics = ({ theme }) => {
  const { PredictiveForecasts, Anomalies, SocioEconomicFactors } = mockData;
  const [deploymentLevel, setDeploymentLevel] = useState(50);

  const adjustedForecasts = useMemo(() => {
    // 50 is baseline. If > 50, crime decreases. If < 50, crime increases.
    const factor = (50 - deploymentLevel) / 100; // range from -0.5 to +0.5
    return PredictiveForecasts.map(d => ({
      ...d,
      forecast: d.forecast ? Math.round(d.forecast * (1 + factor)) : null,
      upperBound: d.upperBound ? Math.round(d.upperBound * (1 + factor)) : null,
      lowerBound: d.lowerBound ? Math.round(d.lowerBound * (1 + factor)) : null,
    }));
  }, [PredictiveForecasts, deploymentLevel]);

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(10px)',
    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
    borderRadius: '12px', 
    color: theme === 'dark' ? '#fff' : '#0f172a',
    boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="p-4 md:p-8 page-enter h-full overflow-y-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
        <div className="relative">
          <div className="absolute -left-4 top-1 w-1 h-12 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            Predictive AI & Anomalies
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-center text-sm">
            <BrainCircuit className="w-4 h-4 mr-2 text-purple-500" />
            AI-driven forecasts and socio-economic correlation mapping
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 glass-panel p-7 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-3 text-purple-500" />
              6-Month Crime Volume Forecast
            </h3>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-slate-500">Police Deployment</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={deploymentLevel}
                onChange={(e) => setDeploymentLevel(Number(e.target.value))}
                className="w-24 md:w-32 accent-purple-500 cursor-pointer"
              />
              <span className="text-white font-bold w-8">{deploymentLevel}%</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={adjustedForecasts}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                
                {/* Confidence Interval / Bounds */}
                <Area type="monotone" dataKey="upperBound" fill="rgba(168,85,247,0.1)" stroke="none" />
                <Area type="monotone" dataKey="lowerBound" fill="rgba(15,23,42,1)" stroke="none" />
                
                <Line type="monotone" dataKey="historical" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Historical Data" />
                <Line type="monotone" dataKey="forecast" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Forecast" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomalies Panel */}
        <div className="lg:col-span-1 glass-card p-7 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-50"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <AlertOctagon className="w-5 h-5 mr-3 text-rose-500" />
            System Anomalies Detected
          </h3>
          <div className="space-y-4">
            {Anomalies.map(anomaly => (
              <div key={anomaly.id} className={`bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 shadow-sm ${anomaly.severity === 'Critical' ? 'animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm">{anomaly.title}</h4>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${anomaly.severity === 'Critical' ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{anomaly.description}</p>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">{anomaly.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Socio-Economic Correlation */}
      <div className="glass-panel p-7 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-3 text-emerald-500" />
          Socio-Economic Correlation (Unemployment vs Crime Rate)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-3xl">
          Visualizing the relationship between local unemployment rates and crime frequency across different zones to identify root causes and optimize resource allocation.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis type="number" dataKey="unemploymentRate" name="Unemployment Rate (%)" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} unit="%" />
              <YAxis type="number" dataKey="crimeRate" name="Crime Rate (per 1k)" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <ZAxis type="number" dataKey="populationDensity" range={[50, 400]} name="Pop. Density" />
              <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
              <Scatter name="Zones" data={SocioEconomicFactors} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
