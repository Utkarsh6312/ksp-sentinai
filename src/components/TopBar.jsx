import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';

const TopBar = ({ title, subtitle, hideDateRange, children, onDateChange }) => {
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('13 May 2026 - 19 May 2026');
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    // Check if the page is currently translated based on the googtrans cookie
    if (document.cookie.includes('googtrans=') && !document.cookie.includes('googtrans=/en/en')) {
      const btn = document.getElementById('translate-text-span');
      if (btn) {
        btn.innerText = 'Show Original';
        btn.setAttribute('data-translated', 'true');
      }
    }
  }, []);

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
                      onClick={() => { 
                        setSelectedDate(opt); 
                        setShowDatePicker(false); 
                        if(onDateChange) onDateChange(opt);
                      }}
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

        {/* Language Toggle */}
        <div className="relative z-50 ml-2">
          <div 
            onClick={(e) => {
              const textSpan = document.getElementById('translate-text-span');
              const isCurrentlyTranslated = textSpan ? textSpan.getAttribute('data-translated') === 'true' : false;
              
              if (!isCurrentlyTranslated) {
                // Translate to Kannada
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                  select.value = 'kn';
                  select.dispatchEvent(new Event('change'));
                }
                if (textSpan) {
                  textSpan.innerText = 'Show Original';
                  textSpan.setAttribute('data-translated', 'true');
                }
              } else {
                // Show Original (Turn off Kannada)
                
                // Method 1: Dropdown empty value
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                  select.value = '';
                  select.dispatchEvent(new Event('change'));
                }
                
                // Method 2: Iframe click
                try {
                  const iframe = document.querySelector('iframe.goog-te-banner-frame');
                  if (iframe) {
                    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const restoreBtn = innerDoc.getElementById(':1.restore') || innerDoc.getElementById(':0.restore');
                    if (restoreBtn) {
                      restoreBtn.click();
                    } else {
                      const buttons = innerDoc.getElementsByTagName('button');
                      for (let b of buttons) {
                        if (b.id.includes('restore') || (b.innerText && b.innerText.toLowerCase().includes('original'))) {
                          b.click();
                          break;
                        }
                      }
                    }
                  }
                } catch (err) {}

                // Method 3: Aggressive cookie wipe
                const hostname = window.location.hostname;
                const parts = hostname.split('.');
                let currentDomain = '';
                const domains = [hostname, `.${hostname}`, ''];
                for (let i = parts.length - 1; i >= 0; i--) {
                  currentDomain = currentDomain === '' ? parts[i] : parts[i] + '.' + currentDomain;
                  domains.push(currentDomain);
                  domains.push(`.${currentDomain}`);
                }
                
                domains.forEach(d => {
                  const domainStr = d ? `domain=${d}; ` : '';
                  const paths = ['/', '/src', '/src/components', window.location.pathname, ''];
                  paths.forEach(p => {
                    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ${domainStr}path=${p};`;
                  });
                });
                
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.includes('goog')) {
                    localStorage.removeItem(key);
                  }
                }
                
                if (textSpan) {
                  textSpan.innerText = 'Translate to Kannada';
                  textSpan.setAttribute('data-translated', 'false');
                }
                
                // Method 4: Reload only if DOM hasn't reverted after 500ms
                setTimeout(() => {
                  const lang = document.documentElement.lang;
                  // If html lang is still kn or something other than en, translation is stuck
                  if (lang && lang.toLowerCase() !== 'en') {
                     window.location.reload();
                  }
                }, 500);
              }
            }}
            className="cursor-pointer bg-[#131c2f] border border-[#1e293b] rounded-lg px-3 py-2 hover:bg-[#1e293b] transition-colors flex items-center h-[38px] group"
          >
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors" translate="no">
              <span className="block" id="translate-text-span" data-translated="false">
                Translate to Kannada
              </span>
            </span>
          </div>
        </div>

        
        <div className="relative z-50">
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`cursor-pointer border rounded-lg p-2.5 ml-2 transition-colors ${
              showNotifications ? 'bg-[#1e293b] border-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#131c2f] border-[#1e293b] hover:bg-[#1e293b]'
            }`}
          >
            <Bell className="w-4 h-4 text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[#131c2f]"></span>
          </div>
          
          {showNotifications && (
            <NotificationsDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
