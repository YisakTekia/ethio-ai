// src/components/OfflineBanner.tsx
import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Listen for network status changes
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-bold text-center py-2 px-4 flex items-center justify-center gap-2 animate-fade-in-up z-50 relative shadow-md">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>ኢንተርኔት የለም። ጥያቄዎ ያስቀምጡ ኢንተርኔት ሲያገኝ ይላካል (Offline Mode)</span>
    </div>
  );
}