// src/pages/Profile.tsx
import { ArrowLeft, User, Phone, ShieldCheck, LogOut, Coins, Gift, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const navigate = useNavigate();
  
  // Retrieve user data and the logout function from the global state
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  /**
   * Handles the logout process securely.
   * Clears local storage (JWT token) and global state, then redirects to login.
   */
  const handleLogout = () => {
    // 1. Remove the secure JWT token from the browser's local storage
    localStorage.removeItem('token');
    
    // 2. Clear the user data from the Zustand global state
    logout();
    
    // 3. Redirect the user back to the login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 animate-fade-in-up">
      {/* Top Navigation */}
      <div className="flex items-center mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">የእርስዎ ፕሮፋይል</h1>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        
        {/* Profile Info Card (Glassmorphism style) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-50 rounded-full blur-2xl"></div>
          
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md relative z-10">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">
            {user?.phone ? user.phone : 'ክቡር ተጠቃሚ'}
          </h2>
          <div className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
            <ShieldCheck className="w-4 h-4" />
            <span>የተረጋገጠ አካውንት</span>
          </div>
        </div>

        {/* Stats & Rewards Container */}
        <div className="grid grid-cols-2 gap-4">
          {/* Points / Balance Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-3xl border border-yellow-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2 text-yellow-600">
              <Coins className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-semibold mb-1">ያሎት ነጥብ (ብር)</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{user?.points || 0}</h3>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2 text-purple-600">
              <Gift className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 font-semibold mb-1">የክፍያ ሁኔታ</p>
            <h3 className="text-sm font-extrabold text-gray-900 mt-1">
              {user?.isPaid ? <span className="text-green-600">ያልተገደበ (VIP)</span> : <span className="text-orange-500">ነጻ (Free)</span>}
            </h3>
          </div>
        </div>

        {/* Action Menu List */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
          <Link to="/subscribe" className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800">የአገልግሎት ክፍያ</h4>
                <p className="text-xs text-gray-500">ወርሃዊ ወይም ዕለታዊ ጥቅል ለመግዛት</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          
          <div className="h-[1px] bg-gray-100 mx-4"></div>
          
          <button 
            onClick={() => alert("የሞባይል ካርድ ሽልማትዎን ለማውጣት ቢያንስ 15 ብር (ነጥብ) መሙላት አለብዎት።")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800">ሽልማት አውጣ</h4>
                <p className="text-xs text-gray-500">ነጥብዎን ወደ ሞባይል ካርድ ይቀይሩ</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Secure Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 active:scale-[0.98] transition-all mt-4"
        >
          <LogOut className="w-5 h-5" /> ከአካውንት ውጣ (Logout)
        </button>

        {/* App Version Info */}
        <p className="text-center text-xs text-gray-400 mt-6 pb-4">
          Ethio AI AI Version 1.0.0
        </p>
        
      </div>
    </div>
  );
}