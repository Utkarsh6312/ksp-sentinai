import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Users, ShieldAlert, Clock,
  ChevronDown, Download, ArrowUpRight, ArrowDownRight,
  MapPin, Scale, RefreshCcw, TrendingUp, Target, Shield, Search
} from 'lucide-react';
import TopBar from './TopBar';
import mockData from '../data/mockSchema.json';
import { exportToCSV } from '../utils/exportUtils';

const CrimeAnalytics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All'); // All, Violent, Property
  const [activeModal, setActiveModal] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 Days',
    crimeType: 'All',
    district: 'All Districts',
    station: 'All',
    timeRange: 'All Time'
  });

  const [showFilterDropdown, setShowFilterDropdown] = useState(null);

  const getMultiplier = () => {
    let m = 1;
    switch (filters.dateRange) {
      case 'Today': m *= 0.2; break;
      case 'This Month': m *= 4.5; break;
      case 'This Year': m *= 52; break;
      case 'Last 7 Days':
      default: m *= 1; break;
    }
    
    if (filters.district !== 'All Districts') m *= 0.25;
    if (filters.station !== 'All') m *= 0.1;
    if (filters.crimeType !== 'All') m *= 0.35;
    if (filters.timeRange !== 'All Time') m *= 0.25;

    return m;
  };
  const m = getMultiplier();

  const kpis = [
    { title: 'Total Crimes', value: Math.round(1843 * m).toLocaleString(), change: '+ 14.2%', isUp: true, icon: <FileText className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/20' },
    { title: 'Heinous Crimes', value: Math.round(320 * m).toLocaleString(), change: '+ 5.6%', isUp: true, icon: <ShieldAlert className="w-5 h-5 text-rose-400" />, color: 'bg-rose-500/20' },
    { title: 'Total Arrests', value: Math.round(2154 * m).toLocaleString(), change: '+ 8.3%', isUp: true, icon: <Users className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/20' },
    { title: 'Charge Sheets Filed', value: Math.round(1294 * m).toLocaleString(), change: '+ 11.7%', isUp: true, icon: <FileText className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/20' },
    { title: 'Conviction Rate', value: '41%', change: '+ 2.1%', isUp: true, icon: <Scale className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/20' },
    { title: 'Avg. Response Time', value: '18m 45s', change: '- 5.2%', isUp: false, icon: <Clock className="w-5 h-5 text-[#a855f7]" />, color: 'bg-[#a855f7]/20' },
  ];

  const trendDataMap = {
    'All': [
      { name: '13 May', crimes: Math.round(500 * m), heinous: Math.round(100 * m), arrests: Math.round(300 * m) },
      { name: '14 May', crimes: Math.round(600 * m), heinous: Math.round(150 * m), arrests: Math.round(400 * m) },
      { name: '15 May', crimes: Math.round(750 * m), heinous: Math.round(200 * m), arrests: Math.round(480 * m) },
      { name: '16 May', crimes: Math.round(600 * m), heinous: Math.round(250 * m), arrests: Math.round(420 * m) },
      { name: '17 May', crimes: Math.round(800 * m), heinous: Math.round(220 * m), arrests: Math.round(520 * m) },
      { name: '18 May', crimes: Math.round(850 * m), heinous: Math.round(300 * m), arrests: Math.round(550 * m) },
      { name: '19 May', crimes: Math.round(820 * m), heinous: Math.round(320 * m), arrests: Math.round(580 * m) },
    ],
    'Violent': [
      { name: '13 May', crimes: Math.round(150 * m), heinous: Math.round(100 * m), arrests: Math.round(120 * m) },
      { name: '14 May', crimes: Math.round(200 * m), heinous: Math.round(150 * m), arrests: Math.round(160 * m) },
      { name: '15 May', crimes: Math.round(250 * m), heinous: Math.round(200 * m), arrests: Math.round(190 * m) },
      { name: '16 May', crimes: Math.round(270 * m), heinous: Math.round(250 * m), arrests: Math.round(200 * m) },
      { name: '17 May', crimes: Math.round(240 * m), heinous: Math.round(220 * m), arrests: Math.round(210 * m) },
      { name: '18 May', crimes: Math.round(320 * m), heinous: Math.round(300 * m), arrests: Math.round(250 * m) },
      { name: '19 May', crimes: Math.round(340 * m), heinous: Math.round(320 * m), arrests: Math.round(280 * m) },
    ],
    'Property': [
      { name: '13 May', crimes: Math.round(350 * m), heinous: 0, arrests: Math.round(180 * m) },
      { name: '14 May', crimes: Math.round(400 * m), heinous: 0, arrests: Math.round(240 * m) },
      { name: '15 May', crimes: Math.round(500 * m), heinous: 0, arrests: Math.round(290 * m) },
      { name: '16 May', crimes: Math.round(330 * m), heinous: 0, arrests: Math.round(220 * m) },
      { name: '17 May', crimes: Math.round(560 * m), heinous: 0, arrests: Math.round(310 * m) },
      { name: '18 May', crimes: Math.round(530 * m), heinous: 0, arrests: Math.round(300 * m) },
      { name: '19 May', crimes: Math.round(480 * m), heinous: 0, arrests: Math.round(300 * m) },
    ]
  };

  const trendData = trendDataMap[activeTab];

  const categoryData = [
    { name: 'Theft', value: Math.round(515 * m), color: '#3b82f6', pct: '28%' },
    { name: 'Cyber Crime', value: Math.round(442 * m), color: '#ef4444', pct: '24%' },
    { name: 'Assault', value: Math.round(332 * m), color: '#eab308', pct: '18%' },
    { name: 'Fraud', value: Math.round(295 * m), color: '#22c55e', pct: '16%' },
    { name: 'Others', value: Math.round(259 * m), color: '#38bdf8', pct: '14%' },
  ];

  const districtData = [
    { name: 'Bengaluru Urban', value: Math.round(436 * m) },
    { name: 'Mysuru', value: Math.round(298 * m) },
    { name: 'Davanagere', value: Math.round(210 * m) },
    { name: 'Hubballi Dharwad', value: Math.round(184 * m) },
    { name: 'Tumakuru', value: Math.round(153 * m) },
    { name: 'Belagavi', value: Math.round(98 * m) },
  ];

  const solvedData = [
    { name: 'Solved', value: Math.round(1072 * m), color: '#10b981', pct: '58%' },
    { name: 'Under Investigation', value: Math.round(461 * m), color: '#f59e0b', pct: '25%' },
    { name: 'Unsolved', value: Math.round(310 * m), color: '#ef4444', pct: '17%' },
  ];

  const topLocations = [
    { name: 'MG Road, Bengaluru', cases: Math.round(126 * m), trend: '+ 12%', isUp: true },
    { name: 'K.R. Market, Bengaluru', cases: Math.round(98 * m), trend: '+ 8%', isUp: true },
    { name: 'Devaraja Mohalla, Mysuru', cases: Math.round(74 * m), trend: '+ 15%', isUp: true },
    { name: 'Davangere City Center', cases: Math.round(65 * m), trend: '- 5%', isUp: false },
    { name: 'Central Hubli', cases: Math.round(53 * m), trend: '+ 3%', isUp: true },
  ];

  const handleFilterClick = (key) => {
    setShowFilterDropdown(showFilterDropdown === key ? null : key);
  };

  const handleFilterSelect = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setShowFilterDropdown(null);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: 'Last 7 Days',
      crimeType: 'All',
      district: 'All Districts',
      station: 'All',
      timeRange: 'All Time'
    });
    setActiveTab('All');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto pb-12">
      <TopBar title="Crime Analytics" subtitle="Deep insights into crime patterns and trends">
        <div className="flex border border-[#1e293b] rounded-lg overflow-hidden mr-4 bg-[#131c2f]">
          {['All', 'Violent', 'Property'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'bg-[#4c1d95] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => exportToCSV(trendData, 'crime_analytics_report.csv')} className="flex items-center space-x-2 bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-[#9333ea]">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </TopBar>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 glass-panel px-4 py-2 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-6 relative">
            <div className="relative">
              <p className="text-[10px] text-slate-500 mb-1 uppercase">Date Range</p>
              <div onClick={() => handleFilterClick('dateRange')} className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white">
                {filters.dateRange} <ChevronDown className="w-3 h-3 ml-2" />
              </div>
              {showFilterDropdown === 'dateRange' && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-[#131c2f] border border-[#1e293b] rounded-lg shadow-xl z-20 py-1">
                  {['Today', 'Last 7 Days', 'This Month', 'This Year'].map(opt => (
                    <div key={opt} onClick={() => handleFilterSelect('dateRange', opt)} className="px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b] cursor-pointer">{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-[#1e293b]"></div>
            <div className="relative">
              <p className="text-[10px] text-slate-500 mb-1 uppercase">Crime Type</p>
              <div onClick={() => handleFilterClick('crimeType')} className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white">
                {filters.crimeType} <ChevronDown className="w-3 h-3 ml-2" />
              </div>
              {showFilterDropdown === 'crimeType' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#131c2f] border border-[#1e293b] rounded-lg shadow-xl z-20 py-1">
                  {['All', 'Theft', 'Cyber Crime', 'Assault', 'Fraud', 'Narcotics', 'Homicide'].map(opt => (
                    <div key={opt} onClick={() => handleFilterSelect('crimeType', opt)} className="px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b] cursor-pointer">{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-[#1e293b]"></div>
            <div className="relative">
              <p className="text-[10px] text-slate-500 mb-1 uppercase">District</p>
              <div onClick={() => handleFilterClick('district')} className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white">
                {filters.district} <ChevronDown className="w-3 h-3 ml-2" />
              </div>
              {showFilterDropdown === 'district' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#131c2f] border border-[#1e293b] rounded-lg shadow-xl z-20 py-1 max-h-64 overflow-y-auto scrollbar-thin">
                  {['All Districts', 'Bengaluru Urban', 'Mysuru', 'Davanagere', 'Hubballi Dharwad', 'Tumakuru', 'Belagavi'].map(opt => (
                    <div key={opt} onClick={() => handleFilterSelect('district', opt)} className="px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b] cursor-pointer">{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-[#1e293b]"></div>
            <div className="relative">
              <p className="text-[10px] text-slate-500 mb-1 uppercase">Police Station</p>
              <div onClick={() => handleFilterClick('station')} className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white">
                {filters.station} <ChevronDown className="w-3 h-3 ml-2" />
              </div>
              {showFilterDropdown === 'station' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#131c2f] border border-[#1e293b] rounded-lg shadow-xl z-20 py-1">
                  <div className="px-3 py-2 border-b border-[#1e293b]">
                    <div className="relative">
                      <Search className="w-3 h-3 absolute left-2 top-1.5 text-slate-500" />
                      <input type="text" placeholder="Search station..." className="w-full bg-[#0b1120] text-xs text-white rounded px-2 py-1 pl-7 outline-none border border-[#1e293b] focus:border-[#a855f7]" />
                    </div>
                  </div>
                  {['All', 'Central PS', 'Koramangala PS', 'Indiranagar PS', 'Whitefield PS'].map(opt => (
                    <div key={opt} onClick={() => handleFilterSelect('station', opt)} className="px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b] cursor-pointer">{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-8 bg-[#1e293b]"></div>
            <div className="relative">
              <p className="text-[10px] text-slate-500 mb-1 uppercase">Time Range</p>
              <div onClick={() => handleFilterClick('timeRange')} className="flex items-center text-sm text-slate-300 cursor-pointer hover:text-white">
                {filters.timeRange} <ChevronDown className="w-3 h-3 ml-2" />
              </div>
              {showFilterDropdown === 'timeRange' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#131c2f] border border-[#1e293b] rounded-lg shadow-xl z-20 py-1">
                  {['All Time', 'Morning (6AM - 12PM)', 'Afternoon (12PM - 6PM)', 'Evening (6PM - 12AM)', 'Night (12AM - 6AM)'].map(opt => (
                    <div key={opt} onClick={() => handleFilterSelect('timeRange', opt)} className="px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b] cursor-pointer">{opt}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={clearFilters} className="flex items-center space-x-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">{kpi.title}</p>
              <h3 className="text-xl font-bold text-white mb-0.5">{kpi.value}</h3>
              <p className={`text-[10px] flex items-center ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                {kpi.change} <span className="text-slate-500 ml-1">vs previous 7 days</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Crime Trend Over Time ({activeTab})</h3>
            <div className="flex items-center text-xs text-slate-400 bg-[#0b1120] px-2 py-1 rounded border border-[#1e293b]">
              {filters.dateRange}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-2 text-xs">
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#8b5cf6] mr-1.5"></span><span className="text-slate-400">Total Crimes</span></div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span><span className="text-slate-400">Heinous Crimes</span></div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span><span className="text-slate-400">Arrests</span></div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="crimes" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="heinous" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="arrests" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Crime by Category <span className="text-slate-500 font-normal">({filters.dateRange})</span></h3>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">{Math.round(1843 * m).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">TOTAL</span>
              </div>
            </div>
            <div className="w-1/2 space-y-3">
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
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Top Districts by Volume</h3>
            <button onClick={() => setActiveModal('all_districts')} className="text-xs text-[#a855f7] hover:text-white">View All</button>
          </div>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={12}>
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel p-5 rounded-xl">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-semibold text-white">Crime by Time of Day</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Higher intensity shows more crimes</p>
          <div className="flex h-[180px]">
            <div className="flex flex-col justify-between text-[9px] text-slate-500 pr-2 pb-6 pt-1">
              <span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 grid grid-cols-7 gap-1 bg-[#0b1120] p-1 rounded-lg border border-[#1e293b]">
                {Array.from({ length: 7 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-1">
                    {Array.from({ length: 6 }).map((_, row) => {
                      let color = 'bg-[#1e293b]';
                      if (row > 3 && col < 5) color = 'bg-rose-500/80'; 
                      else if (row === 2) color = 'bg-amber-500/80';
                      else if (row === 4) color = 'bg-[#a855f7]/80';
                      return <div key={`${col}-${row}`} className={`flex-1 rounded-sm ${color}`}></div>;
                    })}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 mt-2 text-center text-[9px] text-slate-500">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Top Crime Locations <span className="text-slate-500 font-normal">({filters.dateRange})</span></h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                <th className="pb-2 text-left font-medium">Location</th>
                <th className="pb-2 text-right font-medium">Cases</th>
                <th className="pb-2 text-right font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/50">
              {topLocations.map((loc, idx) => (
                <tr key={idx} className="text-slate-300 hover:bg-[#1e293b]/30 transition-colors">
                  <td className="py-2.5 font-medium">{loc.name}</td>
                  <td className="py-2.5 text-right font-medium">{loc.cases}</td>
                  <td className={`py-2.5 text-right ${loc.isUp ? 'text-rose-500' : 'text-emerald-500'}`}>
                    <div className="flex items-center justify-end">
                      {loc.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {loc.trend}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3 border-t border-[#1e293b] text-center">
            <button onClick={() => setActiveModal('all_locations')} className="flex items-center justify-center w-full space-x-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              <span>View All Locations →</span>
            </button>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white">Crime Solved vs Unsolved</h3>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={solvedData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {solvedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-white">{solvedData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">TOTAL</span>
              </div>
            </div>
            <div className="w-1/2 space-y-4">
              {solvedData.map(stat => (
                <div key={stat.name} className="flex flex-col text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="w-2.5 h-2.5 rounded-sm mr-2" style={{ backgroundColor: stat.color }}></span>
                      <span className="text-slate-300">{stat.name}</span>
                    </div>
                    <span className="text-white font-medium">{stat.pct}</span>
                  </div>
                  <div className="text-slate-500 text-right w-full">({stat.value})</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e293b] text-center">
            <button onClick={() => navigate('/reports')} className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">View All Cases →</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Insights & Key Takeaways</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#a855f7]" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Evening hours (6 PM - 10 PM) show <span className="font-bold text-white">38% higher crime activity</span>.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <Target className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Bengaluru Urban and Mysuru districts contribute to <span className="font-bold text-white">40% of total crimes</span>.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-start space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Cyber crimes increased by <span className="font-bold text-white">24%</span> compared to last month.
            </p>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                {activeModal === 'all_districts' && 'All Districts by Volume'}
                {activeModal === 'all_locations' && 'All Crime Locations'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            {(activeModal === 'all_districts') ? (
              <div className="space-y-4">
                {[...districtData,
                  { name: 'Belagavi', value: 340, fill: '#3b82f6' },
                  { name: 'Dakshina Kannada', value: 320, fill: '#3b82f6' },
                  { name: 'Kalaburagi', value: 290, fill: '#3b82f6' },
                  { name: 'Dharwad', value: 275, fill: '#3b82f6' },
                  { name: 'Tumakuru', value: 250, fill: '#3b82f6' }
                ].sort((a,b) => b.value - a.value).map((d, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-[#1e293b] pb-2 last:border-0">
                    <span className="text-slate-300">{d.name}</span>
                    <span className="text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            ) : (activeModal === 'all_locations') ? (
              <div className="space-y-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                      <th className="pb-2 font-medium">Location</th>
                      <th className="pb-2 font-medium text-right">Cases</th>
                      <th className="pb-2 font-medium text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/50">
                    {[...topLocations,
                      { name: 'Indiranagar 100ft', cases: 56, trend: '+4.1%', isUp: true },
                      { name: 'Electronic City Ph 1', cases: 48, trend: '-2.1%', isUp: false },
                      { name: 'Malleswaram 8th Cross', cases: 32, trend: '+1.5%', isUp: true },
                      { name: 'Whitefield Main Rd', cases: 29, trend: '-1.0%', isUp: false },
                      { name: 'Jayanagar 4th Block', cases: 25, trend: '+0.5%', isUp: true },
                      { name: 'MG Road', cases: 20, trend: '-3.2%', isUp: false }
                    ].map((loc, idx) => (
                      <tr key={idx} className="text-slate-300">
                        <td className="py-2.5 font-medium">{loc.name}</td>
                        <td className="py-2.5 text-right">{loc.cases}</td>
                        <td className={`py-2.5 text-right ${loc.isUp ? 'text-rose-500' : 'text-emerald-500'}`}>
                          <div className="flex items-center justify-end">
                            {loc.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {loc.trend}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrimeAnalytics;
