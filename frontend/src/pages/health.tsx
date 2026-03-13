// src/pages/Health.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, HeartPulse, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Define the structure for chat messages
type Message = {
  id: string;
  text: string;
  isBot: boolean;
  isError?: boolean;
};

export default function Health() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'ሰላም! እኔ የ Star Think የጤና AI አማካሪ ነኝ። ስለ አጠቃላይ ጤንነት፣ አመጋገብ ወይም የመጀመሪያ ደረጃ ህክምና መረጃ ምን ልርዳዎት?',
      isBot: true,
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add the user's message to the chat interface
    const newUserMsg: Message = { id: Date.now().toString(), text: inputText, isBot: false };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Retrieve the authentication token from Zustand global state
      const token = useAuthStore.getState().token;
      
      if (!token) {
        localStorage.clear();
        throw new Error('AUTH_ERROR');
      }

      // Send the request to the backend API with 'health' domain
      const response = await fetch('https://ethio-ai-backend.onrender.com/api/auth/api/chat', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          message: newUserMsg.text,
          domain: 'health' // Strict health domain
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle unauthorized access by redirecting to login
        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }
        throw new Error('NETWORK_ERROR');
      }
      
      // Add the AI's response to the chat interface
      const newBotMsg: Message = { id: Date.now().toString(), text: data.reply, isBot: true };
      setMessages((prev) => [...prev, newBotMsg]);

    } catch (error: any) {
       console.error("Chat Error:", error);
       
       // UI/UX Graceful Error Handling: Display friendly Amharic messages
       let errorMessage = "ይቅርታ፣ ከሰርቨሩ ጋር መገናኘት አልተቻለም። እባክዎ ኢንተርኔትዎን አረጋግጠው እንደገና ይሞክሩ።";
       if (error.message === 'AUTH_ERROR') {
           errorMessage = "የደህንነት ቁልፍዎ ጊዜው አልፎበታል፣ እባክዎ ከአካውንትዎ ወጥተው እንደገና ይግቡ።";
       }

       // Flag the message as an error to apply specific styling (red bubble)
       const errorMsg: Message = {
           id: Date.now().toString(),
           text: errorMessage,
           isBot: true,
           isError: true 
       };
       setMessages((prev) => [...prev, errorMsg]);
    } finally {
        // Stop the loading animation
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative bg-slate-50/50">
      
      {/* 1. Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-28 scrollbar-hide">
        
        {/* Star Think Health Disclaimer Banner */}
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl p-4 mx-auto max-w-[90%] text-center shadow-sm">
          <p className="text-xs text-red-800 font-medium leading-relaxed">
            <HeartPulse className="inline-block w-4 h-4 text-red-500 mr-1 mb-0.5" />
            <span className="font-bold">Star Think ማሳሰቢያ፡</span> ይህ AI የጤና ኤክስፐርት ብቻ ነው። ይህ ለህክምና ምክር ምትክ አይደለም።
          </p>
        </div>

        {/* Render Chat Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
            <div className={`flex max-w-[85%] gap-2.5 ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {/* User and AI Avatars */}
              <div className="flex-shrink-0 mt-auto mb-1">
                {msg.isBot ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center shadow-md">
                    <HeartPulse className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Message Bubble Styling */}
              <div className={`p-4 rounded-3xl shadow-sm text-[15px] leading-relaxed ${
                msg.isError 
                  ? 'bg-red-50 border border-red-100 text-red-700 rounded-bl-sm' // Error state styling
                  : msg.isBot 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm' // AI message styling
                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-br-sm shadow-red-200' // User message styling
              }`}>
                {msg.isError && <AlertCircle className="w-4 h-4 inline-block mr-2 mb-0.5" />}
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {/* 2. Beautiful Loading Animation (Typing Indicator) */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="flex gap-2.5 max-w-[80%] flex-row">
              <div className="flex-shrink-0 mt-auto mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center shadow-md">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="px-5 py-4 rounded-3xl bg-white border border-gray-100 rounded-bl-sm flex items-center gap-1.5 shadow-sm h-[52px]">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Area - Mobile Optimized (Pill shape) */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-200 p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="የጤና ጥያቄዎን እዚህ ይጻፉ..."
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
              !inputText.trim() || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-500 text-white shadow-lg shadow-red-200 hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}