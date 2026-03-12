// src/pages/Profile.tsx
import { useState } from 'react';
import { ArrowLeft, User, ShieldCheck, LogOut, ChevronRight, Info, Zap, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const navigate = useNavigate();
  
  // Retrieve user data and the logout function from the global Zustand state
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Custom Popup (Toast) State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /**
   * Shows a beautiful, self-dismissing popup notification
   */
  const showPopup = (message: string) => {
    setToastMessage(message);
    // ኖቲፊኬሽኑ ከ 4 ሰከንድ በኋላ ራሱን በራሱ ያጠፋል
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /**
   * Handles the logout process securely.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  // ተጠቃሚው ስም ካለው ስሙን፣ ከሌለው ስልኩን፣ ያልተመዘገበ ከሆነ ደግሞ "እንግዳ (Guest)" ይላል
  const displayName = user?.name || user?.firstName || user?.phone || 'እንግዳ (Guest)';
  const isGuest = !user?.phone;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 relative">
      
      {/* 1. Beautiful Custom Popup (Toast Notification) */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down w-[90%] max-w-sm">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start gap-3 text-[13px] leading-relaxed border border-gray-700">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center mb-6 pt-4 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">የእርስዎ ፕሮፋይል</h1>
      </div>

      <div className="space-y-5 max-w-md mx-auto animate-fade-in-up">
        
        {/* Digital ID / Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[24px] p-6 shadow-lg shadow-blue-200 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
          
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border-[3px] border-white/20 shadow-inner relative z-10">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-white mb-1.5 tracking-wide">
            {displayName}
          </h2>
          
          {/* Badge logic: Show verified for users, Guest badge for guests */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md ${isGuest ? 'bg-orange-500/20 text-orange-200' : 'bg-white/20 text-white'}`}>
            <ShieldCheck className={`w-4 h-4 ${isGuest ? 'text-orange-300' : 'text-green-300'}`} />
            <span>{isGuest ? 'ያልተመዘገበ አካውንት' : 'የተረጋገጠ አካውንት'}</span>
          </div>
        </div>

        {/* System Information Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">የአገልግሎት ሁኔታ</p>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">ንቁ (Active)</h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">የሽልማት አከፋፈል</p>
            </div>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">ቀጥታ ስልክ ክፍያ</h3>
          </div>
        </div>

        {/* Action Menu List */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
          
          <button 
            onClick={() => showPopup("የዕለቱን ጥያቄዎች (Quiz) በፍጥነት በመመለስ ካሸነፉ፣ የሞባይል ካርድ ሽልማትዎ ያለምንም መዘግየት በቀጥታ ወደ ስልክ ቁጥርዎ ይላካል (Direct Top-up)።")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">የሽልማት አሰራር</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">ካሸነፉ ሽልማቱ በቀጥታ ይላካል</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="h-[1px] bg-gray-50 mx-4"></div>
          
          <button 
            onClick={() => showPopup("Star Think በተለያዩ ዘርፎች (ስፖርት፣ ጤና፣ ትምህርት) ፈጣን እና ትክክለኛ መረጃ የሚሰጥ የ AI አማካሪ ነው።")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">ስለ Star Think AI</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">የአገልግሎቱ አላማ እና አጠቃቀም</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <div className="h-[1px] bg-gray-50 mx-4"></div>
          
          <button 
            onClick={() => showPopup("ለእገዛ በ 0900000000 መደወል ወይም በ Telegram @StarThinkSupport ማግኘት ይችላሉ።")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">እገዛ እና ድጋፍ</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">ችግር ካጋጠመዎት ያነጋግሩን</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Secure Logout/Login Button */}
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl border active:scale-[0.98] transition-all mt-6 ${isGuest ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50'}`}
        >
          {isGuest ? (
            <>ወደ አካውንትዎ ይግቡ (Login)</>
          ) : (
            <><LogOut className="w-5 h-5" /> ከአካውንት ውጣ (Logout)</>
          )}
        </button>

        <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 mt-6 pb-4 uppercase">
          Star Think Version 1.0.0
        </p>
        
      </div>
    </div>
  );
}