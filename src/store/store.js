import { create } from 'zustand';

export const useStore = create((set) => ({
  // State
  language: localStorage.getItem('pathivara_lang') || 'en',
  onboarded: localStorage.getItem('pathivara_onboarded') === 'true',
  user: JSON.parse(localStorage.getItem('pathivara_user')) || null,

  // Actions
  setLanguage: (lang) => {
    localStorage.setItem('pathivara_lang', lang);
    set({ language: lang });
  },

  setOnboarded: (val) => {
    localStorage.setItem('pathivara_onboarded', val ? 'true' : 'false');
    set({ onboarded: val });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('pathivara_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pathivara_user');
    }
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('pathivara_user');
    set({ user: null });
  }
}));
