// src/pages/Quiz.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, CheckCircle2, XCircle, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface QuizData {
  _id: string;
  question: string;
  options: string[];
}

export default function Quiz() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  // States
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; pointsAwarded: number } | null>(null);

  useEffect(() => {
    const fetchDailyQuiz = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/api/quiz/daily', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 404) {
          throw new Error('NO_QUIZ');
        }
        
        if (response.status === 403) {
          const data = await response.json();
          throw new Error(data.message); 
        }

        if (!response.ok) {
          throw new Error('NETWORK_ERROR');
        }

        const data = await response.json();
        setQuiz(data.data);
      } catch (err: any) {
        if (err.message === 'NO_QUIZ') {
          setError('ለዛሬ የተዘጋጀ ጥያቄ የለም። እባክዎ ነገ ተመልሰው ይሞክሩ!');
        } else if (err.message.includes('ለዛሬ') || err.message.includes('ሙከራ')) {
          setError(err.message); 
        } else {
          setError('ከሰርቨር ጋር መገናኘት አልተቻለም።');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyQuiz();
  }, [token]);

  useEffect(() => {
    if (isLoading || error || result || !quiz) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !result && !isSubmitting) {
      handleSubmitQuiz(true); 
    }
  }, [timeLeft, isLoading, error, result, quiz, isSubmitting]);

  const handleSubmitQuiz = async (timeOut = false) => {
    if ((selectedOption === null && !timeOut) || !quiz) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/api/quiz/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          quizId: quiz._id,
          selectedIndex: timeOut ? -1 : selectedOption,
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ isCorrect: data.isCorrect, pointsAwarded: data.pointsAwarded });
      } else {
        throw new Error(data.message || 'Error submitting quiz');
      }
    } catch (err: any) {
      console.error("Quiz Submission Error:", err);
      if (err.message && err.message.includes('ለዛሬ')) {
        setError(err.message);
      } else {
        alert("መልስዎን መላክ አልተቻለም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pb-20">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500 font-bold tracking-widest text-sm uppercase">ጥያቄውን እያመጣ ነው...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center pb-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Trophy className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">የዕለቱ ጥያቄ አብቅቷል!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[250px]">{error}</p>
        <button onClick={() => navigate('/')} className="bg-purple-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all">
          ወደ ዋናው ገጽ ተመለስ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24 animate-fade-in-up">
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="p-2.5 bg-gray-50 rounded-full mr-4 active:scale-95 transition-transform border border-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" /> የዕለቱ ጥያቄ
            </h1>
          </div>
          
          {!result && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm transition-colors ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-purple-50 text-purple-600'}`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft} ሰከንድ</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {!result && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-purple-600'}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
          </div>
        )}

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <h2 className="text-lg font-bold text-gray-900 leading-relaxed">
            {quiz?.question}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {quiz?.options.map((option, idx) => (
            <button
              key={idx}
              disabled={isSubmitting || result !== null}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all duration-200 flex items-center justify-between ${
                result !== null
                  ? selectedOption === idx
                    ? result.isCorrect 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-gray-50 border-gray-100 text-gray-400 opacity-50'
                  : selectedOption === idx
                    ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                    : 'bg-white border-gray-100 text-gray-700 hover:border-purple-200 hover:bg-purple-50/50 active:scale-[0.98]'
              }`}
            >
              <span>{option}</span>
              {result !== null && selectedOption === idx && (
                result.isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />
              )}
            </button>
          ))}
        </div>

        {!result ? (
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={selectedOption === null || isSubmitting}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              selectedOption === null || isSubmitting
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95'
            }`}
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'መልሱን ላክ (Submit)'}
          </button>
        ) : (
          <div className={`p-6 rounded-[24px] border text-center animate-fade-in-up ${result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ${result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {result.isCorrect ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <h3 className={`text-xl font-extrabold mb-1 ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {result.isCorrect ? 'ትክክለኛ መልስ! 🎉' : 'ይቅርታ፣ ተሳስተዋል!'}
            </h3>
            <p className={`text-sm font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {result.isCorrect ? `+${result.pointsAwarded} ነጥብ አግኝተዋል` : 'በቀጣይ ይሞክሩ'}
            </p>
            <button onClick={() => navigate('/')} className={`w-full mt-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 ${result.isCorrect ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              ወደ ዋናው ገጽ ተመለስ
            </button>
          </div>
        )}

      </div>
    </div>
  );
}