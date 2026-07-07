import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Users, ShieldAlert, AlertTriangle, FileCheck, Clock,
  ChevronDown, Filter, Download, ArrowUpRight, ArrowDownRight,
  Plus, Search, Map, FileOutput, UploadCloud, Calendar, X
} from 'lucide-react';
import TopBar from './TopBar';
import CrimeHeatmap from './Maps/CrimeHeatmap';
import mockData from '../data/mockSchema.json';
import { exportToCSV } from '../utils/exportUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');
  const [activeModal, setActiveModal] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // KPI Data
  const kpis = [
    { title: 'TOTAL FIRs', value: '1,843', change: '+ 14.2%', isUp: true, icon: <FileText className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/20' },
    { title: 'TOTAL ARRESTS', value: '2,154', change: '+ 8.3%', isUp: true, icon: <Users className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/20' },
    { title: 'HEINOUS CRIMES', value: '320', change: '+ 5.6%', isUp: true, icon: <ShieldAlert className="w-5 h-5 text-rose-400" />, color: 'bg-rose-500/20' },
    { title: 'HIGH RISK ZONES', value: '24', change: '+ 3', isUp: true, icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/20' },
    { title: 'CHARGESHEETS FILED', value: '1,294', change: '+ 11.7%', isUp: true, icon: <FileCheck className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/20' },
    { title: 'PENDING CASES', value: '732', change: '+ 6.8%', isUp: true, icon: <Clock className="w-5 h-5 text-cyan-400" />, color: 'bg-cyan-500/20' },
  ];

  // Dynamic Crime Trend Data based on time filter
  const trendDataMap = {
    'Last 7 Days': [
      { name: '13 May', firs: 500, heinous: 100, arrests: 300 },
      { name: '14 May', firs: 600, heinous: 150, arrests: 400 },
      { name: '15 May', firs: 750, heinous: 200, arrests: 480 },
      { name: '16 May', firs: 600, heinous: 250, arrests: 420 },
      { name: '17 May', firs: 800, heinous: 220, arrests: 520 },
      { name: '18 May', firs: 850, heinous: 300, arrests: 550 },
      { name: '19 May', firs: 820, heinous: 320, arrests: 580 },
    ],
    'Last 30 Days': [
      { name: 'W1', firs: 2000, heinous: 400, arrests: 1200 },
      { name: 'W2', firs: 2200, heinous: 450, arrests: 1300 },
      { name: 'W3', firs: 2100, heinous: 380, arrests: 1250 },
      { name: 'W4', firs: 2500, heinous: 500, arrests: 1500 },
    ],
    'This Year': [
      { name: 'Jan', firs: 8000, heinous: 1500, arrests: 5000 },
      { name: 'Feb', firs: 7500, heinous: 1400, arrests: 4800 },
      { name: 'Mar', firs: 8200, heinous: 1600, arrests: 5200 },
      { name: 'Apr', firs: 8500, heinous: 1700, arrests: 5500 },
      { name: 'May', firs: 4000, heinous: 800, arrests: 2500 },
    ]
  };

  const trendData = trendDataMap[timeFilter] || trendDataMap['Last 7 Days'];

  // Category Donut
  const categoryData = [
    { name: 'Theft', value: 515, color: '#3b82f6', pct: '28%' },
    { name: 'Cyber Crime', value: 442, color: '#ef4444', pct: '24%' },
    { name: 'Assault', value: 332, color: '#eab308', pct: '18%' },
    { name: 'Fraud', value: 295, color: '#22c55e', pct: '16%' },
    { name: 'Others', value: 259, color: '#8b5cf6', pct: '14%' },
  ];

  // Status Donut
  const statusData = [
    { name: 'Open', value: 1072, color: '#3b82f6', pct: '58%' },
    { name: 'Under Investigation', value: 461, color: '#8b5cf6', pct: '25%' },
    { name: 'Charge Sheet Filed', value: 221, color: '#22c55e', pct: '12%' },
    { name: 'Closed', value: 89, color: '#ef4444', pct: '5%' },
  ];

  const topStations = [
    { id: 1, name: 'Bengaluru City PS', district: 'Bengaluru Urban', cases: 245, trend: '+ 18%', isUp: true, color: 'bg-rose-500' },
    { id: 2, name: 'Mysuru City PS', district: 'Mysuru', cases: 178, trend: '+ 12%', isUp: true, color: 'bg-amber-500' },
    { id: 3, name: 'Hubballi PS', district: 'Dharwad', cases: 156, trend: '+ 9%', isUp: true, color: 'bg-blue-500' },
    { id: 4, name: 'Davangere PS', district: 'Davangere', cases: 142, trend: '- 5%', isUp: false, color: 'bg-purple-500' },
    { id: 5, name: 'Tumakuru PS', district: 'Tumakuru', cases: 130, trend: '+ 7%', isUp: true, color: 'bg-cyan-500' },
  ];

  const alerts = [
    { id: 1, text: 'High risk alert in Bengaluru City', time: '10:21 AM', type: 'high' },
    { id: 2, text: 'Crime spike detected in Mysuru Zone', time: '09:48 AM', type: 'medium' },
    { id: 3, text: 'Repeat offender Ramesh K. active', time: '09:15 AM', type: 'info' },
    { id: 4, text: 'Unusual pattern detected in cyber fraud', time: '08:52 AM', type: 'low' },
  ];

  const quickActions = [
    { id: 'register_fir', icon: <Plus className="w-6 h-6 text-blue-400" />, label: 'Register FIR', bg: 'bg-blue-500/10' },
    { id: 'search_case', icon: <Search className="w-6 h-6 text-emerald-400" />, label: 'Search Case', bg: 'bg-emerald-500/10' },
    { id: 'track_suspect', icon: <Map className="w-6 h-6 text-purple-400" />, label: 'Track Suspect', bg: 'bg-purple-500/10' },
    { id: 'generate_report', icon: <FileOutput className="w-6 h-6 text-amber-400" />, label: 'Generate Report', bg: 'bg-amber-500/10' },
    { id: 'upload_evidence', icon: <UploadCloud className="w-6 h-6 text-cyan-400" />, label: 'Upload Evidence', bg: 'bg-cyan-500/10' },
  ];

  const handleActionClick = (actionId) => {
    setActiveModal(actionId);
  };

  const cycleTimeFilter = () => {
    const filters = ['Last 7 Days', 'Last 30 Days', 'This Year'];
    const currentIndex = filters.indexOf(timeFilter);
    setTimeFilter(filters[(currentIndex + 1) % filters.length]);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto relative">
      <TopBar title="Dashboard" subtitle="Overview of crime data and key insights" hideDateRange={true}>
        <button onClick={() => {
          exportToCSV(trendData, 'dashboard_trends.csv');
          exportToCSV(kpis, 'dashboard_kpis.csv');
        }} className="flex items-center space-x-2 bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-3 border border-[#9333ea]">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </TopBar>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${kpi.color}`}>
                {kpi.icon}
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-right w-1/2">{kpi.title}</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
              <p className={`text-xs flex items-center ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.change} <span className="text-slate-500 ml-1">vs last month</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Crime Trend */}
        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Crime Trend Overview</h3>
            <div onClick={cycleTimeFilter} className="flex items-center text-xs text-slate-400 bg-[#0b1120] px-2 py-1 rounded border border-[#1e293b] cursor-pointer hover:bg-[#1e293b] transition-colors">
              {timeFilter} <ChevronDown className="w-3 h-3 ml-1" />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-2 text-xs">
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span><span className="text-slate-400">FIRs</span></div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span><span className="text-slate-400">Heinous Crimes</span></div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span><span className="text-slate-400">Arrests</span></div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} itemStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="firs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="heinous" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="arrests" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Category */}
        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Cases by Crime Category <span className="text-slate-500 font-normal">(This Month)</span></h3>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">1,843</span>
                <span className="text-[10px] text-slate-400">TOTAL</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-slate-300">{cat.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-white font-medium">{cat.pct}</span>
                    <span className="text-slate-500 w-8 text-right">({cat.value})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e293b] text-center">
            <button onClick={() => navigate('/reports')} className="text-xs text-[#a855f7] hover:text-white transition-colors">View Full Report →</button>
          </div>
        </div>

        {/* Geographic Map Snippet */}
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
            <h3 className="text-sm font-semibold text-white flex items-center">
              <Map className="w-4 h-4 mr-2 text-[#a855f7]" />
              Hotspot Overview
            </h3>
            <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded font-bold animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 relative">
            <CrimeHeatmap theme="dark" data={mockData.CaseMaster} zoom={11} center={[12.9716, 77.5946]} />
          </div>
        </div>
      </div>

      {/* Bottom Row (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Police Stations */}
        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Top Police Stations <span className="text-slate-500 font-normal">(Case Load)</span></h3>
            <button onClick={() => setActiveModal('all_stations')} className="text-xs text-[#a855f7] hover:text-white">View All</button>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
              <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                <th className="pb-2 text-left font-medium">Police Station</th>
                <th className="pb-2 text-left font-medium">District</th>
                <th className="pb-2 text-right font-medium">Cases</th>
                <th className="pb-2 text-right font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/50">
              {topStations.map(station => (
                <tr key={station.id} className="text-slate-300 hover:bg-[#1e293b]/30 transition-colors">
                  <td className="py-2.5 flex items-center">
                    <span className={`w-4 h-4 rounded-full ${station.color} text-white flex items-center justify-center text-[9px] font-bold mr-2`}>{station.id}</span>
                    <span className="font-medium text-slate-200">{station.name}</span>
                  </td>
                  <td className="py-2.5">{station.district}</td>
                  <td className="py-2.5 text-right font-medium">{station.cases}</td>
                  <td className={`py-2.5 text-right ${station.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>{station.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Cases by Status */}
        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Cases by Status</h3>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">1,843</span>
                <span className="text-[10px] text-slate-400">TOTAL</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {statusData.map(stat => (
                <div key={stat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: stat.color }}></span>
                    <span className="text-slate-300 truncate max-w-[80px]" title={stat.name}>{stat.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-white font-medium">{stat.pct}</span>
                    <span className="text-slate-500 w-8 text-right">({stat.value})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e293b] text-center">
            <button onClick={() => navigate('/reports')} className="text-xs text-[#a855f7] hover:text-white transition-colors">View All Cases →</button>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-panel p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
            <button onClick={() => setActiveModal('all_alerts')} className="text-xs text-[#a855f7] hover:text-white">View All</button>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start">
                <div className={`mt-0.5 p-1 rounded-full mr-3 ${
                  alert.type === 'high' ? 'bg-rose-500/20 text-rose-500' :
                  alert.type === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                  alert.type === 'info' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-200">{alert.text}</p>
                </div>
                <span className="text-[10px] text-slate-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Very Bottom: Weekly Summary & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Weekly Summary */}
        <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="w-5 h-5 text-[#a855f7] mr-2" />
            <h3 className="text-sm font-semibold text-white">Weekly Summary</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-2 md:mt-0">
            <div className="w-[45%] md:w-auto">
              <p className="text-[10px] text-slate-400 mb-1 uppercase">Total FIRs</p>
              <p className="text-lg font-bold text-white">1,843</p>
              <p className="text-[10px] text-emerald-500 flex items-center mt-0.5"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5"/> 14.2%</p>
            </div>
            <div className="w-[45%] md:w-auto">
              <p className="text-[10px] text-slate-400 mb-1 uppercase">Total Arrests</p>
              <p className="text-lg font-bold text-white">2,154</p>
              <p className="text-[10px] text-emerald-500 flex items-center mt-0.5"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5"/> 8.3%</p>
            </div>
            <div className="w-[45%] md:w-auto">
              <p className="text-[10px] text-slate-400 mb-1 uppercase">Heinous Crimes</p>
              <p className="text-lg font-bold text-white">320</p>
              <p className="text-[10px] text-rose-500 flex items-center mt-0.5"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5"/> 5.6%</p>
            </div>
            <div className="w-[45%] md:w-auto">
              <p className="text-[10px] text-slate-400 mb-1 uppercase">Charge Sheets</p>
              <p className="text-lg font-bold text-white">1,294</p>
              <p className="text-[10px] text-emerald-500 flex items-center mt-0.5"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5"/> 11.7%</p>
            </div>
            <div className="w-[45%] md:w-auto">
              <p className="text-[10px] text-slate-400 mb-1 uppercase">Conviction Rate</p>
              <p className="text-lg font-bold text-white">41%</p>
              <p className="text-[10px] text-emerald-500 flex items-center mt-0.5"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5"/> 2.1%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-5 rounded-xl lg:w-1/3">
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap justify-between gap-4">
            {quickActions.map((action, idx) => (
              <div key={idx} onClick={() => handleActionClick(action.id)} className="flex flex-col items-center cursor-pointer group">
                <div className={`${action.bg} p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-[9px] text-slate-400 text-center max-w-[50px] leading-tight group-hover:text-slate-200">{action.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Modals for Quick Actions & View All */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                {activeModal === 'register_fir' && 'Register New FIR'}
                {activeModal === 'search_case' && 'Search Case Details'}
                {activeModal === 'track_suspect' && 'Track Suspect location'}
                {activeModal === 'generate_report' && 'Generate Custom Report'}
                {activeModal === 'upload_evidence' && 'Upload Digital Evidence'}
                {activeModal === 'all_stations' && 'All Police Stations (Case Load)'}
                {activeModal === 'all_alerts' && 'All Recent Alerts'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {(activeModal === 'all_stations') ? (
              <div className="space-y-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                      <th className="pb-2 font-medium">Station</th>
                      <th className="pb-2 font-medium">Cases</th>
                      <th className="pb-2 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/50">
                    {[...topStations, 
                      { name: 'Koramangala', cases: 142, trend: '+3.1%', isUp: true },
                      { name: 'Indiranagar', cases: 138, trend: '-1.2%', isUp: false },
                      { name: 'Jayanagar', cases: 110, trend: '+2.4%', isUp: true },
                      { name: 'Shivajinagar', cases: 95, trend: '-5.6%', isUp: false },
                      { name: 'Malleswaram', cases: 88, trend: '+1.1%', isUp: true },
                      { name: 'Ulsoor', cases: 72, trend: '-0.8%', isUp: false }
                    ].map((station, idx) => (
                      <tr key={idx} className="text-slate-300">
                        <td className="py-3 font-medium">{station.name}</td>
                        <td className="py-3">{station.cases}</td>
                        <td className={`py-3 ${station.isUp ? 'text-rose-500' : 'text-emerald-500'}`}>
                          <div className="flex items-center">
                            {station.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {station.trend}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (activeModal === 'all_alerts') ? (
              <div className="space-y-4">
                {[...alerts, 
                  { id: 5, text: 'Fraudulent transaction detected in JP Nagar.', time: 'Yesterday, 11:45 PM', type: 'info' },
                  { id: 6, text: 'Suspicious login attempt blocked.', time: 'Yesterday, 09:32 PM', type: 'high' },
                  { id: 7, text: 'Robbery reported near Electronic City phase 2.', time: 'Yesterday, 08:15 PM', type: 'medium' },
                  { id: 8, text: 'Data breach attempt blocked on internal network.', time: 'Yesterday, 06:15 PM', type: 'high' },
                  { id: 9, text: 'Routine server maintenance completed.', time: 'Yesterday, 02:00 AM', type: 'low' }
                ].map((alert, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className={`mt-0.5 p-1 rounded-full mr-3 ${
                      alert.type === 'high' ? 'bg-rose-500/20 text-rose-500' :
                      alert.type === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                      alert.type === 'info' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-200">{alert.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 ml-2">{alert.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  This feature is available in the fully operational version of the SentinAI platform connected to the KSP CCTNS network.
                </p>
                <div className="bg-[#131c2f] p-4 rounded-lg border border-[#1e293b]">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-2 bg-[#1e293b] rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-2 bg-[#1e293b] rounded"></div>
                        <div className="h-2 bg-[#1e293b] rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-[#4c1d95] hover:bg-[#5b21b6] text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Acknowledge & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
