import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, ShoppingCart, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SearchDropdown from "../common/SearchDropdown";
import { useStore } from "../../store/store";
import { API_URL, apiRequest, authHeader } from "../../services/api";
import { showPush } from "../../utils/push";

const ACCOUNT_STATUS_LINKS = {
  pending: "/wholesale-pending",
  approved: "/wholesale-approved",
  rejected: "/wholesale-rejected",
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const {
    language,
    setLanguage,
    logout,
    user,
    catalogSearch,
    setCatalogSearch,
    notificationsEnabled,
    openNotificationPrompt,
    refreshUser,
  } = useStore();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [aliasMatch, setAliasMatch] = useState(null);
  const [previewTotalCount, setPreviewTotalCount] = useState(0);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const notifBtnRef = useRef(null);
  const notifPanelRef = useRef(null);
  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!notificationsOpen && !profileOpen) return undefined;
    const handleOutside = (event) => {
      const insideNotif =
        (notifBtnRef.current && notifBtnRef.current.contains(event.target)) ||
        (notifPanelRef.current && notifPanelRef.current.contains(event.target));
      if (!insideNotif) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [notificationsOpen, profileOpen, searchDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!catalogSearch.trim()) {
      setPreviewProducts([]);
      setAliasMatch(null);
      setPreviewTotalCount(0);
      setSearchDropdownOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await apiRequest(
          `/products/search-preview?q=${encodeURIComponent(catalogSearch.trim())}`
        );
        setPreviewProducts(data.products || []);
        setAliasMatch(data.aliasMatch || null);
        setPreviewTotalCount(data.totalCount || 0);
        setSearchDropdownOpen(true);
      } catch (err) {
        console.error("Failed to fetch search preview", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [catalogSearch]);
  const loadNotifications = async () => {
    if (!user || !localStorage.getItem("pathivara_token")) return;
    try {
      const data = await apiRequest("/orders/notifications", {
        headers: authHeader(localStorage.getItem("pathivara_token")),
      });
      setNotifications(data.notifications);
    } catch {
      setNotifications([]);
    }
  };
  useEffect(() => {
    loadNotifications();
    const token = localStorage.getItem("pathivara_token");
    const stream = new EventSource(
      `${API_URL}/events${token ? `?token=${encodeURIComponent(token)}` : ""}`,
    );

    const readPayload = (event) => {
      try {
        return JSON.parse(event.data);
      } catch {
        return null;
      }
    };

    stream.addEventListener("order-updated", (event) => {
      loadNotifications();
      showPush(readPayload(event)?.push);
    });
    stream.addEventListener("catalog-updated", (event) => {
      const payload = readPayload(event);
      if (payload?.action !== "restocked") return;
      loadNotifications();
      showPush(payload.push);
    });
    stream.addEventListener("account-updated", async (event) => {
      const payload = readPayload(event);
      showPush(payload?.push);
      await refreshUser();
      loadNotifications();

      if (!payload?.push?.title) return;
      const link = ACCOUNT_STATUS_LINKS[payload.wholesaleStatus];
      toast.info(
        <span className="block">
          <span className="block font-semibold">{payload.push.title}</span>
          <span className="block text-sm">{payload.push.body}</span>
        </span>,
        {
          autoClose: 10000,
          onClick: link ? () => navigate(link) : undefined,
        },
      );
    });

    return () => stream.close();
  }, [user?.id]);

  const openNotification = async (item) => {
    setNotificationsOpen(false);
    if (!item.read) {
      try {
        await apiRequest(`/orders/notifications/${item._id}/read`, {
          method: "PUT",
          headers: authHeader(localStorage.getItem("pathivara_token")),
        });
        loadNotifications();
      } catch {
        // A failed read receipt should never block the buyer from the page.
      }
    }
    if (item.link) navigate(item.link);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ne" : "en";
    setLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    toast.info(t("nav.signedOut"));
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="w-full bg-[#6C977D] py-1.5 px-7.5 sm:px-">
        <div className="max-w-[1512px] mx-auto flex justify-end items-center gap-6">
          <Link
            to="/about"
            className="text-white font-[Montserrat] text-sm font-normal hover:text-white/80 transition-colors"
          >
            {t("nav.about")}
          </Link>
          <button
            onClick={toggleLanguage}
            className="text-[#0052D5] font-[Montserrat] text-sm font-normal hover:opacity-80 transition-opacity bg-white/10 px-2 py-0.5 rounded"
          >
            {language === "en" ? "EN/NE" : "NE/EN"}
          </button>
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-[#BA1A1A] font-[Montserrat] text-sm font-normal hover:opacity-80 transition-opacity"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white font-[Montserrat] text-sm font-normal hover:opacity-80 transition-opacity"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>

      {/* Main navbar */}
      <nav className="w-full bg-[#FBF9F5] border-b border-[#C1C8C1]">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 lg:gap-6">
          {/* Brand Logo */}
          <Link
            to="/homepage"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-[#1B5E40] flex items-center justify-center flex-shrink-0">
              <svg
                width="22"
                height="19"
                viewBox="0 0 22 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.51288 19C4.06288 19 3.66288 18.8625 3.31288 18.5875C2.96288 18.3125 2.72121 17.9583 2.58788 17.525L0.0378788 8.275C-0.0454545 7.95833 0.00871213 7.66667 0.200379 7.4C0.392045 7.13333 0.654545 7 0.987879 7H5.73788L10.1379 0.45C10.2212 0.316667 10.3379 0.208333 10.4879 0.125C10.6379 0.0416667 10.7962 0 10.9629 0C11.1295 0 11.2879 0.0416667 11.4379 0.125C11.5879 0.208333 11.7045 0.316667 11.7879 0.45L16.1879 7H20.9879C21.3212 7 21.5837 7.13333 21.7754 7.4C21.967 7.66667 22.0212 7.95833 21.9379 8.275L19.3879 17.525C19.2545 17.9583 19.0129 18.3125 18.6629 18.5875C18.3129 18.8625 17.9129 19 17.4629 19H4.51288ZM10.9879 15C11.5379 15 12.0087 14.8042 12.4004 14.4125C12.792 14.0208 12.9879 13.55 12.9879 13C12.9879 12.45 12.792 11.9792 12.4004 11.5875C12.0087 11.1958 11.5379 11 10.9879 11C10.4379 11 9.96704 11.1958 9.57538 11.5875C9.18371 11.9792 8.98788 12.45 8.98788 13C8.98788 13.55 9.18371 14.0208 9.57538 14.4125C9.96704 14.8042 10.4379 15 10.9879 15ZM8.16288 7H13.7879L10.9629 2.8L8.16288 7Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-[#1B5E40] font-[Montserrat] text-2xl font-bold leading-8 hidden sm:block">
              Pathivara
            </span>
          </Link>

          {/* Search Bar - grows in the middle */}
          <div
            className="flex-1 max-w-[592px] mx-auto hidden md:block"
            ref={searchContainerRef}
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717973]"
                size={18}
              />
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                onFocus={() => {
                  if (catalogSearch.trim()) setSearchDropdownOpen(true);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-[#E2EAE3] rounded-full text-sm text-[#1D1B20] placeholder:text-[#6B7280] font-[Montserrat] font-normal focus:outline-none focus:ring-2 focus:ring-[#1B5E40]/30"
              />
              {searchDropdownOpen && previewProducts.length > 0 && (
                <SearchDropdown
                  query={catalogSearch}
                  products={previewProducts}
                  aliasMatch={aliasMatch}
                  totalCount={previewTotalCount}
                  onSelectProduct={(productId) => {
                    setSearchDropdownOpen(false);
                    navigate(`/view-product?id=${productId}`);
                  }}
                  onViewAll={() => {
                    setSearchDropdownOpen(false);
                    // Search term handles the navigation correctly in home page
                    navigate("/homepage");
                  }}
                />
              )}
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden text-[#414943] font-[Montserrat] text-base font-medium whitespace-nowrap lg:flex items-center gap-6 mx-0 flex-shrink-0">
            <Link to="/cart" className="hover:text-[#1B5E40] transition-colors">
              {t("nav.cart")}
            </Link>
            <Link
              to="/myorder"
              className="hover:text-[#1B5E40] transition-colors"
            >
              {t("nav.myOrders")}
            </Link>
            <Link
              to="/track"
              className="hover:text-[#1B5E40] transition-colors"
            >
              {t("nav.trackOrder")}
            </Link>
            <button
              ref={notifBtnRef}
              onClick={() => {
                setProfileOpen(false);
                if (user && notificationsEnabled === "pending") {
                  openNotificationPrompt();
                  return;
                }
                setNotificationsOpen((open) => !open);
                loadNotifications();
              }}
              className="relative p-1 hover:opacity-80 transition-opacity"
            >
              <svg
                width="17"
                height="21"
                viewBox="0 0 17 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 17.85V15.75H2.125V8.4C2.125 6.9475 2.56771 5.66125 3.45312 4.54125C4.33854 3.40375 5.48958 2.66 6.90625 2.31V1.575C6.90625 1.1375 7.05677 0.769999 7.35781 0.472499C7.67656 0.1575 8.05729 0 8.5 0C8.94271 0 9.31458 0.1575 9.61563 0.472499C9.93438 0.769999 10.0938 1.1375 10.0938 1.575V2.31C11.5104 2.66 12.6615 3.40375 13.5469 4.54125C14.4323 5.66125 14.875 6.9475 14.875 8.4V15.75H17V17.85H0ZM8.5 21C7.91563 21 7.41094 20.7987 6.98594 20.3962C6.57865 19.9762 6.375 19.4775 6.375 18.9H10.625C10.625 19.4775 10.4125 19.9762 9.9875 20.3962C9.58021 20.7987 9.08438 21 8.5 21ZM4.25 15.75H12.75V8.4C12.75 7.245 12.3339 6.25625 11.5016 5.43375C10.6693 4.61125 9.66875 4.2 8.5 4.2C7.33125 4.2 6.33073 4.61125 5.49844 5.43375C4.66615 6.25625 4.25 7.245 4.25 8.4V15.75Z"
                  fill="#1D1B20"
                />
              </svg>
              {notifications.some((item) => !item.read) && (
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#BA1A1A]" />
              )}
            </button>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-white border border-[#C1C8C1]/20 flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="#1D1B20"
                  />
                </svg>
              </button>
              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    marginTop: 16,
                    zIndex: 50,
                    width: 260,
                    borderRadius: 16,
                    border: "1px solid #E2EAE3",
                    background: "#FAFAF8",
                    padding: 16,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {/* Verified wholesale badge — only shown for verified_wholesale */}
                  {user?.role === "verified_wholesale" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#EAF4ED",
                        borderRadius: 12,
                        padding: "10px 14px",
                        border: "1px solid #C6E9D2",
                      }}
                    >
                      {/* Checkmark badge */}
                      <span
                        style={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#1B5E40",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1B5E40",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        Verified wholesale buyer
                      </span>
                    </div>
                  )}

                  {/* Edit Profile button */}
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#1B5E40",
                      color: "#FFFFFF",
                      borderRadius: 10,
                      padding: "13px 20px",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "background 0.18s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#154d34")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#1B5E40")
                    }
                  >
                    {t("nav.editProfile")}
                    {/* Pencil icon */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {notificationsOpen && (
            <div
              ref={notifPanelRef}
              className="absolute right-4 top-22 z-50 w-80 rounded-xl border border-[#C1C8C1] bg-white p-3 shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <strong className="text-sm">{t("nav.notifications")}</strong>
                <button
                  onClick={async () => {
                    await apiRequest("/orders/notifications/read", {
                      method: "PUT",
                      headers: authHeader(
                        localStorage.getItem("pathivara_token"),
                      ),
                    });
                    loadNotifications();
                  }}
                  className="text-xs text-primary"
                >
                  {t("nav.markAllRead")}
                </button>
              </div>

              {notifications.length ? (
                <div className="max-h-96 overflow-y-auto overscroll-contain">
                  {notifications.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => openNotification(item)}
                      disabled={!item.link}
                      className={`block w-full border-t border-[#E2EAE3] py-3 pr-1 text-left text-sm transition-colors ${item.read ? "text-[#717973]" : "text-[#1B1C1A]"} ${item.link ? "cursor-pointer hover:bg-[#F4FBF4]" : "cursor-default"}`}
                    >
                      <span className="flex items-start gap-2">
                        {!item.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#BA1A1A]" />
                        )}
                        <span className="min-w-0">
                          <span className="block font-semibold">
                            {item.title}
                          </span>
                          <span className="block line-clamp-2">
                            {item.message}
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="p-3 text-sm text-[#717973]">
                  {t("nav.noNotifications")}
                </p>
              )}
            </div>
          )}

          {/* Mobile right section */}
          <div className="flex items-center gap-3 ml-auto lg:hidden">
            <button className="p-1 text-[#414943]">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-1 text-[#414943]">
              <ShoppingCart size={20} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#414943]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717973]"
              size={16}
            />
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#E2EAE3] rounded-full text-sm text-[#1D1B20] placeholder:text-[#6B7280] font-[Montserrat] focus:outline-none focus:ring-2 focus:ring-[#1B5E40]/30"
            />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#C1C8C1] bg-[#FBF9F5] px-4 py-4 flex flex-col gap-4">
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              {t("nav.cart")}
            </Link>
            <Link
              to="/myorder"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              {t("nav.myOrders")}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              {t("nav.trackOrder")}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2"
            >
              {t("nav.about")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
