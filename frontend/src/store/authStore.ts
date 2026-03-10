// src/store/authStore.ts
import { create } from 'zustand';

// User structure with 'points' added
interface User {
  id: string;
  phone: string;
  status?: 'ok' | 'stop';
  isPaid: boolean;
  points: number; 
}

interface AuthState {
  user: User | null;
  token: string | null; // 🔴 1. ቶከን ማከማቻ ጨመርን
  isAuthenticated: boolean;
  
  login: (token: string, userData: User) => void; // 🔴 2. ቶከንም እንዲቀበል አደረግን
  logout: () => void;
  updatePaymentStatus: (status: boolean) => void;
  addPoints: (points: number) => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // 🔴 3. ገጹ Refresh ሲደረግ ቶከኑ እንዳይጠፋ ከ localStorage እናነበዋለን
  token: localStorage.getItem('token') || null, 
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token, userData) => {
    localStorage.setItem('token', token); // ደህንነቱ የተጠበቀ ካርድ ሴቭ እናደርጋለን
    set({ 
      token: token,
      user: userData, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null,
      isAuthenticated: false 
    });
  },

  updatePaymentStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, isPaid: status } : null
  })),

  addPoints: (points) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + points } : null
  })),
}));