import React, { useState, useRef, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { 
  MessageSquare, History, Mic, Send, ChevronDown, Download, FileText,
  User, Shield, Search, Zap, Loader2, Volume2
} from 'lucide-react';
import TopBar from './TopBar';
import { exportToCSV } from '../utils/exportUtils';
import { generateZiaResponse } from '../services/zohoCatalystService';

const Chatbot = () => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      sender: 'user',
      text: 'Show me all heinous crimes in Bengaluru city in last 6 months',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'zia',
      text: 'Here are the heinous crimes in Bengaluru City from 20 Nov 2025 to 19 May 2026.',
      time: '10:30 AM',
      type: 'complex_card',
      data: {
        kpis: { totalCases: '128', chargesheetsFiled: '52', arrestsMade: '73', convictionRate: '41%' },
        trendData: [
          { name: 'Dec 2025', value: 20 },
          { name: 'Jan 2026', value: 31 },
          { name: 'Feb 2026', value: 18 },
          { name: 'Mar 2026', value: 36 },
          { name: 'Apr 2026', value: 23 },
          { name: 'May 2026', value: 33 }
        ],
        topCrimes: [
          { name: 'Murder', count: 45, pct: '35.2%', width: '100%' },
          { name: 'Rape', count: 32, pct: '25.0%', width: '70%' },
          { name: 'Kidnapping', count: 18, pct: '14.1%', width: '40%' },
          { name: 'Robbery', count: 17, pct: '13.3%', width: '38%' },
          { name: 'Others', count: 16, pct: '12.4%', width: '35%' }
        ],
        recentCases: [
          { id: '101/2026', type: 'Murder', date: '18 May 2026', area: 'Whitefield PS', status: 'Under Investigation', sColor: 'text-blue-400 border-blue-400/30' },
          { id: '98/2026', type: 'Rape', date: '17 May 2026', area: 'Koramangala PS', status: 'Chargesheet Filed', sColor: 'text-emerald-400 border-emerald-400/30' },
          { id: '95/2026', type: 'Kidnapping', date: '16 May 2026', area: 'Hebbal PS', status: 'Under Investigation', sColor: 'text-blue-400 border-blue-400/30' }
        ]
      }
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakMessage = (text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      if (language === 'Kannada') {
        // Use client=gtx to bypass CORS and token restrictions
        const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=kn&q=${encodeURIComponent(text)}`;
        const audio = new Audio(url);
        audio.play().catch(e => {
          console.error("Audio playback failed:", e);
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'kn-IN';
            window.speechSynthesis.speak(utterance);
          }
        });
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const ziaResponseData = await generateZiaResponse(inputValue, language);
      
      const ziaMessage = {
        id: Date.now() + 1,
        sender: 'zia',
        text: ziaResponseData.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: ziaResponseData.type,
        data: ziaResponseData.data
      };

      setMessages(prev => [...prev, ziaMessage]);
    } catch (error) {
      console.error("Failed to generate response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestedClick = (text) => {
    setInputValue(text);
  };

  const handleVoiceClick = () => {
    if (isListening) {
      setIsListening(false);
      setInputValue("");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Kannada' ? 'kn-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setInputValue("Listening...");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error(event.error);
      setInputValue("");
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto h-[100dvh] flex flex-col">
      <TopBar title="AI Chatbot (Track 1)" subtitle="Your intelligent co-pilot for crime data queries">
        <div className="relative mr-2">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center space-x-2 bg-transparent border border-[#1e293b] text-slate-300 px-4 py-2 rounded-lg hover:bg-[#1e293b] transition-colors text-sm font-medium">
            <span>{language}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-[#0b1120] border border-[#1e293b] rounded-lg shadow-xl z-50 overflow-hidden">
              <button onClick={() => { setLanguage('English'); setShowLangMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b]">English</button>
              <button onClick={() => { setLanguage('Kannada'); setShowLangMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-[#1e293b]">Kannada</button>
            </div>
          )}
        </div>
        <button onClick={handleVoiceClick} className={`flex items-center space-x-2 ${isListening ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-[#8b5cf6]/20 border-[#8b5cf6]/30 text-[#a78bfa]'} px-4 py-2 rounded-lg hover:bg-[#8b5cf6]/30 transition-colors text-sm font-medium`}>
          <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
          <span>{isListening ? 'Listening...' : 'Voice Mode'}</span>
        </button>
      </TopBar>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0 pb-6">
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Zia Header */}
          <div className="flex items-center justify-between bg-[#131c2f] border border-[#1e293b] p-4 rounded-xl mb-6 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="text-blue-400 text-lg font-bold">Z</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Agent Zia</h3>
                <div className="flex items-center text-[10px] text-slate-400 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></div>
                  Online <span className="mx-1">•</span> Powered by Zoho Catalyst Generative AI
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => { window.print(); }} className="flex items-center space-x-1.5 text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
              <button className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200">
                <History className="w-3.5 h-3.5" />
                <span>Chat History</span>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1e293b] space-y-6">
            
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'user' ? (
                  <div className="flex justify-end items-start space-x-3">
                    <div className="bg-[#4c1d95] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm shadow-md">
                      {msg.text}
                      <span className="text-[9px] text-[#a78bfa] ml-3">{msg.time}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center border border-[#334155] flex-shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm font-bold">Z</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-300 text-sm mb-3 relative">
                        {msg.text}
                        <button onClick={() => speakMessage(msg.text)} className="ml-2 text-slate-400 hover:text-white transition-colors" title="Read Aloud">
                          <Volume2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <span className="text-[9px] text-slate-500 float-right mt-1">{msg.time}</span>
                      </div>

                      {msg.type === 'complex_card' && (
                        <div className="bg-[#131c2f] border border-[#1e293b] rounded-xl overflow-hidden p-5">
                          {/* KPIs */}
                          {msg.data && msg.data.kpis && (
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1e293b] border-b border-[#1e293b] pb-5 mb-5 gap-y-4 md:gap-y-0">
                              <div className="px-2">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Cases</p>
                                <h3 className="text-2xl font-bold text-white">{msg.data.kpis.totalCases}</h3>
                              </div>
                              <div className="px-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Chargesheets Filed</p>
                                <h3 className="text-2xl font-bold text-white">{msg.data.kpis.chargesheetsFiled}</h3>
                              </div>
                              <div className="px-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Arrests Made</p>
                                <h3 className="text-2xl font-bold text-white">{msg.data.kpis.arrestsMade}</h3>
                              </div>
                              <div className="px-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Conviction Rate</p>
                                <h3 className="text-2xl font-bold text-white">{msg.data.kpis.convictionRate}</h3>
                              </div>
                            </div>
                          )}

                          {/* Charts Row */}
                          {msg.data && msg.data.topCrimes && msg.data.trendData && (
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                              <div className="w-full md:w-[45%]">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Top Crime Types</h4>
                                <div className="space-y-3">
                                  {msg.data.topCrimes.map(crime => (
                                    <div key={crime.name} className="flex items-center text-xs">
                                      <span className="w-20 text-slate-300">{crime.name}</span>
                                      <div className="flex-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden mx-3">
                                        <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: crime.width }}></div>
                                      </div>
                                      <span className="w-16 text-right text-slate-300">{crime.count} <span className="text-slate-500">({crime.pct})</span></span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="w-full md:w-[55%]">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Trend <span className="font-normal capitalize">(Last 6 Months)</span></h4>
                                <div className="h-[120px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={msg.data.trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                      <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                                      <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                                      <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7', strokeWidth: 0 }} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Table */}
                          {msg.data && msg.data.recentCases && (
                            <>
                              <div className="overflow-x-auto w-full">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Heinous Cases</h4>
                                <table className="w-full text-xs min-w-[500px]">
                                  <thead>
                                    <tr className="text-slate-500 border-b border-[#1e293b] text-left">
                                      <th className="pb-2 font-medium">FIR Number</th>
                                      <th className="pb-2 font-medium">Crime Type</th>
                                      <th className="pb-2 font-medium">Date</th>
                                      <th className="pb-2 font-medium">Area</th>
                                      <th className="pb-2 font-medium">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#1e293b]">
                                    {msg.data.recentCases.map((rc, i) => (
                                      <tr key={i} className="text-slate-300">
                                        <td className="py-2.5 flex items-center">
                                          <FileText className="w-3 h-3 text-[#a855f7] mr-2" />
                                          {rc.id}
                                        </td>
                                        <td className="py-2.5">{rc.type}</td>
                                        <td className="py-2.5">{rc.date}</td>
                                        <td className="py-2.5">{rc.area}</td>
                                        <td className="py-2.5">
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${rc.sColor}`}>
                                            {rc.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
    
                              <div className="mt-4 pt-3 border-t border-[#1e293b]">
                                <button onClick={() => exportToCSV(msg.data.recentCases, 'heinous_crimes_report.csv')} className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300">
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download full report</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0 mt-1">
                  <span className="text-blue-400 text-sm font-bold">Z</span>
                </div>
                <div className="flex items-center bg-[#131c2f] border border-[#1e293b] rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin mr-2" />
                  <span className="text-sm text-slate-400">Agent Zia is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="mt-4 bg-[#131c2f] border border-[#1e293b] rounded-xl flex items-center px-4 py-3 flex-shrink-0">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "Listening..." : `Ask anything in ${language}...`} 
              className="flex-1 bg-transparent border-none text-slate-200 text-sm focus:ring-0 placeholder-slate-500 outline-none"
              disabled={isListening}
            />
            <button onClick={handleVoiceClick} className={`p-2 transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-slate-400 hover:text-white'}`}>
              <Mic className="w-5 h-5" />
            </button>
            <button onClick={handleSendMessage} className="p-2 ml-2 bg-[#4c1d95] hover:bg-[#5b21b6] text-white rounded-lg transition-colors disabled:opacity-50" disabled={!inputValue.trim() || isListening}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex w-[300px] flex-col space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e293b] pr-2">
          
          {/* Suggested Questions */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Suggested Questions</h3>
            <div className="space-y-3">
              {[
                { icon: <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />, text: "Show all cyber crime cases in last 6 months" },
                { icon: <User className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />, text: "List repeat offenders from Bengaluru" },
                { icon: <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />, text: "Compare theft cases this month vs last month" },
                { icon: <Search className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />, text: "Show crime trend in Mysuru" },
                { icon: <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />, text: "Which area has highest conviction rate?" },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSuggestedClick(item.text)}
                  className="p-3 bg-[#0b1120] border border-[#1e293b] rounded-xl flex items-start space-x-3 cursor-pointer hover:border-[#4c1d95] transition-colors"
                >
                  {item.icon}
                  <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 flex items-center justify-center text-xs text-[#a855f7] hover:text-white transition-colors">
              Load more <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          {/* Capabilities */}
          <div className="glass-panel rounded-xl p-5 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Natural Language Queries</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ask in simple English or Kannada</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mic className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Voice Interaction</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Speak and get instant insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Multi-source Data Search</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">FIRs, Accused, Victims, Vehicles & more</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <History className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Context Aware Responses</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Smart follow-up based on your query</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#4c1d95]/10 border border-[#4c1d95]/30 rounded-xl flex items-start space-x-3">
              <Shield className="w-6 h-6 text-[#a855f7] flex-shrink-0" />
              <p className="text-[10px] text-[#c084fc] leading-relaxed">
                All responses are generated using secure AI models and verified data from KSP systems.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chatbot;
