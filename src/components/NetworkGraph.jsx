import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Network, Target, Link, UserPlus, Shield, Filter, Download,
  Maximize, ZoomIn, ZoomOut, Settings2, ChevronRight, AlertTriangle, Globe, Lock, ChevronDown, X, Phone, MapPin, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import { exportToCSV } from '../utils/exportUtils';

const SuspectNetwork = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  const kpis = [
    { title: 'Total Suspects', value: '1,256', change: '+ 8.6%', isUp: true, icon: <Users className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/20' },
    { title: 'Active Networks', value: '328', change: '+ 12.3%', isUp: true, icon: <Network className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/20' },
    { title: 'High Value Targets', value: '56', change: '+ 5.2%', isUp: true, icon: <Target className="w-5 h-5 text-rose-400" />, color: 'bg-rose-500/20' },
    { title: 'Links Identified', value: '2,843', change: '+ 14.7%', isUp: true, icon: <Link className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/20' },
    { title: 'New Associations', value: '184', change: '+ 9.1%', isUp: true, icon: <UserPlus className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/20' },
  ];

  const topSuspects = [
    { id: 1, name: 'Ramesh K.', risk: 'High Value Target', riskClass: 'text-rose-500', connections: 23, bg: 'bg-rose-500', age: 34, lastSeen: 'Koramangala', status: 'Active Surveillance' },
    { id: 2, name: 'Sanjay M.', risk: 'Medium Risk', riskClass: 'text-amber-500', connections: 17, bg: 'bg-amber-500', age: 29, lastSeen: 'Indiranagar', status: 'Known Associate' },
    { id: 3, name: 'Imran P.', risk: 'Medium Risk', riskClass: 'text-amber-500', connections: 15, bg: 'bg-amber-500', age: 41, lastSeen: 'Shivajinagar', status: 'Under Investigation' },
    { id: 4, name: 'Vikram S.', risk: 'Low Risk', riskClass: 'text-emerald-500', connections: 11, bg: 'bg-emerald-500', age: 25, lastSeen: 'Whitefield', status: 'Monitored' },
    { id: 5, name: 'Arif H.', risk: 'Low Risk', riskClass: 'text-emerald-500', connections: 10, bg: 'bg-emerald-500', age: 38, lastSeen: 'Jayanagar', status: 'Inactive' },
  ];

  const relationData = [
    { name: 'Known Associates', value: 1079, color: '#3b82f6', pct: '38%' },
    { name: 'Family / Relative', value: 625, color: '#10b981', pct: '22%' },
    { name: 'Business / Financial', value: 512, color: '#f59e0b', pct: '18%' },
    { name: 'Communications', value: 341, color: '#ef4444', pct: '12%' },
    { name: 'Others', value: 286, color: '#8b5cf6', pct: '10%' },
  ];

  const evolutionData = [
    { name: '19 Apr', new: 100, dismantled: 20 },
    { name: '26 Apr', new: 120, dismantled: 30 },
    { name: '3 May', new: 150, dismantled: 45 },
    { name: '10 May', new: 180, dismantled: 40 },
    { name: '17 May', new: 220, dismantled: 60 },
  ];

  const networkAlerts = [
    { text: 'Ramesh K. has communicated with a high-risk suspect.', time: '10:21 AM', type: 'high' },
    { text: 'Suspicious meeting detected in Koramangala area.', time: '09:48 AM', type: 'medium' },
    { text: 'New financial transaction linked to Imran P.', time: '08:37 AM', type: 'low' },
    { text: 'Unusual communication pattern detected.', time: '07:22 AM', type: 'info' },
  ];

  const handleNodeClick = (id) => {
    const suspect = topSuspects.find(s => s.id === id);
    if (suspect) setSelectedSuspect(suspect);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto pb-12">
      <TopBar title="Suspect Network" subtitle="Identify connections, associations and criminal linkages">
        <div className="relative">
          <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
              <div className="p-2 border-b border-[#1e293b]">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Network Filters</h4>
              </div>
              <div className="p-1">
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-slate-300">High Risk Nodes</span>
                </label>
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-slate-300">Active Connections</span>
                </label>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => {
          exportToCSV(topSuspects, 'network_suspects.csv');
        }} className="flex items-center space-x-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-3 border border-[#6d28d9]">
          <Download className="w-4 h-4" />
          <span>Export Network</span>
        </button>
      </TopBar>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">{kpi.title}</p>
              <h3 className="text-xl font-bold text-white mb-0.5">{kpi.value}</h3>
              <p className={`text-[10px] flex items-center ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {kpi.isUp ? '↑' : '↓'} {kpi.change} <span className="text-slate-500 ml-1">vs last 7 days</span>
              </p>
            </div>
          </div>
        ))}
        {/* Network Score Panel */}
        <div className="glass-panel p-4 rounded-xl flex items-center border-l-2 border-l-rose-500 bg-[#1e1b4b]/20">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-blue-500/20 border border-blue-500/30">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Network Score</p>
            <h3 className="text-xl font-bold text-white mb-0.5">72 <span className="text-sm font-normal text-slate-500">/100</span></h3>
            <p className="text-[10px] font-bold text-rose-500">High Risk</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Column (Main Graph & Bottom Insights) */}
        <div className="flex-1 flex flex-col space-y-6">
          
          {/* Main Network Graph */}
          <div className="glass-panel rounded-xl flex flex-col h-[500px] relative overflow-hidden">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center z-10 bg-[#131c2f]">
              <h3 className="text-sm font-semibold text-white">Network Graph</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-xs text-slate-300 bg-[#0b1120] px-3 py-1.5 rounded-md border border-[#1e293b] cursor-pointer">
                  View Options <ChevronDown className="w-3 h-3 ml-2" />
                </div>
                <button className="p-1.5 bg-[#0b1120] border border-[#1e293b] rounded-md text-slate-400 hover:text-white">
                  <Settings2 className="w-4 h-4" />
                </button>
                <div className="flex bg-[#0b1120] border border-[#1e293b] rounded-md">
                  <button className="p-1.5 text-slate-400 hover:text-white border-r border-[#1e293b]"><ZoomIn className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-white border-r border-[#1e293b]"><ZoomOut className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-white"><Maximize className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            
            {/* Graph Visualization Area */}
            <div className="flex-1 relative bg-[#0b1120] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 800 400">
                  <circle cx="400" cy="200" r="180" stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                  <circle cx="400" cy="200" r="100" stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                  
                  {/* Connections */}
                  <line x1="400" y1="200" x2="250" y2="150" stroke="#f59e0b" strokeWidth={selectedSuspect?.id === 2 ? 4 : 2} strokeOpacity={selectedSuspect?.id === 2 ? 1 : 0.5} className="transition-all duration-300"/>
                  <line x1="400" y1="200" x2="300" y2="300" stroke="#f59e0b" strokeWidth={selectedSuspect?.id === 3 ? 4 : 2} strokeOpacity={selectedSuspect?.id === 3 ? 1 : 0.5} className="transition-all duration-300"/>
                  <line x1="400" y1="200" x2="550" y2="150" stroke="#10b981" strokeWidth={selectedSuspect?.id === 4 ? 4 : 2} strokeOpacity={selectedSuspect?.id === 4 ? 1 : 0.5} className="transition-all duration-300"/>
                  <line x1="400" y1="200" x2="500" y2="300" stroke="#3b82f6" strokeWidth={selectedSuspect?.id === 5 ? 4 : 2} strokeOpacity={selectedSuspect?.id === 5 ? 1 : 0.5} className="transition-all duration-300"/>
                  
                  {/* Sub Nodes */}
                  <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNodeClick(2)}>
                    <circle cx="250" cy="150" r="12" fill="#f59e0b"/>
                    <text x="250" y="175" fill="#f59e0b" fontSize="10" textAnchor="middle">Sanjay M.</text>
                  </g>
                  <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNodeClick(3)}>
                    <circle cx="300" cy="300" r="12" fill="#f59e0b"/>
                    <text x="300" y="325" fill="#f59e0b" fontSize="10" textAnchor="middle">Imran P.</text>
                  </g>
                  <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNodeClick(4)}>
                    <circle cx="550" cy="150" r="12" fill="#10b981"/>
                    <text x="550" y="175" fill="#10b981" fontSize="10" textAnchor="middle">Vikram S.</text>
                  </g>
                  <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNodeClick(5)}>
                    <circle cx="500" cy="300" r="12" fill="#3b82f6"/>
                    <text x="500" y="325" fill="#3b82f6" fontSize="10" textAnchor="middle">Arif H.</text>
                  </g>

                  {/* Central Node */}
                  <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNodeClick(1)}>
                    <circle cx="400" cy="200" r="25" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2">
                      <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="400" cy="200" r="15" fill="#ef4444"/>
                    <text x="400" y="240" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">Ramesh K.</text>
                    <text x="400" y="255" fill="#ef4444" fontSize="10" textAnchor="middle">High Value Target</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#131c2f]/90 backdrop-blur border border-[#1e293b] rounded-lg p-3 flex justify-between items-center z-10 text-[10px] text-slate-300">
              <div className="flex space-x-4">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>High Risk</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>Medium Risk</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>Low Risk</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-1.5"></span>Neutral</div>
              </div>
              <div className="flex space-x-4 text-slate-400">
                <div className="flex items-center"><div className="w-6 h-0.5 bg-slate-400 mr-1.5"></div>Strong Link</div>
                <div className="flex items-center"><div className="w-6 h-0.5 bg-slate-500 border-t border-dashed border-slate-500 mr-1.5 bg-transparent"></div>Weak Link</div>
                <div className="flex items-center">Association →</div>
              </div>
            </div>
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Network Insights */}
            <div className="glass-panel p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Network Insights</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <Users className="w-4 h-4 text-rose-500 mt-0.5" />
                  <p className="text-slate-300">Ramesh K. is connected to 23 suspects across 3 districts.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Link className="w-4 h-4 text-amber-500 mt-0.5" />
                  <p className="text-slate-300">New association detected between Sanjay M. and Imran P.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <p className="text-slate-300">Cross-border link detected with 2 external entities.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-slate-300">Financial transactions found between 4 suspects.</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1e293b]">
                <button onClick={() => navigate('/reports')} className="flex items-center space-x-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
                  <span>View Full Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Network Evolution */}
            <div className="glass-panel p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Network Evolution <span className="normal-case font-normal">(Last 30 Days)</span></h3>
              <div className="flex justify-center space-x-4 mb-2 text-[10px]">
                <div className="flex items-center"><div className="w-3 h-1 rounded-full bg-[#8b5cf6] mr-1.5"></div><span className="text-slate-300">New Links</span></div>
                <div className="flex items-center"><div className="w-3 h-1 rounded-full bg-rose-500 mr-1.5"></div><span className="text-slate-300">Dismantled Links</span></div>
              </div>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Line type="monotone" dataKey="new" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="dismantled" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[350px] flex flex-col space-y-6">
          
          {/* Top Connected Suspects */}
          <div className="glass-panel rounded-xl flex-1 max-h-[300px] flex flex-col">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Connected Suspects</h3>
              <button onClick={() => setActiveModal('all_suspects')} className="text-[10px] text-[#a855f7] hover:text-[#c084fc]">View All</button>
            </div>
            <div className="p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
              {topSuspects.map(suspect => (
                <div key={suspect.id} onClick={() => handleNodeClick(suspect.id)} className="flex items-center justify-between p-3 border-b border-[#1e293b]/50 last:border-0 hover:bg-[#1e293b]/30 rounded-lg transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <span className={`w-5 h-5 rounded-md ${suspect.bg} text-[10px] font-bold text-white flex items-center justify-center`}>{suspect.id}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${suspect.id}`} alt="User" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">{suspect.name}</h4>
                        <p className={`text-[9px] ${suspect.riskClass}`}>{suspect.risk}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 mb-0.5">Connections</p>
                    <p className={`text-sm font-bold ${suspect.riskClass}`}>{suspect.connections}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship Types */}
          <div className="glass-panel rounded-xl p-5 flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relationship Types</h3>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-[120px] relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={relationData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                      {relationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-white">2,843</span>
                  <span className="text-[9px] text-slate-400 uppercase">TOTAL</span>
                </div>
              </div>
              <div className="w-full space-y-2 text-[10px]">
                {relationData.map(rel => (
                  <div key={rel.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: rel.color }}></span>
                      <span className="text-slate-300">{rel.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-white font-medium">{rel.pct}</span>
                      <span className="text-slate-500 w-8 text-right">({rel.value})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts from Network */}
          <div className="glass-panel rounded-xl">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alerts from Network</h3>
              <button onClick={() => setActiveModal('all_alerts')} className="text-[10px] text-[#a855f7] hover:text-[#c084fc]">View All</button>
            </div>
            <div className="p-4 space-y-4">
              {networkAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-md mr-3 flex-shrink-0 border ${
                    alert.type === 'high' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                    alert.type === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                    alert.type === 'low' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                    'bg-blue-500/10 border-blue-500/30 text-blue-500'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-300 leading-snug">{alert.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 ml-2 mt-0.5 whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Suspect Modal Overlay */}
      {selectedSuspect && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="relative h-24 bg-gradient-to-r from-[#4c1d95] to-[#1e1b4b]">
              <button onClick={() => setSelectedSuspect(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 p-1 rounded-full backdrop-blur-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-[#0b1120] bg-slate-800 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/150?u=${selectedSuspect.id}`} alt={selectedSuspect.name} className="w-full h-full object-cover" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedSuspect.riskClass.replace('text', 'border')}/30 ${selectedSuspect.riskClass.replace('text', 'bg')}/10 ${selectedSuspect.riskClass}`}>
                  {selectedSuspect.risk}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{selectedSuspect.name}</h2>
              <p className="text-slate-400 text-sm mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> {selectedSuspect.status}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#131c2f] p-3 rounded-xl border border-[#1e293b]">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 flex items-center"><Link className="w-3 h-3 mr-1" /> Connections</p>
                  <p className="text-lg font-bold text-white">{selectedSuspect.connections}</p>
                </div>
                <div className="bg-[#131c2f] p-3 rounded-xl border border-[#1e293b]">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Last Seen</p>
                  <p className="text-sm font-bold text-white mt-1">{selectedSuspect.lastSeen}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-300">
                  <UserPlus className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Age: {selectedSuspect.age}</span>
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Briefcase className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Suspected Involvements: Extortion, Assault</span>
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <Phone className="w-4 h-4 mr-3 text-slate-500" />
                  <span>Last Communication: 2 hrs ago</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1e293b] flex space-x-3">
                <button className="flex-1 bg-[#4c1d95] hover:bg-[#5b21b6] text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Full Profile
                </button>
                <button onClick={() => setSelectedSuspect(null)} className="flex-1 bg-transparent border border-[#1e293b] text-slate-300 hover:bg-[#1e293b] hover:text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                {activeModal === 'all_suspects' && 'All Connected Suspects'}
                {activeModal === 'all_alerts' && 'All Alerts from Network'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            {(activeModal === 'all_suspects') ? (
              <div className="space-y-4">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                      <th className="pb-2 font-medium">Suspect</th>
                      <th className="pb-2 font-medium text-right">Connections</th>
                      <th className="pb-2 font-medium text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e293b]/50">
                    {[...topSuspects,
                      { name: 'Karthik S.', connections: 8, risk: 'Medium', riskColor: 'text-amber-500' },
                      { name: 'Arjun P.', connections: 6, risk: 'High', riskColor: 'text-rose-500' },
                      { name: 'Vikas N.', connections: 5, risk: 'Low', riskColor: 'text-emerald-500' },
                      { name: 'Praveen G.', connections: 4, risk: 'Medium', riskColor: 'text-amber-500' },
                      { name: 'Ramesh H.', connections: 2, risk: 'Low', riskColor: 'text-emerald-500' }
                    ].map((suspect, idx) => (
                      <tr key={idx} className="text-slate-300">
                        <td className="py-3 font-medium">{suspect.name}</td>
                        <td className="py-3 text-right">{suspect.connections}</td>
                        <td className={`py-3 text-right ${suspect.riskColor}`}>{suspect.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (activeModal === 'all_alerts') ? (
              <div className="space-y-4">
                {[...networkAlerts,
                  { text: 'New connection detected: Node 14 (Fraud)', time: 'Yesterday, 11:45 PM', type: 'info' },
                  { text: 'Cluster density increased in Koramangala network', time: 'Yesterday, 09:32 PM', type: 'high' },
                  { text: 'Known associate spotted near target location', time: 'Yesterday, 08:15 PM', type: 'medium' },
                  { text: 'Unusual communication pattern identified', time: 'Yesterday, 06:15 PM', type: 'high' }
                ].map((alert, idx) => (
                  <div key={idx} className="flex items-start">
                    <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 mr-3 flex-shrink-0 ${
                      alert.type === 'high' ? 'text-rose-500' : 
                      alert.type === 'medium' ? 'text-amber-500' : 'text-[#a855f7]'
                    }`} />
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-300">{alert.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 ml-2">{alert.time}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuspectNetwork;
