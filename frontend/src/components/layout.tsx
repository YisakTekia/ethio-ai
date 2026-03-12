// src/components/Layout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Trophy, HeartPulse, BookOpen, UserCircle } from 'lucide-react';

import OfflineBanner from './OfflineBanner';

export default function Layout() {
  const location = useLocation();

  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      
      <OfflineBanner />

      
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <Home className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Star Think
          </h1>
        </div>
        <Link to="/profile" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition active:scale-95">
          <UserCircle className="w-6 h-6 text-gray-700" />
        </Link>
      </header>

      
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        <div className="max-w-md mx-auto h-full">
         
          <Outlet /> 
        </div>
      </main>

      
      <nav className="fixed bottom-0 w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 pb-safe pt-2 px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl">
        <div className="flex justify-between items-center mb-2">
          
          <Link to="/" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive('/') ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Home className={`w-6 h-6 ${isActive('/') ? 'drop-shadow-md' : ''}`} />
            <span className="text-[10px] font-semibold mt-1">ዋና</span>
          </Link>

          <Link to="/sports" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive('/sports') ? 'text-orange-500 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Trophy className={`w-6 h-6 ${isActive('/sports') ? 'drop-shadow-md' : ''}`} />
            <span className="text-[10px] font-semibold mt-1">ስፖርት</span>
          </Link>

          <Link to="/health" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive('/health') ? 'text-red-500 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <HeartPulse className={`w-6 h-6 ${isActive('/health') ? 'drop-shadow-md' : ''}`} />
            <span className="text-[10px] font-semibold mt-1">ጤና</span>
          </Link>

          <Link to="/education" className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive('/education') ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <BookOpen className={`w-6 h-6 ${isActive('/education') ? 'drop-shadow-md' : ''}`} />
            <span className="text-[10px] font-semibold mt-1">ትምህርት</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}