// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, CreditCard, ArrowLeft, Loader2,  ShieldAlert } from 'lucide-react';

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
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch dashboard stats when the component mounts
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found. Please login.');
        }

        // Make an authenticated request to the admin protected route
        const response = await fetch('https://ethio-ai-backend.onrender.com/api/admin/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        // Handle 403 Forbidden (User is not an admin)
        if (response.status === 403) {
          throw new Error('Access Denied. You do not have admin privileges to view this page.');
        }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch statistics.');
        }

        setStats(data.data);
      } catch (err: any) {
        console.error('Admin Dashboard Error:', err);
        setError(err.message || 'ከሰርቨር ጋር መገናኘት አልተቻለም።');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 animate-fade-in-up">
      {/* Top Navigation */}
      <div className="flex items-center mb-8 pt-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900">የቁጥጥር ገጽ (Admin)</h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">መረጃዎችን እያሰባሰበ ነው...</p>
        </div>
      )}

      {/* Error State (Access Denied or Network Issue) */}
      {!isLoading && error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center mt-10 shadow-sm mx-auto max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-red-800 mb-2">መግባት አልተፈቀደም</h2>
          <p className="text-sm text-red-600 font-medium mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-red-700 active:scale-95 transition-all"
          >
            ወደ ዋናው ገጽ ተመለስ
          </button>
        </div>
      )}

      {/* Success State - Dashboard Statistics Grid */}
      {!isLoading && !error && stats && (
        <div className="space-y-6 max-w-md mx-auto">
          
          {/* Main Revenue Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-green-200 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">ግምታዊ የዕለቱ ገቢ</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-4xl font-extrabold">{stats.estimatedDailyRevenue}</h2>
                  <span className="text-green-100 font-medium">ብር</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Users Card */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">አጠቃላይ ተጠቃሚዎች</p>
            </div>

            {/* Paid/VIP Users Card */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 text-purple-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">{stats.paidUsers}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">ክፍያ የፈጸሙ (VIP)</p>
            </div>
          </div>

          {/* Engagement/Quiz Card */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">{stats.totalQuizAttempts}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">የጥያቄ (Quiz) ሙከራዎች ብዛት</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}