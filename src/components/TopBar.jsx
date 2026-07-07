import React, { useState } from 'react';
import { Bell, Calendar, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title, subtitle, hideDateRange, children }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('13 May 2026 - 19 May 2026');

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-2 pb-4 border-b border-[#1e293b]">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
        {/* Default Date/Time Selectors shown in all screenshots */}
        {!hideDateRange && (
          <div className="relative z-50">
            <div 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="hidden lg:flex items-center bg-[#131c2f] border border-[#1e293b] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#1e293b] transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-300">{selectedDate}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-2" />
            </div>
            
            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl overflow-hidden">
                <div className="p-1">
                  {['Today', 'Yesterday', 'Last 7 Days', '13 May 2026 - 19 May 2026', 'This Month', 'This Year'].map((opt) => (
                    <div 
                      key={opt}
                      onClick={() => { setSelectedDate(opt); setShowDatePicker(false); }}
                      className={`px-4 py-2 text-sm cursor-pointer rounded-md ${selectedDate === opt ? 'bg-[#a855f7]/20 text-[#a855f7]' : 'text-slate-300 hover:bg-[#1e293b]'}`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {children}
        
        <div 
          onClick={() => navigate('/alerts')}
          className="relative cursor-pointer bg-[#131c2f] border border-[#1e293b] rounded-lg p-2.5 ml-2 hover:bg-[#1e293b] transition-colors"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#131c2f]"></span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
