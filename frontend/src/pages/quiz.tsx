// src/pages/Quiz.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, ArrowLeft, Clock } from 'lucide-react';
// import { useAuthStore } from '../store/authStore';

export default function Quiz() {
  const navigate = useNavigate();
  // const addPoints = useAuthStore((state) => state.addPoints); // We will handle actual points in the backend
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Daily Question details
  const dailyQuestion = {
    text: 'በኦሎምፒክ ታሪክ ለመጀመሪያ ጊዜ በባዶ እግሩ ሮጦ የማራቶን ወርቅ ያመጣው ኢትዮጵያዊ አትሌት ማን ነው?',
    options: ['ቀነኒሳ በቀለ', 'ሀይሌ ገብረስላሴ', 'አበበ ቢቂላ', 'ምሩፅ ይፍጠር'],
    correctAnswerIndex: 2, 
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    
    // NOTE: In the real app, we will send this to the Backend to check 
    // if the user is 1st, 2nd, or 3rd to answer. 
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
                disabled={isSubmitted}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${
                  isCorrect ? 'border-green-500 bg-green-50' : 
                  isWrong ? 'border-red-500 bg-red-50' : 
                  isSelected ? 'border-purple-500 bg-purple-50' : 
                  'border-gray-100 bg-white hover:border-purple-200'
                } ${isSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
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
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-md ${
              selectedAnswer !== null
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-purple-200 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            መልሴን አረጋግጥ
          </button>
        ) : (
          <div className={`p-4 rounded-2xl text-center border animate-fade-in-up ${
            selectedAnswer === dailyQuestion.correctAnswerIndex 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-bold text-lg mb-1 ${selectedAnswer === dailyQuestion.correctAnswerIndex ? 'text-green-700' : 'text-red-700'}`}>
              {selectedAnswer === dailyQuestion.correctAnswerIndex ? '🎉 ትክክል ነው!' : '😔 አልተሳካም'}
            </h3>
            <p className={`text-sm mt-2 font-medium ${selectedAnswer === dailyQuestion.correctAnswerIndex ? 'text-green-700' : 'text-red-600'}`}>
              {selectedAnswer === dailyQuestion.correctAnswerIndex 
                ? 'መልሱን ትክክል መልሰዋል! ሽልማት ውስጥ መግባትዎን ለማረጋገጥ ውጤትዎን ለባክኤንድ (Server) ልከነዋል። አሸናፊ ከሆኑ በስልክ ቁጥርዎ ይላክልዎታል!' 
                : 'የዛሬውን ጥያቄ ስተዋል። ነገ መልሰው ይሞክሩ!'}
            </p>
            <button onClick={() => navigate('/')} className="mt-4 text-sm font-bold text-gray-600 underline hover:text-gray-900">
              ወደ ዋናው ገጽ ተመለስ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}