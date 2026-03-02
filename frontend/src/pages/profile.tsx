// src/pages/Profile.tsx
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, CreditCard, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 1. ዙስታንድ (Zustand) ላይ ያለውን ሎጊን ያጠፋል
    navigate('/login'); // 2. ወደ መግቢያ ገጽ ይመልሳል
  };

  return (
    <div className="flex flex-col gap-6 pb-8 animate-fade-in-up mt-4 px-2">
      
      {/* 1. Header & Avatar */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full shadow-inner mb-4 border-4 border-white">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">{user?.phone || 'ያልታወቀ ተጠቃሚ'}</h2>
        <div className="flex items-center justify-center gap-1 text-sm font-medium mt-1 text-green-600">
          <ShieldCheck className="w-4 h-4" /> 
          <span>የተረጋገጠ አካውንት</span>
        </div>
      </div>

      {/* 2. Subscription Status Card */}
      <div className={`p-5 rounded-3xl shadow-sm border relative overflow-hidden ${
        user?.isPaid 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-green-200' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${user?.isPaid ? 'bg-white/20' : 'bg-red-50'}`}>
            <CreditCard className={`w-6 h-6 ${user?.isPaid ? 'text-white' : 'text-red-500'}`} />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${user?.isPaid ? 'text-white' : 'text-gray-900'}`}>
              {user?.isPaid ? 'ፕሪሚየም ተጠቃሚ' : 'ነጻ ተጠቃሚ'}
            </h3>
            <p className={`text-sm mt-0.5 ${user?.isPaid ? 'text-green-100' : 'text-gray-500'}`}>
              {user?.isPaid ? 'ያልተገደበ የ AI አገልግሎት አልዎት' : 'አገልግሎቱን ለማግኘት ክፍያ ይፈጽሙ'}
            </p>
          </div>
        </div>
        
        {/* If not paid, show subscribe button */}
        {!user?.isPaid && (
          <Link to="/subscribe" className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
            <AlertCircle className="w-4 h-4 text-yellow-400" /> አሁኑኑ ይመዝገቡ
          </Link>
        )}
      </div>

      {/* 3. Settings / Options Menu */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 active:bg-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-bold text-gray-700">መረጃዬን አስተካክል</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 4. Logout Button */}
      <button 
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 text-red-500 bg-red-50 py-4 rounded-2xl font-bold hover:bg-red-100 active:scale-95 transition-all"
      >
        <LogOut className="w-5 h-5" /> ከሲስተሙ ውጣ (Logout)
      </button>

    </div>
  );
}