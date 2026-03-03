// src/pages/Quiz.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, ArrowLeft, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Quiz() {
  const navigate = useNavigate();
  
  // Get user data and the login function to update points globally
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // States to store backend responses
  const [backendMessage, setBackendMessage] = useState('');
  const [backendError, setBackendError] = useState('');

  // Daily Question details (In a full app, this would also come from the backend)
  const dailyQuestion = {
    text: 'በኦሎምፒክ ታሪክ ለመጀመሪያ ጊዜ በባዶ እግሩ ሮጦ የማራቶን ወርቅ ያመጣው ኢትዮጵያዊ አትሌት ማን ነው?',
    options: ['ቀነኒሳ በቀለ', 'ሀይሌ ገብረስላሴ', 'አበበ ቢቂላ', 'ምሩፅ ይፍጠር'],
    correctAnswerIndex: 2, 
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    
    setIsLoading(true);
    setBackendError('');
    
    const isAnswerCorrect = selectedAnswer === dailyQuestion.correctAnswerIndex;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please login again.');

      // Make the actual API call to submit the quiz
      const response = await fetch('https://ethio-ai-backend.onrender.com/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isCorrect: isAnswerCorrect })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong while submitting.');
      }

      // Success! The backend accepted the attempt.
      setIsSubmitted(true);
      setBackendMessage(data.message);

      // If the user won points, update their global state immediately so the Profile shows it
      if (data.rewardPoints > 0 && user) {
        login({
          ...user,
          points: (user.points || 0) + data.rewardPoints
        });
      }

    } catch (err: any) {
      console.error('Quiz submission error:', err);
      // This catches the "already attempted today" error from the backend
      setBackendError(err.message || 'ከሰርቨር ጋር መገናኘት አልተቻለም።');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" /> የዕለቱ ጥያቄ
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
        
        {/* Tiered Rewards Display */}
        <div className="bg-purple-50 text-purple-800 text-sm font-bold px-4 py-3 rounded-xl inline-block mb-6 border border-purple-100 w-full shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="text-xs">ለ 3 ፈጣኖች ብቻ የተዘጋጀ ሽልማት</span>
          </div>
          <ul className="space-y-1 text-xs">
            <li className="flex justify-between items-center bg-white p-2 rounded-lg">
              <span>🥇 1ኛ ፈጥኖ ለሚመልስ፡</span> <span className="text-green-600 font-extrabold">200 ብር ካርድ</span>
            </li>
            <li className="flex justify-between items-center bg-white p-2 rounded-lg">
              <span>🥈 2ኛ ፈጥኖ ለሚመልስ፡</span> <span className="text-green-600 font-extrabold">100 ብር ካርድ</span>
            </li>
            <li className="flex justify-between items-center bg-white p-2 rounded-lg">
              <span>🥉 3ኛ ፈጥኖ ለሚመልስ፡</span> <span className="text-green-600 font-extrabold">50 ብር ካርድ</span>
            </li>
          </ul>
        </div>

        {/* Backend Error Message (e.g. "Already attempted today") */}
        {backendError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-start gap-2 text-sm font-medium animate-fade-in-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{backendError}</p>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {dailyQuestion.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {dailyQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = isSubmitted && index === dailyQuestion.correctAnswerIndex;
            const isWrong = isSubmitted && isSelected && index !== dailyQuestion.correctAnswerIndex;

            return (
              <button
                key={index}
                disabled={isSubmitted || isLoading || !!backendError}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${
                  isCorrect ? 'border-green-500 bg-green-50' : 
                  isWrong ? 'border-red-500 bg-red-50' : 
                  isSelected ? 'border-purple-500 bg-purple-50' : 
                  'border-gray-100 bg-white hover:border-purple-200'
                } ${isSubmitted || !!backendError ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
              >
                <span className={`font-semibold ${isCorrect ? 'text-green-700' : isWrong ? 'text-red-700' : isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                  {option}
                </span>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {isWrong && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && !backendError ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isLoading}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
              selectedAnswer !== null && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-purple-200 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> እባክዎ ይጠብቁ...</> : 'መልሴን አረጋግጥ'}
          </button>
        ) : isSubmitted ? (
          <div className={`p-4 rounded-2xl text-center border animate-fade-in-up ${
            selectedAnswer === dailyQuestion.correctAnswerIndex 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-bold text-lg mb-1 ${selectedAnswer === dailyQuestion.correctAnswerIndex ? 'text-green-700' : 'text-red-700'}`}>
              {selectedAnswer === dailyQuestion.correctAnswerIndex ? '🎉 ትክክል ነው!' : '😔 አልተሳካም'}
            </h3>
            {/* Display the exact dynamic message returned from the backend */}
            <p className={`text-sm mt-2 font-medium leading-relaxed ${selectedAnswer === dailyQuestion.correctAnswerIndex ? 'text-green-700' : 'text-red-600'}`}>
              {backendMessage || (selectedAnswer === dailyQuestion.correctAnswerIndex 
                ? 'መልሱን ትክክል መልሰዋል! ሽልማት ውስጥ መግባትዎን ለማረጋገጥ ውጤትዎን ለባክኤንድ ልከነዋል።' 
                : 'የዛሬውን ጥያቄ ስተዋል። ነገ መልሰው ይሞክሩ!')}
            </p>
            <button onClick={() => navigate('/')} className="mt-4 text-sm font-bold text-gray-600 underline hover:text-gray-900">
              ወደ ዋናው ገጽ ተመለስ
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}