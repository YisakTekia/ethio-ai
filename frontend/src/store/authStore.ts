// src/store/authStore.ts
import { create } from 'zustand';

// User structure with 'points' added
interface User {
  id: string;
  phone: string;
  status: 'ok' | 'stop';
  isPaid: boolean;
  points: number; 
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  
  login: (userData: User) => void;
  logout: () => void;
  updatePaymentStatus: (status: boolean) => void;
  addPoints: (points: number) => void; // ነጥብ መጨመሪያ ፈንክሽን
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData) => set({ 
    user: userData, 
    isAuthenticated: true 
  }),

  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),

  updatePaymentStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, isPaid: status } : null
  })),

  // አዲስ፡ ጥያቄ ሲመልስ ነጥብ የሚጨምር
  addPoints: (points) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + points } : null
  })),
}));