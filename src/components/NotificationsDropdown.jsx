import React, { useState, useMemo } from 'react';
import { 
  Bell, AlertTriangle, Info, BellRing, 
  Search, CheckCircle, Filter, Check
} from 'lucide-react';

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

const NotificationsDropdown = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsList, setAlertsList] = useState(initialAlerts);
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = alertsList.filter(a => a.status === 'Unread').length;

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

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE));
  
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="absolute top-full right-0 mt-2 w-[450px] bg-[#0b1120] border border-[#1e293b] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[80vh]">
      {/* Tabs and Toolbar */}
      <div className="border-b border-[#1e293b] bg-[#131c2f] flex-shrink-0">
        <div className="flex px-4 pt-4">
          {['All Alerts', 'Unread', 'Critical'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
        <div className="p-3 flex justify-between items-center gap-3 bg-[#0b1120]/50 border-t border-[#1e293b]">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full bg-[#131c2f] border border-[#1e293b] text-xs text-slate-200 rounded-md pl-8 pr-2 py-1.5 focus:outline-none focus:border-[#a855f7] transition-colors placeholder:text-slate-600"
            />
          </div>
          <button onClick={markAllAsRead} className="flex items-center space-x-1.5 bg-[#131c2f] border border-[#1e293b] text-slate-300 px-2 py-1.5 rounded-md hover:bg-[#1e293b] transition-colors text-xs font-medium whitespace-nowrap">
            <CheckCircle className="w-3 h-3" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b] flex-1">
        {paginatedAlerts.length > 0 ? (
          <div className="divide-y divide-[#1e293b]">
            {paginatedAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 flex items-start group hover:bg-[#1e293b]/50 transition-colors ${alert.status === 'Unread' ? 'bg-[#131c2f]/30' : ''}`}>
                <div className={`mt-1 p-2 rounded-lg ${alert.bgColor} ${alert.color} mr-3 flex-shrink-0`}>
                  {alert.type === 'Critical' ? <BellRing className="w-4 h-4" /> : 
                   alert.type === 'High' ? <AlertTriangle className="w-4 h-4" /> : 
                   alert.type === 'Medium' ? <Info className="w-4 h-4" /> : 
                   <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        alert.type === 'Critical' ? 'border-rose-500/30 text-rose-500' :
                        alert.type === 'High' ? 'border-amber-500/30 text-amber-500' :
                        alert.type === 'Medium' ? 'border-blue-500/30 text-blue-500' :
                        'border-emerald-500/30 text-emerald-500'
                      }`}>{alert.type} Priority</span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center">
                        <span className="w-1 h-1 rounded-full bg-slate-600 mr-1.5"></span>
                        {alert.source}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{alert.time}</span>
                  </div>
                  <p className={`text-xs ${alert.status === 'Unread' ? 'text-white font-medium' : 'text-slate-300'} mb-2`}>{alert.message}</p>
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[9px] font-medium text-[#a855f7] hover:text-[#c084fc]">View Details</button>
                    {alert.status === 'Unread' && (
                      <button onClick={() => markAsRead(alert.id)} className="text-[9px] font-medium text-slate-400 hover:text-white flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
                {alert.status === 'Unread' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] mt-3 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500">
            <CheckCircle className="w-8 h-8 mb-2 text-slate-600" />
            <p className="text-xs">No alerts found.</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between p-3 border-t border-[#1e293b] bg-[#131c2f] flex-shrink-0">
        <div className="text-[10px] text-slate-400">
          Showing {filteredAlerts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAlerts.length)} of {filteredAlerts.length}
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1}
            className="w-6 h-6 flex items-center justify-center rounded bg-[#0b1120] border border-[#1e293b] text-slate-500 hover:text-white disabled:opacity-50 disabled:hover:text-slate-500 cursor-pointer disabled:cursor-not-allowed text-xs">{'<'}</button>
          
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage === totalPages}
            className="w-6 h-6 flex items-center justify-center rounded bg-[#0b1120] border border-[#1e293b] text-slate-400 hover:bg-[#1e293b] hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed text-xs">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
