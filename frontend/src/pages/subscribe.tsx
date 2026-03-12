// src/pages/Subscribe.tsx
import { CheckCircle2, Zap, ArrowLeft, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Subscribe() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Top Navigation */}
      <div className="flex items-center mb-8 pt-4">
        <Link to="/" className="p-2 bg-white rounded-full shadow-sm mr-4 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">የአገልግሎት ክፍያ</h1>
      </div>

      <div className="space-y-6 animate-fade-in-up">
        {/* Header Note */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8 text-yellow-300" />
            <h2 className="text-xl font-bold">ያልተገደበ የ AI ምክር</h2>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            በስፖርት እና መዝናኛ፣ ጤና እና ትምህርት ዘርፍ የ Star Thinkን ሙሉ አገልግሎት ለማግኘት አሁኑኑ ይመዝገቡ።
          </p>
        </div>

        {/* Pricing Card tailored for Ethio Telecom SMS Billing */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
            ዕለታዊ ጥቅል
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-1">ያልተገደበ አገልግሎት</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">2</span>
            <span className="text-gray-500 font-medium">ብር / በቀን</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm">ያልተገደበ የ AI ጥያቄዎች እና የቻት ታሪክ (Chat History)</span>
            </li>
            
          </ul>

          {/* Telecom SMS Payment Button - Uses sms: protocol to open messaging app */}
          <a 
            href="sms:8080?body=OK"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <MessageSquareText className="w-5 h-5" /> ወደ 8080 'OK' ብለው ይላኩ
          </a>
          
          <p className="text-center text-[11px] text-gray-500 mt-4 leading-relaxed font-medium">
            ከላይ ያለውን ቁልፍ ሲጫኑ በቀጥታ ወደ SMS መተግበሪያዎ ይወስድዎታል።
            ክፍያው በቀጥታ ከሞባይል ካርድዎ (Airtime) ላይ <span className="text-gray-800 font-bold">በቀን 2 ብር</span> ብቻ የሚቆረጥ ይሆናል።
          </p>
        </div>
      </div>
    </div>
  );
}