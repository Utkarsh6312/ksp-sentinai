import React, { useState, useMemo } from 'react';
import { 
  Users, AlertTriangle, FileText, Filter, Download, Plus, Search, 
  ChevronDown, MoreVertical, X, MapPin, Phone, User
} from 'lucide-react';
import TopBar from './TopBar';
import { exportToCSV } from '../utils/exportUtils';

const Offenders = () => {
  const [selectedOffenderId, setSelectedOffenderId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const kpis = [
    { title: 'Total Offenders', value: '1,256', change: '+12 this week', isUp: true, icon: <Users className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20 text-emerald-500' },
    { title: 'Arrested (This Month)', value: '342', change: '+18%', isUp: true, icon: <div className="flex -space-x-1"><div className="w-4 h-4 rounded-full border-2 border-[#131c2f] bg-blue-400"></div><div className="w-4 h-4 rounded-full border-2 border-[#131c2f] bg-blue-400"></div></div>, color: 'bg-blue-500/10 border-blue-500/20 text-emerald-500' },
    { title: 'Active Cases', value: '278', change: '+9%', isUp: true, icon: <FileText className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border-blue-500/20 text-emerald-500' },
    { title: 'Repeat Offenders', value: '186', change: '+6%', isUp: true, icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: 'bg-amber-500/10 border-amber-500/20 text-rose-500' },
  ];

  const offendersList = [
    { id: 1, sid: 'OFF10234', name: 'Rakesh Kumar', age: 32, crimes: 'Theft, Robbery', lastArrest: '12 May 2025', loc: 'Delhi', risk: 'High', status: 'In Custody', sColor: 'text-emerald-500', phone: '+91 98765 43210', father: 'Mahavir Prasad', aadhaar: 'XXXX-XXXX-1234', areas: ['Laxmi Nagar', 'Shahdara', 'Preet Vihar'], totalCases: 7, prevArrests: 5, arrestedBy: 'PS Laxmi Nagar', remarks: 'Repeat offender. Involved in multiple house breaking cases in East Delhi.' },
    { id: 2, sid: 'OFF09876', name: 'Shahrukh Ali', age: 28, crimes: 'Assault, Arms Act', lastArrest: '10 May 2025', loc: 'North Delhi', risk: 'High', status: 'In Custody', sColor: 'text-emerald-500', phone: '+91 91234 56789', father: 'Rehman Ali', aadhaar: 'XXXX-XXXX-9876', areas: ['Rohini', 'Pitampura'], totalCases: 4, prevArrests: 3, arrestedBy: 'PS Rohini', remarks: 'Known gang member.' },
    { id: 3, sid: 'OFF10543', name: 'Vikram Yadav', age: 35, crimes: 'Extortion, Threat', lastArrest: '08 May 2025', loc: 'Gurugram', risk: 'Medium', status: 'Released', sColor: 'text-blue-500', phone: '+91 87654 32109', father: 'Kishan Yadav', aadhaar: 'XXXX-XXXX-4567', areas: ['DLF Phase 1', 'Sushant Lok'], totalCases: 3, prevArrests: 1, arrestedBy: 'PS Gurugram Sector 29', remarks: 'Active in extortion rackets.' },
    { id: 4, sid: 'OFF09123', name: 'Mohd. Imran', age: 26, crimes: 'Burglary, Theft', lastArrest: '07 May 2025', loc: 'Southeast Delhi', risk: 'Medium', status: 'In Custody', sColor: 'text-emerald-500', phone: '+91 76543 21098', father: 'Abdul Qadir', aadhaar: 'XXXX-XXXX-2345', areas: ['Okhla', 'Jamia Nagar'], totalCases: 5, prevArrests: 4, arrestedBy: 'PS Okhla', remarks: 'Specializes in night burglaries.' },
    { id: 5, sid: 'OFF11009', name: 'Suresh Singh', age: 41, crimes: 'Fraud, Cheating', lastArrest: '05 May 2025', loc: 'Dwarka', risk: 'Low', status: 'Released', sColor: 'text-blue-500', phone: '+91 65432 10987', father: 'Bhagat Singh', aadhaar: 'XXXX-XXXX-3456', areas: ['Dwarka Sector 12', 'Palam'], totalCases: 2, prevArrests: 0, arrestedBy: 'PS Dwarka South', remarks: 'Involved in real estate fraud.' },
    { id: 6, sid: 'OFF09901', name: 'Pawan Sharma', age: 30, crimes: 'Drugs, NDPS Act', lastArrest: '03 May 2025', loc: 'Noida', risk: 'High', status: 'In Custody', sColor: 'text-emerald-500', phone: '+91 54321 09876', father: 'Gopal Sharma', aadhaar: 'XXXX-XXXX-6789', areas: ['Sector 15', 'Sector 18'], totalCases: 6, prevArrests: 3, arrestedBy: 'PS Sector 20', remarks: 'Major supplier in the area.' },
    { id: 7, sid: 'OFF10456', name: 'Ajay Verma', age: 38, crimes: 'Kidnapping, Extortion', lastArrest: '02 May 2025', loc: 'West Delhi', risk: 'High', status: 'In Custody', sColor: 'text-emerald-500', phone: '+91 43210 98765', father: 'Ram Khiladi Verma', aadhaar: 'XXXX-XXXX-7890', areas: ['Janakpuri', 'Vikas Puri'], totalCases: 8, prevArrests: 6, arrestedBy: 'PS Janakpuri', remarks: 'Highly dangerous. Warrants active.' },
    { id: 8, sid: 'OFF10087', name: 'Sahil Khan', age: 27, crimes: 'Theft, Mischief', lastArrest: '01 May 2025', loc: 'Faridabad', risk: 'Low', status: 'Released', sColor: 'text-blue-500', phone: '+91 32109 87654', father: 'Nasir Khan', aadhaar: 'XXXX-XXXX-8901', areas: ['NIT', 'Old Faridabad'], totalCases: 1, prevArrests: 0, arrestedBy: 'PS NIT', remarks: 'Petty theft.' },
  ];

  const filteredOffenders = useMemo(() => {
    return offendersList.filter(off => 
      off.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.crimes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, offendersList]);

  const selectedOffender = useMemo(() => offendersList.find(o => o.id === selectedOffenderId), [selectedOffenderId, offendersList]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredOffenders.length / ITEMS_PER_PAGE) || 1;
  const paginatedOffenders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOffenders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOffenders, currentPage]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-[100dvh] flex flex-col">
      <TopBar title="Recent Offenders" subtitle="List of recently arrested / detected offenders">
        <div className="relative">
          <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
              <div className="p-2 border-b border-[#1e293b]">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Risk Level</h4>
              </div>
              <div className="p-1">
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-rose-400">High Risk</span>
                </label>
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-amber-400">Medium Risk</span>
                </label>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => exportToCSV(filteredOffenders, 'offenders_list.csv')} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium ml-3">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button onClick={() => alert("Opening Add Offender Modal...")} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-3 border border-blue-500">
          <Plus className="w-4 h-4" />
          <span>Add Offender</span>
        </button>
      </TopBar>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl flex items-center justify-between border border-[#1e293b]">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 border ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-white mb-0.5">{kpi.value}</h3>
                <p className={`text-[10px] font-medium ${kpi.color.split(' ').pop()}`}>{kpi.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column (Table) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="glass-panel flex-1 rounded-xl flex flex-col overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-[#1e293b] flex flex-col sm:flex-row justify-between items-center bg-[#131c2f] gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID or crime..." 
                  className="w-full bg-[#0b1120] border border-[#1e293b] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
                <div className="flex items-center justify-between bg-[#0b1120] border border-[#1e293b] rounded-lg px-3 py-2 cursor-pointer w-full sm:w-auto min-w-[140px]">
                  <span className="text-sm text-slate-300">Last Arrested</span>
                  <ChevronDown className="w-4 h-4 text-slate-500 ml-2" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-[#131c2f] text-slate-400 font-medium sticky top-0 z-10 border-b border-[#1e293b]">
                  <tr>
                    <th className="px-5 py-4 w-12">#</th>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Age</th>
                    <th className="px-5 py-4">Crimes</th>
                    <th className="px-5 py-4">Last Arrested</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Risk Score</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {paginatedOffenders.length > 0 ? paginatedOffenders.map((off) => (
                    <tr 
                      key={off.id} 
                      onClick={() => setSelectedOffenderId(off.id)}
                      className={`text-slate-300 hover:bg-[#1e293b]/50 cursor-pointer transition-colors ${selectedOffenderId === off.id ? 'bg-[#1e293b]/30 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                    >
                      <td className="px-5 py-3 font-medium text-slate-500">{off.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#1e293b] bg-slate-800">
                            <img src={`https://i.pravatar.cc/150?u=${off.sid}`} alt={off.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{off.name}</p>
                            <p className="text-[10px] text-slate-500">ID: {off.sid}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">{off.age}</td>
                      <td className="px-5 py-3 text-slate-400">{off.crimes}</td>
                      <td className="px-5 py-3">{off.lastArrest}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center text-slate-400">
                          <MapPin className="w-3 h-3 mr-1" /> {off.loc}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          off.risk === 'High' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                          off.risk === 'Medium' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                          'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                        }`}>{off.risk}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${off.status === 'In Custody' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                          <span className={off.sColor}>{off.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-slate-500 hover:text-white p-1 rounded hover:bg-[#1e293b]"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-slate-500">No offenders found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-[#1e293b] bg-[#131c2f]">
              <div className="flex space-x-1">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-500 hover:text-white disabled:opacity-50">{'<'}</button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b]'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}

                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b] hover:text-white disabled:opacity-50">{'>'}</button>
              </div>
              <p className="text-[10px] text-slate-500">Showing {Math.min(filteredOffenders.length, (currentPage - 1) * ITEMS_PER_PAGE + (filteredOffenders.length > 0 ? 1 : 0))} to {Math.min(filteredOffenders.length, currentPage * ITEMS_PER_PAGE)} of {filteredOffenders.length} results</p>
            </div>
          </div>
        </div>

        {/* Right Column (Details Pane) */}
        {selectedOffender ? (
          <div className="w-full lg:w-[320px] glass-panel rounded-xl flex flex-col transition-all duration-300">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Offender Details</h3>
              <button onClick={() => setSelectedOffenderId(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#1e293b]">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-[#1e293b] bg-slate-800">
                  <img src={`https://i.pravatar.cc/150?u=${selectedOffender.sid}`} alt={selectedOffender.name} className="w-full h-full object-cover" />
                </div>
                <div className="pt-1">
                  <h2 className="text-lg font-bold text-white leading-tight">{selectedOffender.name}</h2>
                  <p className="text-[10px] text-slate-400 mb-2">ID: {selectedOffender.sid}</p>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    selectedOffender.risk === 'High' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                    selectedOffender.risk === 'Medium' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                    'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                  }`}>{selectedOffender.risk} Risk</span>
                  <p className="text-[10px] text-slate-400 mt-2">Age: {selectedOffender.age} | Male</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="text-slate-500 py-1.5 w-24">Father's Name</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.father}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5 align-top">Address</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.loc}, Delhi</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5">Phone</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.phone}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5">Aadhaar No.</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.aadhaar}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-[#1e293b] pt-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Known For</h4>
                  <p className="text-xs text-white font-medium mb-4">{selectedOffender.crimes}</p>
                  
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="text-slate-500 py-1.5 w-28">Total Cases</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.totalCases}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5">Previous Arrests</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.prevArrests}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5">Last Arrested</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.lastArrest}</td>
                      </tr>
                      <tr>
                        <td className="text-slate-500 py-1.5">Arrested By</td>
                        <td className="text-slate-200 py-1.5">{selectedOffender.arrestedBy}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-[#1e293b] pt-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Associated Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffender.areas.map(area => (
                      <span key={area} className="px-3 py-1 bg-[#1e293b] text-slate-300 text-[10px] rounded border border-slate-700">{area}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#1e293b] pt-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Remarks</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedOffender.remarks}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-[#1e293b]">
              <button onClick={() => alert(`Opening full profile for ${selectedOffender.name}...`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <User className="w-4 h-4" />
                <span>View Full Profile</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-[320px] glass-panel rounded-xl flex flex-col justify-center items-center p-8 text-center border-dashed border-2 border-[#1e293b]">
            <User className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-slate-400 font-medium mb-2">No Offender Selected</h3>
            <p className="text-xs text-slate-500">Select an offender from the list to view their detailed profile.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Offenders;
