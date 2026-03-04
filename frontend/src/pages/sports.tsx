// src/pages/Sports.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Trophy, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define message structure
type Message = {
  id: string;
  text: string;
  isBot: boolean;
};

export default function Sports() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'ሰላም! እኔ የ Ethio AI የስፖርት እና መዝናኛ AI ነኝ። ስለ እግር ኳስ፣ አትሌቲክስ፣ ፊልሞች ወይም ሙዚቃ ምን ልንገርዎት?',
      isBot: true,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Add user message to the UI
    const newUserMsg: Message = { id: Date.now().toString(), text: inputText, isBot: false };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Retrieve the secure JWT token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // 2. REAL BACKEND CALL WITH AUTHORIZATION HEADER
      const response = await fetch('https://ethio-ai-backend.onrender.com/api/chat', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- CRITICAL: Sends the token to pass the backend security middleware
        },
        body: JSON.stringify({
          message: newUserMsg.text,
          domain: 'sports_entertainment' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If token is expired or invalid, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error(data.message || 'Network response was not ok');
      }
      
      const newBotMsg: Message = { 
        id: Date.now().toString(), 
        text: data.reply, 
        isBot: true 
      };
      setMessages((prev) => [...prev, newBotMsg]);

    } catch (error: any) {
       console.error("Error communicating with AI:", error);
       const errorMsg: Message = {
           id: Date.now().toString(),
           text: error.message === 'No authentication token found. Please login again.' 
            ? "የደህንነት ቁልፍ (Token) አልተገኘም፣ እባክዎ ከአካውንትዎ ወጥተው እንደገና ይግቡ።"
            : "ይቅርታ፣ ከሰርቨሩ ጋር መገናኘት አልተቻለም። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።",
           isBot: true
       };
       setMessages((prev) => [...prev, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 pb-20 scrollbar-hide">
        
        {/* Strict Domain Disclaimer */}
        <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-100 rounded-xl p-3 mx-4 mb-6 text-center shadow-sm">
          <p className="text-xs text-orange-700 font-medium leading-relaxed">
            <span className="font-bold">ማሳሰቢያ፡</span> ይህ AI የስፖርት እና መዝናኛ መረጃዎችን ብቻ ነው የሚሰጠው። እባክዎ ከዚህ ርዕስ ውጪ ያሉ ጥያቄዎችን ከመጠየቅ ይቆጠቡ።
          </p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {/* Avatar Image */}
              <div className="flex-shrink-0 mt-auto mb-1">
                {msg.isBot ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                msg.isBot 
                  ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-200'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="flex gap-2 max-w-[80%] flex-row">
              <div className="flex-shrink-0 mt-auto mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="absolute bottom-2 left-0 right-0 bg-white/80 backdrop-blur-xl border border-gray-200/50 p-2 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="የስፖርት ወይም የመዝናኛ ጥያቄ ይጻፉ..."
            className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-3.5 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              !inputText.trim() || isLoading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}