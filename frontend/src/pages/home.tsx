// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { Trophy, HeartPulse, BookOpen, Sparkles, ChevronRight, Gift, Coins } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  // Retrieve the logged-in user from the global Zustand state
  const user = useAuthStore((state) => state.user);

  return (
    // Added pb-24 to ensure content doesn't get hidden behind the mobile bottom navigation
    <div className="flex flex-col gap-6 pb-24 animate-fade-in-up mt-2 bg-slate-50/30 min-h-screen">
      
      {/* 1. Header & Welcome Section */}
      <div className="px-4 pt-6 flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Star Think AI
          </h2>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1.5 tracking-tight">
            ሰላም, {user?.phone ? user.phone : 'ክቡር ተጠቃሚ'} 👋
          </h1>
        </div>
        
        {/* Dynamic User Points Badge */}
        
      </div>

      {/* 2. Gamified Daily Quiz & Rewards Card */}
      <div className="px-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[24px] p-1 shadow-lg shadow-purple-200/50">
          <div className="bg-white rounded-[20px] p-5 relative overflow-hidden">
            {/* Decorative background shapes for the quiz card */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-fuchsia-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  የዕለቱ ጥያቄ <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-sm">አዲስ</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  ፈጥነው በመመለስ እስከ <span className="font-bold text-purple-600">200 ብር</span> የሞባይል ካርድ ይሸለሙ! <span className="font-bold text-red-500">(ለ 3 ፈጣኖች)</span>
                </p>
                {/* CTA Button routing to /quiz */}
                <Link to="/quiz" className="mt-4 w-full bg-purple-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md shadow-purple-200">
                  አሁኑኑ ይሞክሩ <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero / Daily Tip Card (Sports & Entertainment Focus) */}
      <div className="px-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-lg shadow-blue-200/50">
          {/* Decorative glassmorphism blur effects */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-indigo-400/30 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h3 className="font-bold text-lg">የዕለቱ መረጃ ከ Star Think</h3>
            </div>
            <p className="text-blue-50 text-sm leading-relaxed mb-5">
              የኢትዮጵያ ፕሪሚየር ሊግ የቅዳሜ ጨዋታዎችን መርሃ ግብር፣ የቡድን ዜናዎች እና የግምት ትንታኔዎችን ለማግኘት የ AI አማካሪያችንን ይጠይቁ።
            </p>
            <Link to="/sports" className="inline-flex items-center text-sm font-bold text-blue-900 bg-white px-5 py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
              አሁን ይጠይቁ <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Main Services (AI Navigation Cards) */}
      <div className="px-4 mt-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          የ AI አማካሪዎች
        </h3>
        
        <div className="grid gap-4">
          
          {/* Sports & Entertainment Card */}
          <Link to="/sports" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-orange-100 active:scale-[0.98] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
              <Trophy className="w-7 h-7 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-[17px]">ስፖርት & መዝናኛ</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">ስለ እግር ኳስ፣ አትሌቲክስ እና ፊልሞች</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
            </div>
          </Link>

          {/* Health AI Card */}
          <Link to="/health" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-red-100 active:scale-[0.98] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
              <HeartPulse className="w-7 h-7 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-[17px]">የጤና AI</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">የመጀመሪያ ደረጃ የጤና እና አመጋገብ ምክር</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            </div>
          </Link>

          {/* Education AI Card */}
          <Link to="/education" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-indigo-100 active:scale-[0.98] transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-7 h-7 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-[17px]">የትምህርት AI</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">ስለ ፈተና ዝግጅት እና የጥናት ስልቶች</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}