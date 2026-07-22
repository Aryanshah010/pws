import { create } from "zustand";

const savedUser = JSON.parse(localStorage.getItem("pathivara_user") || "null");
const notificationKey = (user) =>
  `pathivara_notifications_${user?.id || "guest"}`;

export const useStore = create((set) => ({
  // State
  language: localStorage.getItem("pathivara_lang") || "en",
  onboarded: localStorage.getItem("pathivara_onboarded") === "true",
  user: savedUser,
  token: localStorage.getItem("pathivara_token") || null,
  notificationsEnabled:
    localStorage.getItem(notificationKey(savedUser)) || "pending",
  recovery: JSON.parse(sessionStorage.getItem("pathivara_recovery") || "null"),
  cart: JSON.parse(localStorage.getItem("pathivara_cart")) || [],
  catalogSearch: "",
  checkoutOrder: JSON.parse(
    sessionStorage.getItem("pathivara_checkout_order") || "null",
  ),

  // Actions
  setLanguage: (lang) => {
    localStorage.setItem("pathivara_lang", lang);
    set({ language: lang });
  },

  setOnboarded: (val) => {
    localStorage.setItem("pathivara_onboarded", val ? "true" : "false");
    set({ onboarded: val });
  },

  // The permission modal is opened on demand — the first time the buyer
  // actually clicks the notification bell — never automatically on login.
  notificationPromptOpen: false,

  openNotificationPrompt: () => set({ notificationPromptOpen: true }),
  closeNotificationPrompt: () => set({ notificationPromptOpen: false }),

  setNotificationsEnabled: (val) => {
    set((state) => {
      localStorage.setItem(notificationKey(state.user), val);
      return { notificationsEnabled: val, notificationPromptOpen: false };
    });
  },

  setUser: (user, token) => {
    if (user && token) {
      localStorage.setItem("pathivara_user", JSON.stringify(user));
      localStorage.setItem("pathivara_token", token);
      set({
        user,
        token,
        notificationsEnabled:
          localStorage.getItem(notificationKey(user)) || "pending",
      });
    } else {
      localStorage.removeItem("pathivara_user");
      localStorage.removeItem("pathivara_token");
      set({
        user: null,
        token: null,
        notificationsEnabled:
          localStorage.getItem(notificationKey(null)) || "pending",
      });
    }
  },

  logout: () => {
    localStorage.removeItem("pathivara_user");
    localStorage.removeItem("pathivara_token");
    localStorage.removeItem("pathivara_cart");
    set({
      user: null,
      token: null,
      cart: [],
      notificationsEnabled:
        localStorage.getItem(notificationKey(null)) || "pending",
    });
  },

  setRecovery: (recovery) => {
    if (recovery)
      sessionStorage.setItem("pathivara_recovery", JSON.stringify(recovery));
    else sessionStorage.removeItem("pathivara_recovery");
    set({ recovery });
  },

  setCatalogSearch: (catalogSearch) => set({ catalogSearch }),

  setCheckoutOrder: (checkoutOrder) => {
    if (checkoutOrder)
      sessionStorage.setItem(
        "pathivara_checkout_order",
        JSON.stringify(checkoutOrder),
      );
    else sessionStorage.removeItem("pathivara_checkout_order");
    set({ checkoutOrder });
  },

  synchronizeCartPrices: (quotedItems) => {
    set((state) => {
      const byProduct = new Map(
        quotedItems.map((item) => [String(item.productId), item.unitPrice]),
      );
      const cart = state.cart.map((item) =>
        byProduct.has(String(item.product._id))
          ? { ...item, price: byProduct.get(String(item.product._id)) }
          : item,
      );
      localStorage.setItem("pathivara_cart", JSON.stringify(cart));
      return { cart };
    });
  },

  addToCart: (product, quantity, price) => {
    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.product._id === product._id,
      );
      let newCart;

      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity, price }
            : item,
        );
      } else {
        newCart = [...state.cart, { product, quantity, price }];
      }

      localStorage.setItem("pathivara_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) return state; // or could just remove
      const newCart = state.cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      );
      localStorage.setItem("pathivara_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const newCart = state.cart.filter(
        (item) => item.product._id !== productId,
      );
      localStorage.setItem("pathivara_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    localStorage.removeItem("pathivara_cart");
    set({ cart: [] });
  },
}));
