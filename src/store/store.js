import { create } from "zustand";
import i18n from "../config/i18n";
import { apiRequest, authHeader } from "../services/api";
import { unitPriceFor } from "../utils/pricing";

const savedUser = JSON.parse(localStorage.getItem("pathivara_user") || "null");
const notificationKey = (user) =>
  `pathivara_notifications_${user?.id || "guest"}`;

const persistCart = (cart) => {
  localStorage.setItem("pathivara_cart", JSON.stringify(cart));
  return { cart };
};

const cartLine = (product, quantity, price) => ({
  product,
  quantity,
  price: price ?? unitPriceFor(product),
  basePrice: product?.retailPrice ?? price ?? 0,
});

export const useStore = create((set, get) => ({
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
  // Single place the language changes: i18next and the store never drift, so
  // any toggle anywhere in the app switches the whole UI.
  setLanguage: (lang) => {
    localStorage.setItem("pathivara_lang", lang);
    i18n.changeLanguage(lang);
    set({ language: lang });
  },

  setOnboarded: (val) => {
    localStorage.setItem("pathivara_onboarded", val ? "true" : "false");
    set({ onboarded: val });
  },

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

  refreshUser: async () => {
    const token = get().token;
    if (!token) return null;

    try {
      const data = await apiRequest("/auth/me", { headers: authHeader(token) });
      const wasWholesale = get().user?.role === "verified_wholesale";
      const isWholesale = data.user.role === "verified_wholesale";
      get().setUser(data.user, token);

      if (wasWholesale !== isWholesale) {
        window.location.reload();
      }
      return data.user;
    } catch {
      get().logout();
      return null;
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
        quotedItems.map((item) => [String(item.productId), item]),
      );
      return persistCart(
        state.cart.map((item) => {
          const quoted = byProduct.get(String(item.product?._id));
          if (!quoted) return item;
          return {
            ...item,
            price: quoted.unitPrice,
            basePrice: quoted.retailUnitPrice ?? item.basePrice,
          };
        }),
      );
    });
  },

  addToCart: (product, quantity, price) => {
    set((state) => {
      const existing = state.cart.find(
        (item) => item.product?._id === product._id,
      );
      if (!existing)
        return persistCart([...state.cart, cartLine(product, quantity, price)]);

      const merged = existing.quantity + quantity;
      return persistCart(
        state.cart.map((item) =>
          item.product?._id === product._id ? cartLine(product, merged) : item,
        ),
      );
    });
  },

  loadCart: (entries) => {
    set(() =>
      persistCart(
        entries
          .filter((entry) => entry.product?._id)
          .map((entry) => cartLine(entry.product, entry.quantity, entry.price)),
      ),
    );
  },

  // Folds entries into whatever is already in the cart instead of replacing it,
  // so reordering a past order never discards an in-progress basket. Prices are
  // always re-read from the product, never carried over from the old order.
  mergeIntoCart: (entries) => {
    set((state) => {
      const next = [...state.cart];
      entries
        .filter((entry) => entry.product?._id)
        .forEach((entry) => {
          const index = next.findIndex(
            (item) => item.product?._id === entry.product._id,
          );
          const quantity =
            index === -1
              ? entry.quantity
              : next[index].quantity + entry.quantity;
          const line = cartLine(entry.product, quantity);
          if (index === -1) next.push(line);
          else next[index] = line;
        });
      return persistCart(next);
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) return state;
      return persistCart(
        state.cart.map((item) =>
          item.product?._id === productId
            ? cartLine(item.product, quantity)
            : item,
        ),
      );
    });
  },

  removeFromCart: (productId) => {
    set((state) =>
      persistCart(state.cart.filter((item) => item.product?._id !== productId)),
    );
  },

  clearCart: () => {
    localStorage.removeItem("pathivara_cart");
    set({ cart: [] });
  },
}));
