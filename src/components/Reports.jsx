import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  FileText, CheckCircle, Search, ChevronDown, Download, Filter, Eye,
  AlertTriangle, ShieldAlert, Plus, UserPlus, FileOutput, UploadCloud, MapPin, FileBarChart
} from 'lucide-react';
import TopBar from './TopBar';
import { exportToCSV } from '../utils/exportUtils';
import { useReports } from '../context/ReportsContext';
import { useAuth } from '../context/AuthContext';
import Papa from 'papaparse';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('My Reports');
  const [activeModal, setActiveModal] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const { reports: reportsData, setReports, addReport } = useReports();
  const { currentUser } = useAuth();

  const kpis = [
    { title: 'Total Reports', value: '2,843', change: '+124 this week', isUp: true, icon: <FileText className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/10 border-purple-500/20 text-emerald-500' },
    { title: 'Resolved', value: '1,932', change: '+8%', isUp: true, icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
    { title: 'Pending Approval', value: '412', change: '-3%', isUp: false, icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: 'bg-amber-500/10 border-amber-500/20 text-rose-500' },
    { title: 'Urgent Cases', value: '56', change: '+2', isUp: true, icon: <ShieldAlert className="w-5 h-5 text-rose-500" />, color: 'bg-rose-500/10 border-rose-500/20 text-emerald-500' },
  ];

  const trendData = [
    { name: 'Mon', value: 120, baseline: 100 },
    { name: 'Tue', value: 145, baseline: 105 },
    { name: 'Wed', value: 130, baseline: 110 },
    { name: 'Thu', value: 175, baseline: 115 },
    { name: 'Fri', value: 210, baseline: 120 },
    { name: 'Sat', value: 250, baseline: 125 },
    { name: 'Sun', value: 190, baseline: 120 },
  ];

  const statusData = [
    { name: 'Resolved', value: 65, color: '#10b981', pct: '65%' },
    { name: 'In Progress', value: 20, color: '#3b82f6', pct: '20%' },
    { name: 'Pending', value: 10, color: '#f59e0b', pct: '10%' },
    { name: 'Closed', value: 5, color: '#64748b', pct: '5%' },
  ];

  const categoryData = [
    { name: 'Theft / Burglary', value: 843, pct: '30%', color: '#3b82f6', width: '30%' },
    { name: 'Assault / Violence', value: 612, pct: '21%', color: '#f43f5e', width: '21%' },
    { name: 'Cyber Crime', value: 489, pct: '17%', color: '#a855f7', width: '17%' },
    { name: 'Fraud / Scam', value: 412, pct: '14%', color: '#f59e0b', width: '14%' },
    { name: 'Traffic / Accident', value: 320, pct: '11%', color: '#10b981', width: '11%' },
    { name: 'Others', value: 167, pct: '7%', color: '#64748b', width: '7%' },
  ];

  const sourceData = [
    { name: 'Public Portal', value: 45, color: '#3b82f6', pct: '45%' },
    { name: 'Mobile App', value: 30, color: '#a855f7', pct: '30%' },
    { name: 'Helpline', value: 15, color: '#f59e0b', pct: '15%' },
    { name: 'Walk-in', value: 10, color: '#10b981', pct: '10%' },
  ];

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (results) => {
          if (results.data && results.data.length > 0) {
            let successCount = 0;
            for (let row of results.data) {
              const mappedData = {
                reportId: row.reportId || row.id || 'N/A',
                title: row.title || 'Untitled',
                category: row.category || 'Uncategorized',
                priority: row.reportPriority || row.priority || 'Low',
                status: row.status || 'Pending Review',
                reporter: row.reportedBy || row.reporter || 'Unknown',
                assigned: row.assignedTo || row.assigned || 'Unassigned',
                reportDate: row.reportDate || row.date || new Date().toISOString()
              };
              await addReport(mappedData);
              successCount++;
            }
            alert(`Successfully parsed and uploaded ${successCount} reports to the database!`);
          } else {
            alert('The uploaded file appears to be empty or improperly formatted.');
          }
        },
        error: (err) => {
          console.error("CSV Parse Error:", err);
          alert('Error parsing the file.');
        }
      });
      // Reset input value so same file can be uploaded again if needed
      e.target.value = null;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedReports = useMemo(() => {
    let result = reportsData.filter(r => 
      (statusFilter === 'All Status' || r.status === statusFilter || (statusFilter === 'Pending' && r.status?.includes('Pending'))) &&
      ((r.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.reporter || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [reportsData, searchQuery, sortField, sortDirection, statusFilter]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredAndSortedReports.length / ITEMS_PER_PAGE) || 1;
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedReports, currentPage]);

  const recentReports = [
    { type: 'high', text: 'New cyber fraud report assigned to your division.', time: '10m ago' },
    { type: 'medium', text: 'Vehicle theft case #893 status updated to Pending.', time: '1h ago' },
    { type: 'critical', text: 'Critical: Domestic violence complaint needs immediate review.', time: '3h ago' },
    { type: 'info', text: 'Weekly summary report generated successfully.', time: '5h ago' },
    { type: 'low', text: 'Case #887 closed by Sub Insp. Sharma.', time: '1d ago' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <TopBar title="Reports Module" subtitle="Generate, view, and analyze incident reports">
        <div className="relative">
          <button onClick={() => setShowFilterMenu(!showFilterMenu)} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-3 md:px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
              <div className="p-2 border-b border-[#1e293b]">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Report Status</h4>
              </div>
              <div className="p-1">
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-emerald-400">Approved</span>
                </label>
                <label className="flex items-center space-x-2 p-2 hover:bg-[#1e293b] rounded cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-800" defaultChecked />
                  <span className="text-xs text-amber-400">Pending Review</span>
                </label>
              </div>
            </div>
          )}
        </div>
        <button onClick={() => exportToCSV(filteredAndSortedReports, 'reports_data.csv')} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-3 md:px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium ml-2 md:ml-3">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
            <div className="relative overflow-hidden ml-2 md:ml-3">
              <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-emerald-500 h-full w-full">
                <UploadCloud className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleExcelUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
            <button onClick={() => setShowCreateReportModal(true)} className="flex items-center space-x-2 bg-[#a855f7] hover:bg-[#9333ea] text-white px-3 md:px-4 py-2 rounded-lg transition-colors text-sm font-medium ml-2 md:ml-3 border border-[#9333ea]">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
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

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
          
          {/* Main Table */}
          <div className="glass-panel flex-1 rounded-xl flex flex-col overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center bg-[#131c2f]">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search reports by ID, title, category..." 
                  className="w-full bg-[#0b1120] border border-[#1e293b] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#a855f7] transition-colors placeholder:text-slate-600"
                />
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <div onClick={() => setShowStatusDropdown(!showStatusDropdown)} className="flex items-center bg-[#0b1120] border border-[#1e293b] rounded-lg px-3 py-1.5 cursor-pointer">
                    <span className="text-xs text-slate-300">{statusFilter}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 ml-2" />
                  </div>
                  {showStatusDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden">
                      {['All Status', 'Resolved', 'In Progress', 'Pending', 'Closed'].map(status => (
                        <div key={status} onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); setCurrentPage(1); }} className="px-4 py-2 text-xs text-slate-300 hover:bg-[#1e293b] cursor-pointer">
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div onClick={() => setShowDateDropdown(!showDateDropdown)} className="flex items-center bg-[#0b1120] border border-[#1e293b] rounded-lg px-3 py-1.5 cursor-pointer">
                    <span className="text-xs text-slate-300">{dateFilter}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 ml-2" />
                  </div>
                  {showDateDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden">
                      {['All Time', 'This Month', 'Last Month', 'This Year'].map(date => (
                        <div key={date} onClick={() => { setDateFilter(date); setShowDateDropdown(false); setCurrentPage(1); }} className="px-4 py-2 text-xs text-slate-300 hover:bg-[#1e293b] cursor-pointer">
                          {date}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
              <table className="w-full text-xs text-left whitespace-nowrap min-w-[700px]">
                <thead className="bg-[#131c2f] text-slate-400 font-medium sticky top-0 z-10 border-b border-[#1e293b]">
                  <tr>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('id')}>Report ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('category')}>Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('date')}>Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priority')}>Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {paginatedReports.map((report) => (
                    <tr key={report.id} className="text-slate-300 hover:bg-[#1e293b]/50 transition-colors group">
                      <td className="px-5 py-3 font-medium text-[#a855f7]">{report.id}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-white">{report.title}</p>
                        <p className="text-[10px] text-slate-500">By: {report.reporter}</p>
                      </td>
                      <td className="px-5 py-3">{report.category}</td>
                      <td className="px-5 py-3">{new Date(report.date).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          report.priority === 'Critical' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                          report.priority === 'High' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                          report.priority === 'Medium' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' :
                          'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                        }`}>{report.priority}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            report.status === 'Resolved' ? 'bg-emerald-500' :
                            report.status === 'In Progress' ? 'bg-blue-500' :
                            report.status?.includes('Pending') ? 'bg-amber-500' :
                            report.status === 'Closed' ? 'bg-slate-500' :
                            'bg-rose-500'
                          }`}></span>
                          <span>{report.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => { setSelectedReport(report); setActiveModal('view_report'); }} className="bg-[#1e293b] p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-[#1e293b] bg-[#131c2f]">
              <div className="flex space-x-1">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-500 hover:text-white">{'<'}</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs ${currentPage === i + 1 ? 'bg-[#a855f7] text-white' : 'bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b]'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b] hover:text-white">{'>'}</button>
              </div>
              <p className="text-[10px] text-slate-500">Showing {Math.min(filteredAndSortedReports.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredAndSortedReports.length, currentPage * ITEMS_PER_PAGE)} of {filteredAndSortedReports.length} results</p>
            </div>
          </div>

          {/* Bottom Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] md:h-64 mt-6">
            <div className="glass-panel rounded-xl p-5 flex flex-col">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Report Generation Trend</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0b1120', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                    <Line type="monotone" dataKey="baseline" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report Sources</h3>
                <span className="text-[10px] text-slate-500 bg-[#0b1120] px-2 py-1 rounded border border-[#1e293b]">All Time <ChevronDown className="w-3 h-3 inline ml-1"/></span>
              </div>
              <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-[120px] h-[120px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={4}>
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 gap-3 text-[10px]">
                  {sourceData.map(src => (
                    <div key={src.name} className="flex items-center text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: src.color }}></span>
                      <span className="truncate">{src.name}</span>
                      <span className="ml-auto text-slate-500">({src.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-center">
                <button className="text-[10px] text-[#a855f7] hover:text-white transition-colors">View Source Details →</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[350px] flex flex-col space-y-6">
          
          {/* Reports by Status */}
          <div className="glass-panel rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reports by Status</h3>
              <button className="text-[10px] text-[#a855f7] hover:text-[#c084fc]">View Details</button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-[120px] h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {statusData.map((entry, index) => (
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
              <div className="space-y-2 text-[10px] flex-1 w-full">
                {statusData.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: p.color }}></span>
                      <span className="text-slate-300">{p.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-white font-medium">{p.value}</span>
                      <span className="text-slate-500 w-8 text-right">({p.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports by Category */}
          <div className="glass-panel rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reports by Category</h3>
              <span className="text-[10px] text-slate-500 bg-[#0b1120] px-2 py-1 rounded border border-[#1e293b]">This Month <ChevronDown className="w-3 h-3 inline ml-1"/></span>
            </div>
            <div className="space-y-4">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center text-[10px]">
                  <div className="w-5 h-5 rounded flex items-center justify-center mr-3" style={{ backgroundColor: `${cat.color}20` }}>
                    <ShieldAlert className="w-3 h-3" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span>{cat.name}</span>
                      <span><span className="text-white font-medium">{cat.value}</span> <span className="text-slate-500">({cat.pct})</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: cat.width, backgroundColor: cat.color }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="glass-panel rounded-xl flex-1 flex flex-col">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Reports</h3>
              <button onClick={() => setActiveModal('all_reports')} className="text-[10px] text-[#a855f7] hover:text-[#c084fc]">View All</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {recentReports.map((alert, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`mt-0.5 p-1 rounded-full mr-3 flex-shrink-0 ${
                    alert.type === 'high' ? 'bg-rose-500/20 text-rose-500' :
                    alert.type === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                    alert.type === 'low' ? 'bg-[#a855f7]/20 text-[#a855f7]' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-300">{alert.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 ml-2 mt-0.5 whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="flex justify-between">
                  <div onClick={() => setShowCreateReportModal(true)} className="flex flex-col items-center cursor-pointer group">
                    <div className="bg-blue-500/10 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 text-center max-w-[50px] leading-tight group-hover:text-slate-200">Create Report</span>
                  </div>
                  <div onClick={() => alert("Assigning Report")} className="flex flex-col items-center cursor-pointer group">
                    <div className="bg-emerald-500/10 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                      <UserPlus className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 text-center max-w-[50px] leading-tight group-hover:text-slate-200">Assign Report</span>
                  </div>
              <div onClick={() => alert("Generating Report")} className="flex flex-col items-center cursor-pointer group">
                <div className="bg-amber-500/10 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <FileOutput className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[9px] text-slate-400 text-center max-w-[50px] leading-tight group-hover:text-slate-200">Generate Report</span>
              </div>
              <div onClick={() => exportToCSV(filteredAndSortedReports, 'reports_data.csv')} className="flex flex-col items-center cursor-pointer group">
                <div className="bg-[#a855f7]/10 p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5 text-[#a855f7]" />
                </div>
                <span className="text-[9px] text-slate-400 text-center max-w-[50px] leading-tight group-hover:text-slate-200">Export Data</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {activeModal === 'all_reports' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">All Recent Reports</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {[...recentReports,
                { title: 'Beat Patrol Log', time: '2 days ago', type: 'doc' },
                { title: 'Traffic Violation Summary', time: '3 days ago', type: 'excel' },
                { title: 'Interrogation Transcripts', time: '3 days ago', type: 'pdf' },
                { title: 'Asset Requisition', time: '4 days ago', type: 'doc' }
              ].map((report, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div className="flex items-center">
                    {report.type === 'pdf' && <FileText className="w-4 h-4 text-rose-500 mr-3" />}
                    {report.type === 'excel' && <FileBarChart className="w-4 h-4 text-emerald-500 mr-3" />}
                    {report.type === 'doc' && <FileText className="w-4 h-4 text-blue-500 mr-3" />}
                    {['high', 'critical'].includes(report.type) && <AlertTriangle className="w-4 h-4 text-rose-500 mr-3" />}
                    {['medium'].includes(report.type) && <AlertTriangle className="w-4 h-4 text-amber-500 mr-3" />}
                    {['info', 'low'].includes(report.type) && <AlertTriangle className="w-4 h-4 text-blue-500 mr-3" />}
                    <div>
                      <p className="text-[10px] text-slate-300">{report.title || report.text}</p>
                      <p className="text-[9px] text-slate-500">{report.time}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {activeModal === 'view_report' && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-[#0b1120] border border-[#1e293b] rounded-xl w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Report Details</h3>
                <p className="text-xs text-slate-400">{selectedReport.id}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Title</p>
                  <p className="text-sm font-medium text-white">{selectedReport.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm text-slate-300">{selectedReport.category}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedReport.status === 'Resolved' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' :
                    selectedReport.status === 'In Progress' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' :
                    selectedReport.status?.includes('Pending') ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                    'text-rose-500 border-rose-500/30 bg-rose-500/10'
                  }`}>{selectedReport.status}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    selectedReport.priority === 'Critical' ? 'text-rose-500 border-rose-500/30 bg-rose-500/10' :
                    selectedReport.priority === 'High' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                    selectedReport.priority === 'Medium' ? 'text-blue-500 border-blue-500/30 bg-blue-500/10' :
                    'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                  }`}>{selectedReport.priority}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Reporter</p>
                  <p className="text-sm text-slate-300">{selectedReport.reporter}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
                  <p className="text-sm text-slate-300">{selectedReport.assigned}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm text-slate-300">{new Date(selectedReport.date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      {showCreateReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateReportModal(false)}></div>
          <div className="relative bg-[#0b1120] border border-[#1e293b] rounded-xl w-full max-w-lg shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Create New Report</h3>
                <p className="text-xs text-slate-400">Fill in the details below to register a new report.</p>
              </div>
              <button onClick={() => setShowCreateReportModal(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Report Title</label>
                <input type="text" placeholder="e.g. Traffic Incident at MG Road" className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7] transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Report Type</label>
                  <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7] transition-colors appearance-none">
                    <option>Incident</option>
                    <option>Investigation</option>
                    <option>Intelligence</option>
                    <option>Summary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Priority</label>
                  <select className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7] transition-colors appearance-none">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search location..." className="w-full bg-[#0b1120] border border-slate-700 rounded-lg pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7] transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Details / Description</label>
                <textarea rows="4" placeholder="Provide a detailed description..." className="w-full bg-[#0b1120] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#a855f7] transition-colors resize-none"></textarea>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#1e293b] flex justify-end space-x-3">
              <button onClick={() => setShowCreateReportModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                alert("Report successfully registered!");
                setShowCreateReportModal(false);
              }} className="px-6 py-2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-lg text-sm font-medium transition-colors shadow-lg">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
