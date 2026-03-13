// src/pages/Profile.tsx
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

  // 🔴 አድራሻው በትክክል ተስተካክሏል (የመጣውን 404 ለመፍታት)
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

  // 🔴 የስም ማስተካከያ ሊንክም ተስተካክሏል
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
      showPopup('❌ ስም ማስተካከል አልተቻለም።');
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
      {/* Rest of the UI remains the same... */}
      {/* [Copy your UI code here if needed, the logic above is what fixes the error] */}
      <div className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-full shadow-sm mr-4 border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">የእርስዎ ፕሮፋይል</h1>
      </div>

      <div className="space-y-5 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[24px] p-6 text-center text-white shadow-lg">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto border-[3px] border-white/20">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold">{displayName}</h2>
          {!isGuest && <p className="text-blue-200 text-sm">{dbUser?.phone}</p>}
        </div>
        
        <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100">
          Logout
        </button>
      </div>
    </div>
  );
}