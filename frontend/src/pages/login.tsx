// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ArrowRight, Loader2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Handle Phone Number Input (Mock Verification)
  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    
    setIsLoading(true);
    setError('');

    // Simulate a network delay to make the portfolio look realistic
    setTimeout(() => {
      setIsLoading(false);
      // Always transition to step 2 for any phone number entered
      setStep(2);
    }, 1000); // 1 second delay
  };

  // Step 2: Handle OTP Verification and Auto-Login (Mock Login)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setError('');

    // Simulate network delay and login the user automatically
    setTimeout(() => {
      // Create a dummy user and token for the portfolio viewer
      const mockToken = 'portfolio-guest-token-12345';
      const mockUser = {
        id: 'guest-user-999',
        name: 'Portfolio Guest',
        phone: phone, // Uses whatever phone they typed
        role: 'user'
      };

      // Save to local storage and update Zustand global state
      localStorage.setItem('token', mockToken);
      setAuth(mockUser, mockToken);
      
      setIsLoading(false);
      
      // Redirect the user to the Home page after successful dummy login
      navigate('/'); 
    }, 1200); // 1.2 seconds delay
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Star Think AI</h1>
          <p className="text-sm text-gray-500 mt-2">ወደ አካውንትዎ ይግቡ (Login)</p>
        </div>

        {/* Dynamic Form Container */}
        <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100">
          
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-2 border border-red-100 animate-fade-in-down">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* STEP 1: Phone Number Input */}
          {step === 1 && (
            <form onSubmit={handleCheckPhone} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  ስልክ ቁጥር (Phone Number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold tracking-wide"
                    placeholder="09..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !phone}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>ቀጥል (Next) <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP / Password Input */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in-up">
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  {phone}
                </div>
                <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); }} className="text-xs font-bold text-blue-600 hover:underline">
                  ቀይር (Change)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  የሚስጥር ኮድ (OTP / Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-bold tracking-widest text-center"
                    placeholder="••••••"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-2 text-center">
                  በስልክዎ የተላከውን ኮድ ወይም የይለፍ ቃልዎን ያስገቡ
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !otp}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'ይግቡ (Login)'
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}