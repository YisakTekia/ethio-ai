// src/pages/Admin.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, CreditCard, ArrowLeft, Loader2, ShieldAlert, RefreshCw, Info } from 'lucide-react';
import { useAuthStore } from "../../store/authStore";

// Define the structure of our expected statistics data
interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  totalQuizAttempts: number;
  estimatedDailyRevenue: number;
}

export default function Admin() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /**
   * Shows a beautiful, self-dismissing popup notification
   */
  const showPopup = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /**
   * Fetches dashboard stats securely using the global auth token.
   */
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setAccessError('');
    
    try {
      // Retrieve the token from Zustand global state
      const token = useAuthStore.getState().token;
      
      if (!token) {
        throw new Error('AUTH_MISSING');
      }

      // Make an authenticated request to the admin protected route
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle specific HTTP status codes securely
      if (response.status === 403) throw new Error('ACCESS_DENIED');
      if (response.status === 401) throw new Error('AUTH_EXPIRED');
      if (!response.ok) throw new Error('NETWORK_ERROR');

      const data = await response.json();
      setStats(data.data);

    } catch (err: any) {
      console.error('Admin Dashboard Error:', err);
      
      if (err.message === 'ACCESS_DENIED') {
        // Stop the user here if they are not an admin
        setAccessError('ይቅርታ፣ ይህንን ገጽ ለማየት የቁጥጥር (Admin) ፈቃድ የለዎትም።');
      } else if (err.message === 'AUTH_EXPIRED' || err.message === 'AUTH_MISSING') {
        // Kick out unauthenticated users
        localStorage.clear();
        useAuthStore.getState().logout();
        navigate('/login');
      } else {
        // Show a temporary toast for network glitches
        showPopup('ከሰርቨር ጋር መገናኘት አልተቻለም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Fetch stats when the component mounts
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 relative animate-fade-in-up">
      
      {/* Custom Popup (Toast Notification) */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down w-[90%] max-w-sm">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start gap-3 text-[13px] leading-relaxed border border-gray-700">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="p-2.5 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform border border-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">የቁጥጥር ገጽ</h1>
        </div>
        
        {/* Refresh Button - Only show if there's no access error */}
        {!accessError && (
          <button 
            onClick={fetchStats}
            disabled={isLoading}
            className={`p-2.5 bg-blue-50 text-blue-600 rounded-full shadow-sm active:scale-95 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* 1. Loading State */}
      {isLoading && !stats && (
        <div className="flex flex-col items-center justify-center mt-32 animate-pulse">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-500 font-bold tracking-wider text-sm uppercase">መረጃዎችን እያሰባሰበ ነው...</p>
        </div>
      )}

      {/* 2. Error State (Access Denied / Not Admin) */}
      {!isLoading && accessError && (
        <div className="bg-white border border-red-100 rounded-[24px] p-8 text-center mt-10 shadow-xl shadow-red-100/50 mx-auto max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-sm">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">መግባት አልተፈቀደም</h2>
          <p className="text-[13px] text-gray-500 font-medium mb-8 leading-relaxed">{accessError}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:bg-gray-800 active:scale-95 transition-all"
          >
            ወደ ዋናው ገጽ ተመለስ
          </button>
        </div>
      )}

      {/* 3. Success State - Dashboard Statistics Grid */}
      {!isLoading && !accessError && stats && (
        <div className="space-y-5 max-w-md mx-auto animate-fade-in-up">
          
          {/* Main Revenue Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[24px] p-6 text-white shadow-lg shadow-green-200/50 relative overflow-hidden">
            {/* Decorative background vectors */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-green-400/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-green-50 text-xs font-bold uppercase tracking-wider mb-1.5 opacity-90">ግምታዊ የዕለቱ ገቢ</p>
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-4xl font-extrabold tracking-tight">{stats.estimatedDailyRevenue}</h2>
                  <span className="text-green-100 font-bold text-sm">ብር</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Users Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">ተጠቃሚዎች</p>
            </div>

            {/* Paid/VIP Users Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 text-purple-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900">{stats.paidUsers}</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">ክፍያ የፈጸሙ</p>
            </div>
          </div>

          {/* Engagement/Quiz Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">{stats.totalQuizAttempts}</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">የጥያቄ (Quiz) ሙከራዎች</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}