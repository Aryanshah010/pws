import { create } from 'zustand';

export const useStore = create((set) => ({
  // State
  language: localStorage.getItem('pathivara_lang') || 'en',
  onboarded: localStorage.getItem('pathivara_onboarded') === 'true',
  user: JSON.parse(localStorage.getItem('pathivara_user')) || null,
  token: localStorage.getItem('pathivara_token') || null,
  notificationsEnabled: localStorage.getItem('pathivara_notifications') || 'pending',
  cart: JSON.parse(localStorage.getItem('pathivara_cart')) || [],

  // Actions
  setLanguage: (lang) => {
    localStorage.setItem('pathivara_lang', lang);
    set({ language: lang });
  },

  setOnboarded: (val) => {
    localStorage.setItem('pathivara_onboarded', val ? 'true' : 'false');
    set({ onboarded: val });
  },

  setNotificationsEnabled: (val) => {
    localStorage.setItem('pathivara_notifications', val);
    set({ notificationsEnabled: val });
  },

  setUser: (user, token) => {
    if (user && token) {
      localStorage.setItem('pathivara_user', JSON.stringify(user));
      localStorage.setItem('pathivara_token', token);
      set({ user, token });
    } else {
      localStorage.removeItem('pathivara_user');
      localStorage.removeItem('pathivara_token');
      set({ user: null, token: null });
    }
  },

  logout: () => {
    localStorage.removeItem('pathivara_user');
    localStorage.removeItem('pathivara_token');
    localStorage.removeItem('pathivara_cart');
    set({ user: null, token: null, cart: [] });
  },

  addToCart: (product, quantity, price) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.product._id === product._id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity, price }
            : item
        );
      } else {
        newCart = [...state.cart, { product, quantity, price }];
      }
      
      localStorage.setItem('pathivara_cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) return state; // or could just remove
      const newCart = state.cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('pathivara_cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newCart = state.cart.filter((item) => item.product._id !== productId);
      localStorage.setItem('pathivara_cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    localStorage.removeItem('pathivara_cart');
    set({ cart: [] });
  }
}));
