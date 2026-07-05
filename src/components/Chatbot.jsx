import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Activity, ShieldCheck, Mic } from 'lucide-react';

const Chatbot = ({ theme }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'ನಮಸ್ಕಾರ! Hello! I am Zia, your KSP Intelligence Co-Pilot. You can ask me to analyze crime data, find suspects, or write ZCQL queries for the Catalyst Data Store. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-US');
  const messagesEndRef = useRef(null);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find a specific voice for the language (e.g. kn-IN or kn)
      const matchedVoice = voices.find(voice => 
        voice.lang.toLowerCase() === voiceLang.toLowerCase() || 
        voice.lang.toLowerCase().startsWith(voiceLang.split('-')[0].toLowerCase())
      );
      
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang; 
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const predefinedPrompts = [
    "Show me all Heinous crimes in Bengaluru.",
    "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಡೆದ ಗಂಭೀರ ಅಪರಾಧಗಳನ್ನು ತೋರಿಸಿ",
    "List suspects connected to Ramesh K."
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newUserMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response & ZCQL Generation
    setTimeout(() => {
      let responseText = "Here is the data you requested.";
      let zcql = "";

      const isKannada = voiceLang === 'kn-IN' || /[\u0C80-\u0CFF]/.test(text);
      
      if (text.toLowerCase().includes("heinous") || text.includes("ಗಂಭೀರ")) {
        responseText = isKannada 
          ? "ಬೆಂಗಳೂರು ಸೆಂಟ್ರಲ್ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ 2 ಗಂಭೀರ ಅಪರಾಧಗಳು ದಾಖಲಾಗಿವೆ." 
          : "I found 2 Heinous crimes registered in Bengaluru Central PS.";
        zcql = `SELECT CaseMaster.CrimeNo, CaseMaster.BriefFacts 
FROM CaseMaster 
INNER JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.GravityOffenceID 
WHERE GravityOffence.LookupValue = 'Heinous' 
AND CaseMaster.PoliceStationID = 101;`;
      } else if (text.toLowerCase().includes("ramesh") || text.includes("ರಮೇಶ್")) {
        responseText = isKannada 
          ? "ರಮೇಶ್ ಕೆ. ಅವರು 2 ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ್ದಾರೆ (CrimeNo: 101010101202600001, 101010101202600003)." 
          : "Ramesh K. is associated with 2 active cases (CrimeNo: 101010101202600001, 101010101202600003).";
        zcql = `SELECT CaseMasterID FROM Accused WHERE AccusedName = 'Ramesh K.';`;
      } else {
        responseText = isKannada 
          ? "ನಾನು ಇದನ್ನು ಇನ್ನಷ್ಟು ವಿಶ್ಲೇಷಿಸಬಲ್ಲೆ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ, ನಾನು ಝೋಹೊ ಕೆಟಲಿಸ್ಟ್ ಸರ್ವರ್‌ಲೆಸ್ ಫಂಕ್ಷನ್‌ಗಳಲ್ಲಿ ನೇರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತೇನೆ!" 
          : "I can analyze this further. For deep integrations, I run directly on Zoho Catalyst Serverless Functions!";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        zcql: zcql
      }]);
      setIsTyping(false);
      speak(responseText);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-70px)] md:h-full flex flex-col page-enter">
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Intelligent Co-Pilot</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-1.5 flex items-center text-xs md:text-sm">
            <Sparkles className="w-4 h-4 mr-1 md:mr-2 text-ksp-gold" />
            Powered by Zoho Catalyst Generative AI
          </p>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden relative border-t-2 border-t-ksp-gold/50 shadow-lg dark:shadow-2xl">
        {/* Chat Header */}
        <div className="bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 p-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ksp-gold to-orange-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-ksp-gold" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 md:w-3.5 h-3 md:h-3.5 bg-emerald-500 border-2 border-slate-100 dark:border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-base md:text-lg flex items-center">
                Agent Zia
                <ShieldCheck className="w-4 h-4 ml-2 text-ksp-blue dark:text-ksp-blueLight" />
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center font-bold tracking-wide">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeUp`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${msg.sender === 'user' ? 'bg-gradient-to-br from-ksp-blue to-blue-600 ml-4' : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 mr-4'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-ksp-gold dark:text-ksp-goldLight" />}
                </div>

                <div className="flex flex-col">
                  <div className={`p-4 shadow-md ${
                    msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-ksp-blue to-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700/60'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fadeUp">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 mr-4 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-ksp-gold dark:text-ksp-goldLight" />
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700/60 p-4 flex items-center space-x-3 shadow-md">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-ksp-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-ksp-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-ksp-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                  <span className="text-sm font-bold">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700/50 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl relative z-10">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {predefinedPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:border-ksp-blue/50 hover:text-ksp-blue dark:hover:border-ksp-blue/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask Zia anything in English or Kannada..."
              className="flex-1 bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ksp-blue/50 shadow-inner transition-shadow text-sm md:text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-48"
            />
            <button
              onClick={() => setVoiceLang(prev => prev === 'en-US' ? 'kn-IN' : 'en-US')}
              className={`absolute right-36 top-2 bottom-2 ${voiceLang === 'kn-IN' ? 'bg-ksp-gold/20 text-ksp-gold border border-ksp-gold/50' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700'} px-3 rounded-xl transition-all flex items-center justify-center font-bold text-xs`}
              title="Toggle Language"
            >
              {voiceLang === 'en-US' ? 'EN' : 'ಕನ್ನಡ'}
            </button>
            <button 
              onClick={startListening}
              className={`absolute right-20 top-2 bottom-2 ${isListening ? 'bg-red-500/20 text-red-600 dark:text-red-500 border border-red-500/50 animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700'} px-4 rounded-xl transition-all flex items-center justify-center`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-ksp-blue to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
