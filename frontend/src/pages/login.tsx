// src/pages/Login.tsx
import { useState } from 'react';
import { Phone, Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API login success
    const mockUserFromBackend = {
      id: '12345',
      phone: phone,
      status: 'ok' as const,
      isPaid: false 
    };

    // 1. Save user to global state
    login(mockUserFromBackend);
    
    // 2. Navigate based on payment status
    if (mockUserFromBackend.isPaid) {
      navigate('/'); 
    } else {
      navigate('/subscribe'); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-200/50 mb-6">
            <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-blue-600 to-indigo-600">
              RG
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            እንኳን ወደ <span className="text-blue-600">RootGate</span> በደህና መጡ
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {isLogin ? 'ወደ አካውንትዎ ይግቡ' : 'አዲስ አካውንት ይፍጠሩ'}
          </p>
        </div>

        {/* Form Container with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ስልክ ቁጥር</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                  placeholder="09..."
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">የይለፍ ቃል (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isLogin ? (
                <><LogIn className="w-5 h-5" /> ግባ</>
              ) : (
                <><UserPlus className="w-5 h-5" /> ይመዝገቡ</>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? 'አካውንት የለዎትም? አዲስ ይፍጠሩ' : 'አካውንት አለዎት? ይግቡ'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}