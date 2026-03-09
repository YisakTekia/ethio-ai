// src/pages/login.tsx
import { useState } from 'react';
import { Phone, Lock, ArrowRight, Loader2, AlertCircle, MessageSquareText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://ethio-ai-backend.onrender.com/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'ስልክ ቁጥር ማጣራት አልተቻለም');

      setIsExistingUser(data.exists);
      if (data.exists) {
        setStep(3);
      } else {
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'ከእይነመረብ (Network) ጋር መገናኘት አልተቻለም።');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('እባክዎ ትክክለኛ ባለ 4-አሃዝ የሞባይል መልዕክት (OTP) ያስገቡ።');
      return;
    }
    setError('');
    setStep(3); 
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const endpoint = isExistingUser ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`https://ethio-ai-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'መግባት አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።');

      login(data.token, data.data);
      navigate("/");
    } catch (err: any) {
      setError(err.message || 'ከእይነመረብ ጋር መገናኘት አልተቻለም።');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-200/50 mb-6">
            <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-blue-600 to-indigo-600">
              RG
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            እንኳን ወደ <span className="text-blue-600">RootGate</span> በደህና መጡ
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            {step === 1 && 'ለመጀመር ስልክ ቁጥርዎን ያስገቡ'}
            {step === 2 && 'ስልክዎን በ SMS (OTP) ያረጋግጡ'}
            {step === 3 && (isExistingUser ? 'ወደ አካውንትዎ ይግቡ' : 'አዲስ የይለፍ ቃል ይፍጠሩ')}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium animate-fade-in-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50">
          
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ስልክ ቁጥር</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={isLoading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="09--------"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-2xl transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> ቀጥል</>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in-up">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center mb-6">
                <p className="text-sm text-blue-800 font-medium mb-3">
                  አዲስ ተጠቃሚ ስለሆኑ፣ ከታች ያለውን አዝራር ተጭነው <strong>OK</strong> ብለው ወደ 8080 ይላኩ። 
                </p>
                <a 
                  href="sms:8080?body=OK"
                  className="inline-flex items-center justify-center w-full gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <MessageSquareText className="w-5 h-5" /> ወደ 8080 SMS ይላኩ
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">የደረስዎትን OTP ሚስጥራዊ ቁጥር ያስገቡ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-11 pr-4 py-3.5 tracking-widest text-lg font-bold bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center"
                    placeholder="1234"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={otp.length < 4}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-2xl transition-all shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                አረጋግጥ
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-sm font-semibold text-gray-500 hover:text-gray-800 mt-2">
                ስልክ ቁጥር ለመቀየር
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {isExistingUser ? 'የይለፍ ቃል (Password)' : 'አዲስ የይለፍ ቃል ይፍጠሩ'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
                {!isExistingUser && (
                  <p className="text-xs text-gray-500 mt-2">ለወደፊት ወደ አካውንትዎ ሲገቡ ይህን የይለፍ ቃል ይጠቀማሉ።</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-2xl transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight className="w-5 h-5" /> {isExistingUser ? 'ግባ' : 'ተመዝገብ'}</>}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-sm font-semibold text-gray-500 hover:text-gray-800 mt-2">
                ወደ ኋላ ተመለስ
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}