import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { 
  Bell, AlertTriangle, Info, BellRing, Mail, MessageSquare, 
  Search, ChevronDown, CheckCircle, ShieldAlert, Filter, Check, Shield
} from 'lucide-react';
import TopBar from './TopBar';

const Alerts = () => {
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const initialAlerts = [
    { id: 'AL-9082', type: 'Critical', source: 'Predictive Model', message: 'High probability of property crime spike in Koramangala this weekend based on historical pattern.', time: '10 mins ago', status: 'Unread', color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    { id: 'AL-9081', type: 'High', source: 'Suspicious Activity', message: 'Repeated ATM transactions flagged near MG Road branch.', time: '45 mins ago', status: 'Unread', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { id: 'AL-9080', type: 'Medium', source: 'Traffic System', message: 'Major congestion reported on Outer Ring Road due to an accident.', time: '2 hours ago', status: 'Read', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'AL-9079', type: 'Low', source: 'System Update', message: 'Weekly crime report for District 4 has been successfully generated.', time: '3 hours ago', status: 'Unread', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { id: 'AL-9078', type: 'Critical', source: 'Cyber Cell', message: 'Large scale phishing attack detected targeting senior citizens.', time: '5 hours ago', status: 'Read', color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
    { id: 'AL-9077', type: 'High', source: 'Patrol Unit', message: 'Requesting backup at Indiranagar 100ft road for crowd control.', time: 'Yesterday', status: 'Read', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { id: 'AL-9076', type: 'Medium', source: 'Public Portal', message: 'New anonymous tip received regarding suspected drug peddling.', time: 'Yesterday', status: 'Read', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'AL-9075', type: 'Low', source: 'System Update', message: 'Database backup completed successfully.', time: 'Yesterday', status: 'Read', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  ];

  const [alertsList, setAlertsList] = useState(initialAlerts);

  const unreadCount = alertsList.filter(a => a.status === 'Unread').length;
  const criticalCount = alertsList.filter(a => a.type === 'Critical').length;
  const highCount = alertsList.filter(a => a.type === 'High').length;
  const mediumCount = alertsList.filter(a => a.type === 'Medium').length;
  const lowCount = alertsList.filter(a => a.type === 'Low').length;

  const kpis = [
    { title: 'CRITICAL ALERTS', value: criticalCount.toString(), unread: `${alertsList.filter(a => a.type === 'Critical' && a.status === 'Unread').length} Unread`, icon: <BellRing className="w-5 h-5 text-rose-500" />, color: 'border-t-rose-500', unreadColor: 'text-rose-500' },
    { title: 'HIGH PRIORITY', value: highCount.toString(), unread: `${alertsList.filter(a => a.type === 'High' && a.status === 'Unread').length} Unread`, icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: 'border-t-amber-500', unreadColor: 'text-amber-500' },
    { title: 'MEDIUM PRIORITY', value: mediumCount.toString(), unread: `${alertsList.filter(a => a.type === 'Medium' && a.status === 'Unread').length} Unread`, icon: <Info className="w-5 h-5 text-blue-500" />, color: 'border-t-blue-500', unreadColor: 'text-blue-500' },
    { title: 'LOW PRIORITY', value: lowCount.toString(), unread: `${alertsList.filter(a => a.type === 'Low' && a.status === 'Unread').length} Unread`, icon: <Bell className="w-5 h-5 text-emerald-500" />, color: 'border-t-emerald-500', unreadColor: 'text-emerald-500' },
    { title: 'TOTAL ALERTS', value: alertsList.length.toString(), unread: `${unreadCount} Unread`, icon: <Mail className="w-5 h-5 text-[#a855f7]" />, color: 'border-t-[#a855f7]', unreadColor: 'text-[#a855f7]' },
  ];

  const priorityData = [
    { name: 'Critical', value: criticalCount, color: '#f43f5e', pct: `${Math.round((criticalCount/alertsList.length)*100)}%` },
    { name: 'High', value: highCount, color: '#f59e0b', pct: `${Math.round((highCount/alertsList.length)*100)}%` },
    { name: 'Medium', value: mediumCount, color: '#3b82f6', pct: `${Math.round((mediumCount/alertsList.length)*100)}%` },
    { name: 'Low', value: lowCount, color: '#10b981', pct: `${Math.round((lowCount/alertsList.length)*100)}%` },
  ];

  const markAsRead = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Read' } : a));
  };

  const markAllAsRead = () => {
    setAlertsList(prev => prev.map(a => ({ ...a, status: 'Read' })));
  };

  const filteredAlerts = useMemo(() => {
    let result = alertsList;
    if (activeTab === 'Unread') result = result.filter(a => a.status === 'Unread');
    if (activeTab === 'Critical') result = result.filter(a => a.type === 'Critical' || a.type === 'High');

    if (searchQuery) {
      result = result.filter(a => a.message.toLowerCase().includes(searchQuery.toLowerCase()) || a.source.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [alertsList, activeTab, searchQuery]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <TopBar title="Alerts & Notifications" subtitle="Real-time alerts, threats, and system updates">
        <button onClick={() => alert("Opening Notification Settings...")} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
          <Bell className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </TopBar>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`glass-panel p-5 rounded-xl border-t-2 border-[#1e293b] ${kpi.color}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#131c2f] p-2 rounded-lg border border-[#1e293b]">
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold ${kpi.unreadColor}`}>{kpi.unread}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
            <p className="text-[10px] text-slate-400">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column (Alerts List) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="glass-panel flex-1 rounded-xl flex flex-col overflow-hidden">
            
            {/* Tabs and Toolbar */}
            <div className="border-b border-[#1e293b] bg-[#131c2f]">
              <div className="flex px-4 pt-4">
                {['All Alerts', 'Unread', 'Critical'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'text-[#c084fc] border-[#a855f7]' 
                        : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {tab}
                    {tab === 'Unread' && unreadCount > 0 && (
                      <span className="ml-2 bg-[#a855f7] text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0b1120]/50 border-t border-[#1e293b]">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search alerts..." 
                    className="w-full bg-[#131c2f] border border-[#1e293b] text-sm text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#a855f7] transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button onClick={() => alert("Filtering...")} className="flex items-center space-x-2 bg-[#131c2f] border border-[#1e293b] text-slate-300 px-3 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-xs font-medium">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </button>
                  <button onClick={markAllAsRead} className="flex items-center space-x-2 bg-[#131c2f] border border-[#1e293b] text-slate-300 px-3 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-xs font-medium whitespace-nowrap">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
              {filteredAlerts.length > 0 ? (
                <div className="divide-y divide-[#1e293b]">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 flex items-start group hover:bg-[#1e293b]/50 transition-colors ${alert.status === 'Unread' ? 'bg-[#131c2f]/30' : ''}`}>
                      <div className={`mt-1 p-2 rounded-lg ${alert.bgColor} ${alert.color} mr-4 flex-shrink-0`}>
                        {alert.type === 'Critical' ? <BellRing className="w-5 h-5" /> : 
                         alert.type === 'High' ? <AlertTriangle className="w-5 h-5" /> : 
                         alert.type === 'Medium' ? <Info className="w-5 h-5" /> : 
                         <Bell className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              alert.type === 'Critical' ? 'border-rose-500/30 text-rose-500' :
                              alert.type === 'High' ? 'border-amber-500/30 text-amber-500' :
                              alert.type === 'Medium' ? 'border-blue-500/30 text-blue-500' :
                              'border-emerald-500/30 text-emerald-500'
                            }`}>{alert.type} Priority</span>
                            <span className="text-[11px] font-medium text-slate-400 flex items-center">
                              <span className="w-1 h-1 rounded-full bg-slate-600 mr-2"></span>
                              {alert.source}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">{alert.time}</span>
                        </div>
                        <p className={`text-sm ${alert.status === 'Unread' ? 'text-white font-medium' : 'text-slate-300'} mb-2`}>{alert.message}</p>
                        <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[10px] font-medium text-[#a855f7] hover:text-[#c084fc]">View Details</button>
                          {alert.status === 'Unread' && (
                            <button onClick={() => markAsRead(alert.id)} className="text-[10px] font-medium text-slate-400 hover:text-white flex items-center">
                              <Check className="w-3 h-3 mr-1" /> Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                      {alert.status === 'Unread' && (
                        <div className="w-2 h-2 rounded-full bg-[#a855f7] mt-3 flex-shrink-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                  <CheckCircle className="w-12 h-12 mb-3 text-slate-600" />
                  <p>No alerts found matching your criteria.</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 border-t border-[#1e293b] bg-[#131c2f]">
              <div className="flex space-x-1">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-500 hover:text-white">{'<'}</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4c1d95] text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b]">2</button>
                <span className="w-8 h-8 flex items-center justify-center text-slate-500">...</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b] hover:text-white">{'>'}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[350px] flex flex-col space-y-6">
          
          {/* Donut Chart */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Alerts by Priority</h3>
            <div className="flex items-center justify-between">
              <div className="w-[120px] h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-white">{alertsList.length}</span>
                  <span className="text-[9px] text-slate-400 uppercase">TOTAL</span>
                </div>
              </div>
              <div className="space-y-2 text-[10px] flex-1 ml-6">
                {priorityData.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-sm mr-2" style={{ backgroundColor: p.color }}></span>
                      <span className="text-slate-300">{p.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-slate-500 w-6 text-right">{p.value}</span>
                      <span className="text-white font-medium w-10 text-right">({p.pct})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="glass-panel p-5 rounded-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Notification Channels</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Bell className="w-4 h-4 text-[#a855f7] mr-3" />
                  In-App Notifications
                </div>
                <span className="text-white font-medium">78</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-500 mr-3" />
                  Email Alerts
                </div>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <MessageSquare className="w-4 h-4 text-amber-500 mr-3" />
                  SMS Alerts
                </div>
                <span className="text-white font-medium">16</span>
              </div>
            </div>
          </div>

          {/* Recent Critical */}
          <div className="glass-panel rounded-xl flex-1 max-h-[300px] flex flex-col">
            <div className="p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Critical Alerts</h3>
              <button onClick={() => setActiveModal('all_critical_alerts')} className="text-[10px] text-[#a855f7] hover:text-[#c084fc]">View All</button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <div className="flex items-start">
                <BellRing className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300">High risk alert in Koramangala area</p>
                </div>
                <span className="text-[9px] text-slate-500 ml-2">10:21 AM</span>
              </div>
              <div className="flex items-start">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300">Unusual pattern detected in cyber fraud</p>
                </div>
                <span className="text-[9px] text-slate-500 ml-2">07:22 AM</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300">Fraudulent transaction detected</p>
                </div>
                <span className="text-[9px] text-slate-500 ml-2">Yesterday, 11:45 PM</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300">Suspicious login attempt detected</p>
                </div>
                <span className="text-[9px] text-slate-500 ml-2">Yesterday, 09:32 PM</span>
              </div>
              <div className="flex items-start">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-300">Data breach attempt blocked</p>
                </div>
                <span className="text-[9px] text-slate-500 ml-2">Yesterday, 06:15 PM</span>
              </div>
            </div>
          </div>
          
          {/* Promo panel */}
          <div className="bg-[#4c1d95]/10 border border-[#4c1d95]/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-[#a855f7] mr-3" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Stay informed, stay ahead.</h4>
                <p className="text-[9px] text-[#c084fc] mt-0.5 max-w-[140px]">Enable push notifications for instant alerts.</p>
              </div>
            </div>
            <button onClick={() => alert("Enabling push notifications...")} className="bg-[#4c1d95] hover:bg-[#5b21b6] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Enable Now
            </button>
          </div>

        </div>
      </div>

      {activeModal === 'all_critical_alerts' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">All Recent Critical Alerts</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { msg: 'High risk alert in Koramangala area', time: '10:21 AM', type: 'high' },
                { msg: 'Unusual pattern detected in cyber fraud', time: '07:22 AM', type: 'high' },
                { msg: 'Fraudulent transaction detected', time: 'Yesterday, 11:45 PM', type: 'high' },
                { msg: 'Suspicious login attempt detected', time: 'Yesterday, 09:32 PM', type: 'high' },
                { msg: 'Data breach attempt blocked', time: 'Yesterday, 06:15 PM', type: 'high' }
              ].map((alert, idx) => (
                <div key={idx} className="flex items-start">
                  {alert.msg.includes('breach') || alert.msg.includes('transaction') || alert.msg.includes('login') ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : alert.msg.includes('fraud') ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <BellRing className="w-3.5 h-3.5 text-rose-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-300">{alert.msg}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 ml-2">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
