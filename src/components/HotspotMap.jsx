import React, { useState, useEffect } from 'react';
import { 
  MapContainer, TileLayer, CircleMarker, Popup, useMap, LayersControl 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, ShieldAlert, Crosshair, AlertTriangle, Layers, Filter, 
  Search, Maximize2, Download, Activity, Radar, CheckSquare, Square, Shield
} from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import CrimeHeatmap from './Maps/CrimeHeatmap';
import { useData } from '../context/DataContext';
import { exportToCSV } from '../utils/exportUtils';

const HotspotMap = () => {
  const { data: mockData, loading } = useData();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [mapMode, setMapMode] = useState('Heat Map'); // 'Heat Map', 'Cluster View'
  const [activeLayers, setActiveLayers] = useState({
    'Violent Crimes': true,
    'Property Crimes': true,
    'Cyber Crimes': false,
    'Traffic Incidents': false,
    'CCTV Coverage': true
  });
  const [filters, setFilters] = useState({
    timeRange: 'Last 24 Hours',
    district: 'All'
  });

  if (loading || !mockData) {
    return <div className="flex h-full items-center justify-center text-slate-400">Loading live database...</div>;
  }
  
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bengaluru

  const getTimeData = () => {
    let multiplier = Object.values(activeLayers).filter(Boolean).length;
    if (multiplier === 0) multiplier = 0.1;
    
    // Add specific spikes based on categories
    let nightSpike = activeLayers['Violent Crimes'] ? 20 : 0;
    let daySpike = activeLayers['Traffic Incidents'] ? 30 : 0;

    return [
      { time: '12AM', val: Math.round(30 * (multiplier/2)) + nightSpike },
      { time: '4AM', val: Math.round(15 * (multiplier/2)) + nightSpike },
      { time: '8AM', val: Math.round(45 * (multiplier/2)) + daySpike },
      { time: '12PM', val: Math.round(65 * (multiplier/2)) + daySpike },
      { time: '4PM', val: Math.round(85 * (multiplier/2)) + daySpike },
      { time: '8PM', val: Math.round(110 * (multiplier/2)) + nightSpike },
    ];
  };

  const getRiskData = () => {
    let high = 0;
    let med = 0;
    let low = 0;

    if (activeLayers['Violent Crimes']) { high += 25; med += 10; low += 5; }
    if (activeLayers['Property Crimes']) { high += 5; med += 25; low += 10; }
    if (activeLayers['Cyber Crimes']) { high += 2; med += 8; low += 15; }
    if (activeLayers['Traffic Incidents']) { high += 2; med += 2; low += 25; }

    const total = high + med + low;
    
    if (total === 0) {
      return [
        { name: 'High Risk', value: 0, color: '#ef4444', pct: '0%' },
        { name: 'Medium Risk', value: 0, color: '#f59e0b', pct: '0%' },
        { name: 'Low Risk', value: 0, color: '#10b981', pct: '0%' },
      ];
    }

    return [
      { name: 'High Risk', value: high, color: '#ef4444', pct: Math.round((high/total)*100) + '%' },
      { name: 'Medium Risk', value: med, color: '#f59e0b', pct: Math.round((med/total)*100) + '%' },
      { name: 'Low Risk', value: low, color: '#10b981', pct: Math.round((low/total)*100) + '%' },
    ];
  };

  const timeData = getTimeData();
  const riskData = getRiskData();

  const topHotspots = [
    { id: 1, name: 'Koramangala', cases: 186, risk: 'High Risk', riskLevel: 'high', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', coords: [12.9279, 77.6271] },
    { id: 2, name: 'Whitefield', cases: 162, risk: 'High Risk', riskLevel: 'high', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', coords: [12.9698, 77.7499] },
    { id: 3, name: 'Yelahanka', cases: 128, risk: 'Medium Risk', riskLevel: 'medium', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', coords: [13.1007, 77.5963] },
    { id: 4, name: 'Rajajinagar', cases: 104, risk: 'Medium Risk', riskLevel: 'medium', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', coords: [12.9982, 77.5530] },
    { id: 5, name: 'Electronic City', cases: 98, risk: 'Medium Risk', riskLevel: 'medium', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', coords: [12.8452, 77.6602] },
  ];

  const mapHotspots = [
    ...topHotspots,
    { id: 6, name: 'Hebbal', cases: 80, riskLevel: 'medium', coords: [13.0354, 77.5988] },
    { id: 7, name: 'Jayanagar', cases: 70, riskLevel: 'medium', coords: [12.9250, 77.5938] },
    { id: 8, name: 'Bengaluru', cases: 250, riskLevel: 'high', coords: [12.9716, 77.5946] },
  ];

  const layerDefinitions = [
    { name: 'Violent Crimes', color: 'bg-rose-500' },
    { name: 'Property Crimes', color: 'bg-amber-500' },
    { name: 'Cyber Crimes', color: 'bg-blue-500' },
    { name: 'Traffic Incidents', color: 'bg-purple-500' },
    { name: 'CCTV Coverage', color: 'bg-emerald-500' },
  ];

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const panToHotspot = (coords) => {
    setMapCenter(coords);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto flex flex-col h-[100dvh]">
      <TopBar title="Hotspot Map" subtitle="Live crime map and hotspot visualization">
        <div className="relative">
          <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
              <div className="p-2 border-b border-[#1e293b]">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Map Filters</h4>
              </div>
              <div className="p-1">
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-slate-300">Show Heatmap Overlay</span>
                </label>
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-slate-300">High Risk Zones Only</span>
                </label>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => exportToCSV(topHotspots, 'hotspots_data.csv')} className="flex items-center space-x-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-3 border border-[#6d28d9]">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Map Data</span>
        </button>
      </TopBar>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pb-6">
        {/* Left Column: Map & KPIs & Bottom Charts */}
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 shrink-0">
            <div className="glass-panel p-4 rounded-xl border-l-2 border-l-rose-500 flex flex-col justify-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">High Risk Zones</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
            <div className="glass-panel p-4 rounded-xl border-l-2 border-l-amber-500 flex flex-col justify-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Medium Risk Zones</p>
              <h3 className="text-2xl font-bold text-white">47</h3>
            </div>
            <div className="glass-panel p-4 rounded-xl border-l-2 border-l-emerald-500 flex flex-col justify-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Low Risk Zones</p>
              <h3 className="text-2xl font-bold text-white">156</h3>
            </div>
            <div className="glass-panel p-4 rounded-xl border-l-2 border-l-blue-500 flex flex-col justify-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Incidents</p>
              <h3 className="text-2xl font-bold text-white">2,843</h3>
            </div>
            
            <div className="glass-panel p-3 rounded-xl flex flex-col justify-center space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase">Last Updated</span>
                <span className="text-xs font-medium text-emerald-500 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> 2 min ago</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#1e293b] pt-2">
                <span className="text-[10px] text-slate-400 uppercase">Focus Area</span>
                <span className="text-xs font-medium text-white flex items-center"><Crosshair className="w-3 h-3 text-blue-400 mr-1"/> Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="glass-panel rounded-xl overflow-hidden relative flex-1 min-h-[300px] md:min-h-0 border border-[#1e293b]">
            <div className="absolute top-4 right-4 flex space-x-2 z-[1000]">
              <div className="bg-[#0b1120] border border-[#1e293b] rounded-lg flex overflow-hidden shadow-lg">
                <button 
                  onClick={() => setMapMode('Heat Map')}
                  className={`px-4 py-2 text-xs font-semibold transition-colors ${mapMode === 'Heat Map' ? 'bg-[#4c1d95] text-white' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'}`}
                >
                  Heat Map
                </button>
                <button 
                  onClick={() => setMapMode('Cluster View')}
                  className={`px-4 py-2 text-xs font-semibold transition-colors ${mapMode === 'Cluster View' ? 'bg-[#4c1d95] text-white' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'}`}
                >
                  Cluster View
                </button>
              </div>
            </div>
            
            <CrimeHeatmap theme="dark" data={mockData.CaseMaster} hotspots={mapHotspots} zoom={11} center={mapCenter} />
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
            <div className="glass-panel p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Incidents by Time <span className="font-normal normal-case">(Today)</span></h3>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                    <Bar dataKey="val" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 text-center md:text-left">Risk Distribution</h3>
                <div className="space-y-3">
                  {riskData.map(risk => (
                    <div key={risk.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-sm mr-2" style={{ backgroundColor: risk.color }}></span>
                        <span className="text-slate-300">{risk.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-white font-medium">{risk.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[120px] h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-bold text-white">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[350px] flex flex-col space-y-6 shrink-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1e293b]">
          
          {/* Top Hotspots */}
          <div className="glass-panel rounded-xl flex flex-col">
            <div className="p-5 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Hotspots</h3>
              <button onClick={() => setActiveModal('all_hotspots')} className="text-[10px] text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="p-3">
              {topHotspots.map(spot => (
                <div 
                  key={spot.id} 
                  onClick={() => panToHotspot(spot.coords)}
                  className="flex items-center justify-between p-3 border-b border-[#1e293b]/50 last:border-0 hover:bg-[#1e293b]/50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5 rounded-full bg-[#1e293b] text-[10px] font-bold text-slate-300 flex items-center justify-center flex-shrink-0">{spot.id}</span>
                    <div>
                      <h4 className="text-xs font-medium text-white">{spot.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{spot.cases} incidents</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border flex-shrink-0 ${spot.color}`}>
                    {spot.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Layers */}
          <div className="glass-panel rounded-xl">
            <div className="p-5 border-b border-[#1e293b]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Map Layers</h3>
            </div>
            <div className="p-5 space-y-4">
              {layerDefinitions.map(layer => {
                const isActive = activeLayers[layer.name];
                return (
                  <div key={layer.name} onClick={() => toggleLayer(layer.name)} className="flex items-center cursor-pointer group">
                    {isActive ? (
                      <CheckSquare className="w-4 h-4 text-blue-500 mr-3 group-hover:text-blue-400 transition-colors" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 mr-3 group-hover:text-slate-400 transition-colors" />
                    )}
                    <span className={`w-2 h-2 rounded-full mr-2 ${layer.color} ${!isActive && 'opacity-30'}`}></span>
                    <span className={`text-xs ${isActive ? 'text-slate-200' : 'text-slate-500'} group-hover:text-slate-300 transition-colors`}>{layer.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="glass-panel rounded-xl">
            <div className="p-5 border-b border-[#1e293b]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended Actions</h3>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-start space-x-3 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed text-[10px]">Deploy additional patrols in <span className="font-semibold text-rose-400">Koramangala 1st Block</span> between 8PM - 12AM due to high risk projection.</p>
              </div>
              <div className="flex items-start space-x-3 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed text-[10px]">Review CCTV coverage in <span className="font-semibold text-amber-400">Indiranagar 100ft</span> area following recent property crimes spike.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {activeModal === 'all_hotspots' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">All Top Hotspots</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            <div className="space-y-4 overflow-x-auto w-full">
              <table className="w-full text-xs text-left min-w-[300px]">
                <thead>
                  <tr className="text-slate-500 border-b border-[#1e293b] uppercase tracking-wider">
                    <th className="pb-2 font-medium">Location</th>
                    <th className="pb-2 font-medium text-right">Cases</th>
                    <th className="pb-2 font-medium text-right">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/50">
                  {[...topHotspots,
                    { id: 6, name: 'Whitefield Main Rd', cases: 29, risk: 'Low', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
                    { id: 7, name: 'Jayanagar 4th Block', cases: 25, risk: 'Low', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
                    { id: 8, name: 'MG Road', cases: 20, risk: 'Low', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
                    { id: 9, name: 'JP Nagar 6th Phase', cases: 18, risk: 'Low', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
                    { id: 10, name: 'Shivajinagar Bus Stand', cases: 15, risk: 'Low', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' }
                  ].map((spot, idx) => (
                    <tr key={idx} className="text-slate-300">
                      <td className="py-2.5 font-medium">{spot.name}</td>
                      <td className="py-2.5 text-right">{spot.cases}</td>
                      <td className={`py-2.5 text-right`}>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border flex-shrink-0 ${spot.color}`}>
                          {spot.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotspotMap;
