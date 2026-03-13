// src/pages/Admin.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, TrendingUp, Target, CreditCard, ArrowLeft, Loader2, 
  ShieldAlert, RefreshCw, Info, PlusCircle, LayoutDashboard, 
  HelpCircle, Lightbulb, Trophy, Save, Gift
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Interfaces for TypeScript definitions
interface AdminStats {
  totalUsers: number;
  paidUsers: number;
  totalQuizAttempts: number;
  estimatedDailyRevenue: number;
}

interface Winner {
  _id: string;
  phone: string;
  lastQuizDate: string; // Using exact timestamp for fastest finger logic
}

interface Prizes {
  first: number;
  second: number;
  third: number;
}

export default function Admin() {
  const navigate = useNavigate();
  
  // Navigation and State Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quizzes' | 'tips' | 'winners'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [prizes, setPrizes] = useState<Prizes>({ first: 200, second: 100, third: 50 });
  
  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz Form State
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  // Dynamic Prize settings for the quiz
  const [prize1st, setPrize1st] = useState(200);
  const [prize2nd, setPrize2nd] = useState(100);
  const [prize3rd, setPrize3rd] = useState(50);

  // Tip Form State
  const [tipTitle, setTipTitle] = useState('');
  const [tipContent, setTipContent] = useState('');

  // Reusable Toast Notification
  const showPopup = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Dashboard Statistics from Backend
  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setAccessError('');
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('AUTH_MISSING');

      const response = await fetch('https://ethio-ai-api.onrender.com/api/auth/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 403) throw new Error('ACCESS_DENIED');
      if (response.status === 401) throw new Error('AUTH_EXPIRED');
      if (!response.ok) throw new Error('NETWORK_ERROR');

      const data = await response.json();
      setStats(data.data);
    } catch (err: any) {
      if (err.message === 'ACCESS_DENIED') setAccessError('ይቅርታ፣ የቁጥጥር ፈቃድ የለዎትም። (Access Denied)');
      else if (err.message === 'AUTH_EXPIRED') navigate('/login');
      else showPopup('ከሰርቨር ጋር መገናኘት አልተቻለም። (Network Error)');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Fetch Top 3 Winners from Backend
  const fetchWinners = useCallback(async () => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch('https://ethio-ai-api.onrender.com/api/auth/api/admin/winners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWinners(data.data);
        if (data.prizes) setPrizes(data.prizes); // Set dynamic prizes
      }
    } catch (err) {
      console.error("Error fetching winners:", err);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    fetchStats();
    fetchWinners();
  }, [fetchStats, fetchWinners]);

  // Handle Quiz Creation (Fully Functional)
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch('https://ethio-ai-api.onrender.com/api/auth/api/admin/quizzes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          question: quizQuestion, 
          options: quizOptions, 
          correctIndex: quizCorrectIndex,
          prize1st,
          prize2nd,
          prize3rd
        })
      });

      if (!res.ok) throw new Error('Failed to create quiz');
      
      showPopup('✅ የዕለቱ ጥያቄ በስኬት ዳታቤዝ ገብቷል! (Quiz Created)');
      
      // Reset form fields
      setQuizQuestion('');
      setQuizOptions(['', '', '', '']);
      setQuizCorrectIndex(0);
      setPrize1st(200); setPrize2nd(100); setPrize3rd(50);
    } catch (err) {
      showPopup('❌ ስህተት! ዳታቤዝ አልገባም። (Error)');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Tip Creation (Fully Functional)
  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch('https://ethio-ai-api.onrender.com/api/auth/api/admin/tips', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: tipTitle, content: tipContent })
      });

      if (!res.ok) throw new Error('Failed to create tip');
      
      showPopup('✅ የዕለቱ ምክር በስኬት ዳታቤዝ ገብቷል! (Tip Created)');
      setTipTitle('');
      setTipContent('');
    } catch (err) {
      showPopup('❌ ስህተት! ዳታቤዝ አልገባም። (Error)');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // UI Render Functions
  // ------------------------------------------------------------------

  const renderDashboard = () => (
    <div className="space-y-5 animate-fade-in-up">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-green-50 text-xs font-bold uppercase tracking-wider mb-1.5 opacity-90">ግምታዊ የዕለቱ ገቢ</p>
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-4xl font-extrabold tracking-tight">{stats?.estimatedDailyRevenue || 0}</h2>
              <span className="text-green-100 font-bold text-sm">ብር</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">{stats?.totalUsers || 0}</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">ተጠቃሚዎች</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3 text-purple-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">{stats?.paidUsers || 0}</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">ክፍያ የፈጸሙ</p>
        </div>
      </div>
    </div>
  );

  const renderQuizManager = () => (
    <div className="space-y-4 animate-fade-in-up">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">አዲስ ጥያቄ ፍጠር</h2>
        </div>

        <form onSubmit={handleCreateQuiz} className="space-y-4">
          {/* Question Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">ጥያቄው (Question)</label>
            <textarea 
              required
              value={quizQuestion}
              onChange={(e) => setQuizQuestion(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              rows={3} 
              placeholder="ለምሳሌ፡ የኢትዮጵያ ፕሪሚየር ሊግ አሸናፊ ማን ነው?"
            />
          </div>
          
          {/* Options Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 mb-1">ምርጫዎች (Options)</label>
            {quizOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="correctAnswer" 
                  checked={quizCorrectIndex === idx}
                  onChange={() => setQuizCorrectIndex(idx)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <input 
                  required
                  type="text" 
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...quizOptions];
                    newOpts[idx] = e.target.value;
                    setQuizOptions(newOpts);
                  }}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder={`ምርጫ ${idx + 1}`}
                />
              </div>
            ))}
            <p className="text-[10px] text-gray-400 mt-1">ትክክለኛውን መልስ ክብ ላይ ምልክት ያድርጉ (Select correct answer).</p>
          </div>

          {/* Dynamic Prize Configuration */}
          <div className="pt-2 border-t border-gray-100 mt-2">
             <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
               <Gift className="w-3 h-3" /> የካርድ ሽልማት መጠን (Prize Amount)
             </label>
             <div className="grid grid-cols-3 gap-2">
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">1ኛ አሸናፊ</p>
                  <input type="number" value={prize1st} onChange={e => setPrize1st(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-center font-bold text-green-600 focus:outline-none" />
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">2ኛ አሸናፊ</p>
                  <input type="number" value={prize2nd} onChange={e => setPrize2nd(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-center font-bold text-green-600 focus:outline-none" />
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 mb-1">3ኛ አሸናፊ</p>
                  <input type="number" value={prize3rd} onChange={e => setPrize3rd(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-center font-bold text-green-600 focus:outline-none" />
               </div>
             </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            ጥያቄውን ዳታቤዝ አስገባ
          </button>
        </form>
      </div>
    </div>
  );

  const renderTipManager = () => (
    <div className="space-y-4 animate-fade-in-up">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">የዕለቱ ምክር ፍጠር</h2>
        </div>

        <form onSubmit={handleCreateTip} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">ርዕስ (Title)</label>
            <input 
              required
              value={tipTitle}
              onChange={(e) => setTipTitle(e.target.value)}
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="ለምሳሌ፡ ለጤናማ አመጋገብ..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">ማብራሪያ (Content)</label>
            <textarea 
              required
              value={tipContent}
              onChange={(e) => setTipContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none" 
              rows={5} 
              placeholder="ምክሩን እዚህ ይጻፉ..."
            />
          </div>

          <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full bg-yellow-500 text-white font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-yellow-600 active:scale-95 transition-all"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            ምክሩን ዳታቤዝ አስገባ
          </button>
        </form>
      </div>
    </div>
  );

  const renderWinners = () => (
    <div className="space-y-4 animate-fade-in-up">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">የዛሬ አሸናፊዎች</h2>
          </div>
          <button onClick={() => { showPopup('መረጃው እየታደሰ ነው... (Refreshing)'); fetchWinners(); }} className="text-blue-600 text-sm font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95">
            <RefreshCw className="w-3 h-3" /> አድስ
          </button>
        </div>

        {/* Dynamic Winners List */}
        <div className="space-y-3">
          {winners.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">እስካሁን ምንም አሸናፊ የለም። (No winners yet)</p>
          ) : (
            winners.map((winner, idx) => {
              // Parse the exact time the user submitted the correct answer
              const date = new Date(winner.lastQuizDate);
              // Assign the correct dynamic prize based on their rank (1st, 2nd, 3rd)
              const prizeAmount = idx === 0 ? prizes.first : idx === 1 ? prizes.second : prizes.third;

              return (
                <div key={winner._id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${idx === 0 ? 'bg-yellow-500 shadow-md shadow-yellow-200' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{winner.phone}</p>
                      <p className="text-[10px] text-gray-500">መለሱ፡ {date.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  {/* Displaying Mobile Card Prize instead of points */}
                  <div className="bg-green-100 text-green-700 font-bold text-[11px] px-2.5 py-1.5 rounded-full flex items-center gap-1 border border-green-200 shadow-sm">
                    <Gift className="w-3 h-3" /> {prizeAmount} ብር ካርድ
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down w-[90%] max-w-sm">
          <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-start gap-3 text-[13px] leading-relaxed border border-gray-700">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Navigation & Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="p-2 bg-gray-50 rounded-full mr-3 active:scale-95">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">የቁጥጥር ገጽ (CMS)</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}><LayoutDashboard className="w-4 h-4" /> ዳሽቦርድ</button>
          <button onClick={() => setActiveTab('quizzes')} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'quizzes' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}><HelpCircle className="w-4 h-4" /> ጥያቄ ፍጠር</button>
          <button onClick={() => setActiveTab('tips')} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'tips' ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}><Lightbulb className="w-4 h-4" /> ምክር ፍጠር</button>
          <button onClick={() => setActiveTab('winners')} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'winners' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}><Trophy className="w-4 h-4" /> አሸናፊዎች</button>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 max-w-md mx-auto">
        {isLoading && activeTab === 'dashboard' ? (
          <div className="flex flex-col items-center justify-center mt-32 animate-pulse">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4"><Loader2 className="w-7 h-7 text-blue-600 animate-spin" /></div>
          </div>
        ) : accessError ? (
          <div className="bg-white border border-red-100 rounded-[24px] p-8 text-center mt-10 shadow-xl">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">መግባት አልተፈቀደም</h2>
            <button onClick={() => navigate('/')} className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl mt-4">ወደ ዋናው ገጽ</button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'quizzes' && renderQuizManager()}
            {activeTab === 'tips' && renderTipManager()}
            {activeTab === 'winners' && renderWinners()}
          </>
        )}
      </div>
    </div>
  );
}