import React, { useState } from 'react';
import { Send, Bot, User, Code2, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'ನಮಸ್ಕಾರ! Hello! I am Zia, your KSP Intelligence Co-Pilot. You can ask me to analyze crime data, find suspects, or write ZCQL queries for the Catalyst Data Store. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

      if (text.toLowerCase().includes("heinous") || text.includes("ಗಂಭೀರ ಅಪರಾಧಗಳನ್ನು")) {
        responseText = "I found 2 Heinous crimes registered in Bengaluru Central PS.";
        zcql = `SELECT CaseMaster.CrimeNo, CaseMaster.BriefFacts 
FROM CaseMaster 
INNER JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.GravityOffenceID 
WHERE GravityOffence.LookupValue = 'Heinous' 
AND CaseMaster.PoliceStationID = 101;`;
      } else if (text.toLowerCase().includes("ramesh")) {
        responseText = "Ramesh K. is associated with 2 active cases (CrimeNo: 101010101202600001, 101010101202600003).";
        zcql = `SELECT CaseMasterID FROM Accused WHERE AccusedName = 'Ramesh K.';`;
      } else {
        responseText = "I can analyze this further. For deep integrations, I run directly on Zoho Catalyst Serverless Functions!";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        zcql: zcql
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white tracking-wide">Intelligent Co-Pilot</h2>
        <p className="text-slate-400 mt-1">Powered by Zoho Catalyst Generative AI</p>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-ksp-blue/20 ml-4' : 'bg-ksp-gold/20 mr-4'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5 text-ksp-blue" /> : <Bot className="w-5 h-5 text-ksp-gold" />}
                </div>

                <div>
                  <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-ksp-blue text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                    {msg.text}
                  </div>
                  
                  {/* Simulated ZCQL Output */}
                  {msg.zcql && (
                    <div className="mt-3 bg-[#020617] border border-slate-700 rounded-lg p-4 font-mono text-xs overflow-x-auto relative group">
                      <div className="absolute top-2 right-2 text-slate-500 flex items-center space-x-1">
                        <Code2 className="w-4 h-4" />
                        <span>ZCQL</span>
                      </div>
                      <p className="text-emerald-400">{msg.zcql}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ksp-gold/20 mr-4 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-ksp-gold" />
                </div>
                <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-tl-none border border-slate-700 p-4 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-pulse text-ksp-gold" />
                  <span>Processing natural language...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {predefinedPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-colors"
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
              placeholder="Ask anything in English or Kannada (e.g. 'Show me Heinous crimes in Bengaluru')"
              className="flex-1 bg-slate-800 border border-slate-700 text-white px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-ksp-blue/50"
            />
            <button 
              onClick={() => handleSend(input)}
              className="absolute right-2 top-2 bottom-2 bg-ksp-blue hover:bg-blue-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
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
