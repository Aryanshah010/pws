import { create } from "zustand";
import { apiRequest, authHeader } from "../services/api";
import { unitPriceFor } from "../utils/pricing";

const savedUser = JSON.parse(localStorage.getItem("pathivara_user") || "null");
const notificationKey = (user) =>
  `pathivara_notifications_${user?.id || "guest"}`;

const persistCart = (cart) => {
  localStorage.setItem("pathivara_cart", JSON.stringify(cart));
  return { cart };
};

/**
 * One cart line, priced for who the buyer is *now*. Every entry point into the
 * cart goes through this, so a line added from a product page, a saved basket
 * or Order Again is shaped identically and carries the whole product — the
 * discount threshold and progress bar are read off product.tierPrices, and a
 * line missing them silently reports "no discount yet" forever.
 */
const cartLine = (product, quantity, price, role) => ({
  product,
  quantity,
  price: price ?? unitPriceFor(product, quantity, role),
  // What the catalogue charged when this line was built. The cart compares it
  // against today's price to spot a real price change, so that unlocking a bulk
  // tier is never mistaken for the storekeeper repricing the product.
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

  /**
   * Re-reads the account behind the saved token. The stored session is what
   * keeps a returning buyer signed in, so this is also the only place that
   * notices the storekeeper changed their buyer type: prices, tier discounts
   * and basket quotes are all derived from the role, so a change means the
   * whole app has to come back up as the new buyer type.
   */
  refreshUser: async () => {
    const token = get().token;
    if (!token) return null;

    try {
      const data = await apiRequest("/auth/me", { headers: authHeader(token) });
      const wasWholesale = get().user?.role === "verified_wholesale";
      const isWholesale = data.user.role === "verified_wholesale";
      get().setUser(data.user, token);

      // Only a move in or out of wholesale changes what anything costs. Going
      // from bulk/shop to pending_wholesale must not reload, or submitting the
      // request would throw the buyer off the form. setUser has already
      // persisted the new role, so the reloaded app sees no change and does
      // not loop.
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
        return persistCart([
          ...state.cart,
          cartLine(product, quantity, price, state.user?.role),
        ]);

      // Adding more of something already in the cart can cross a bulk tier, so
      // the whole line is repriced at the new quantity rather than keeping the
      // price the buyer happened to see on the product page.
      const merged = existing.quantity + quantity;
      return persistCart(
        state.cart.map((item) =>
          item.product?._id === product._id
            ? cartLine(product, merged, undefined, state.user?.role)
            : item,
        ),
      );
    });
  },

  /**
   * Replaces the cart outright with a prepared set of lines.
   *
   * Order Again and saved baskets are "order exactly this", not "add this to
   * whatever is already there". Merging them left the previous cart's
   * quantities in place, which is what threw off the totals and the discount
   * progress bar when a buyer came back to the cart a second time.
   */
  loadCart: (entries) => {
    set((state) =>
      persistCart(
        entries
          .filter((entry) => entry.product?._id)
          .map((entry) =>
            cartLine(
              entry.product,
              entry.quantity,
              entry.price,
              state.user?.role,
            ),
          ),
      ),
    );
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) return state;
      return persistCart(
        state.cart.map((item) =>
          item.product?._id === productId
            ? cartLine(item.product, quantity, undefined, state.user?.role)
            : item,
        ),
      );
    });
  },

  removeFromCart: (productId) => {
    set((state) =>
      persistCart(
        state.cart.filter((item) => item.product?._id !== productId),
      ),
    );
  },

  clearCart: () => {
    localStorage.removeItem("pathivara_cart");
    set({ cart: [] });
  },
}));
