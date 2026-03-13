import { useState, useEffect } from 'react';
import { ArrowLeft, User, ShieldCheck, LogOut, ChevronRight, Info, Zap, PhoneCall, Edit2, Check, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [dbUser, setDbUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showPopup = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchRealProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('https://ethio-ai-backend.onrender.com/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDbUser(data.data);
          setNewName(data.data.name || '');
        } else if (response.status === 401) {
          handleLogout(); 
        }
      } catch (error) {
        showPopup('ከሰርቨር ጋር መገናኘት አልተቻለም።');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealProfile();
  }, [token]);

  const handleSaveName = async () => {
    if (!newName.trim()) {
      setIsEditingName(false);
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('https://ethio-ai-backend.onrender.com/api/user/update-name', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newName })
      });
      
      if (response.ok) {
        const data = await response.json();
        setDbUser(data.data);
        setIsEditingName(false);
        showPopup('✅ ስምዎ በተሳካ ሁኔታ ተስተካክሏል!');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      showPopup('❌ ስም ማስተካከል አልተቻለም። አሁን ይሞክሩ።');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pb-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
      </div>
    );
  }

  const displayName = dbUser?.name || dbUser?.phone || 'እንግዳ (Guest)';
  const isGuest = !dbUser?.phone;

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 relative">
      
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down w-[90%] max-w-sm">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start gap-3 text-[13px] leading-relaxed border border-gray-700">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="flex items-center mb-6 pt-4 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">የእርስዎ ፕሮፋይል</h1>
      </div>

      <div className="space-y-5 max-w-md mx-auto animate-fade-in-up">
        
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[24px] p-6 shadow-lg shadow-blue-200 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border-[3px] border-white/20 shadow-inner relative z-10">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center w-full mb-3">
            {isEditingName && !isGuest ? (
              <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-xl w-full max-w-[250px]">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ስምዎን ያስገቡ..."
                  className="bg-transparent text-white placeholder-blue-200 outline-none flex-1 px-2 text-center font-bold"
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={isSaving} className="bg-white text-blue-600 p-1.5 rounded-lg active:scale-95">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => { setIsEditingName(false); setNewName(dbUser?.name || ''); }} className="bg-red-500/20 text-white p-1.5 rounded-lg active:scale-95">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                  {displayName}
                </h2>
                {!isGuest && (
                  <button onClick={() => setIsEditingName(true)} className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
            
            {!isGuest && (
              <p className="text-blue-200 text-sm mt-1">{dbUser?.phone}</p>
            )}
          </div>
          
          <div className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md ${isGuest ? 'bg-orange-500/20 text-orange-200' : 'bg-white/20 text-white'}`}>
            <ShieldCheck className={`w-4 h-4 ${isGuest ? 'text-orange-300' : 'text-green-300'}`} />
            <span>{isGuest ? 'ያልተመዘገበ አካውንት' : 'የተረጋገጠ አካውንት'}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
          <button onClick={() => showPopup("የዕለቱን ጥያቄዎች (Quiz) በፍጥነት በመመለስ ካሸነፉ፣ የሞባይል ካርድ ሽልማትዎ ያለምንም መዘግየት በቀጥታ ወደ ስልክ ቁጥርዎ ይላካል (Direct Top-up)።")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Zap className="w-5 h-5" /></div>
              <div className="text-left"><h4 className="font-bold text-gray-900">የሽልማት አሰራር</h4><p className="text-[11px] text-gray-500 mt-0.5">ካሸነፉ ሽልማቱ በቀጥታ ይላካል</p></div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="h-[1px] bg-gray-50 mx-4"></div>
          
          <button onClick={() => showPopup("ለእገዛ በ 0900000000 መደወል ወይም በ Telegram @RootGateSupport ማግኘት ይችላሉ።")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><PhoneCall className="w-5 h-5" /></div>
              <div className="text-left"><h4 className="font-bold text-gray-900">እገዛ እና ድጋፍ</h4><p className="text-[11px] text-gray-500 mt-0.5">ችግር ካጋጠመዎት ያነጋግሩን</p></div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl border active:scale-[0.98] transition-all mt-6 ${isGuest ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 'bg-red-50/50 text-red-600 border-red-100 hover:bg-red-50'}`}
        >
          {isGuest ? <>ወደ አካውንትዎ ይግቡ (Login)</> : <><LogOut className="w-5 h-5" /> ከአካውንት ውጣ (Logout)</>}
        </button>
      </div>
    </div>
  );
}