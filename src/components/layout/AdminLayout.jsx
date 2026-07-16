import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
  Package,
} from "lucide-react";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/users", label: "All Users", icon: Users },
  { to: "/admin/wholesale", label: "Wholesale Requests", icon: Store },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { token, logout } = useStore();
  const [pendingWholesale, setPendingWholesale] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiRequest("/auth/wholesale-requests", { headers: authHeader(token) }),
      apiRequest("/orders/admin/all", { headers: authHeader(token) }),
    ])
      .then(([wholesale, orders]) => {
        setPendingWholesale(
          wholesale.users.filter((item) => item.wholesaleStatus === "pending")
            .length,
        );
        setPendingPayments(
          orders.orders.filter((item) => item.paymentStatus === "Verifying")
            .length,
        );
      })
      .catch(() => {});
  }, [token]);

  const badges = {
    "/admin/wholesale": pendingWholesale,
    "/admin/payments": pendingPayments,
  };

  return (
    <div className="min-h-screen flex bg-[#F0F4F0]">
      {/* ── Sidebar ─────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-primary transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
              <path
                d="M4.51288 19C4.06288 19 3.66288 18.8625 3.31288 18.5875C2.96288 18.3125 2.72121 17.9583 2.58788 17.525L0.0378788 8.275C-0.0454545 7.95833 0.00871213 7.66667 0.200379 7.4C0.392045 7.13333 0.654545 7 0.987879 7H5.73788L10.1379 0.45C10.2212 0.316667 10.3379 0.208333 10.4879 0.125C10.6379 0.0416667 10.7962 0 10.9629 0C11.1295 0 11.2879 0.0416667 11.4379 0.125C11.5879 0.208333 11.7045 0.316667 11.7879 0.45L16.1879 7H20.9879C21.3212 7 21.5837 7.13333 21.7754 7.4C21.967 7.66667 22.0212 7.95833 21.9379 8.275L19.3879 17.525C19.2545 17.9583 19.0129 18.3125 18.6629 18.5875C18.3129 18.8625 17.9129 19 17.4629 19H4.51288ZM10.9879 15C11.5379 15 12.0087 14.8042 12.4004 14.4125C12.792 14.0208 12.9879 13.55 12.9879 13C12.9879 12.45 12.792 11.9792 12.4004 11.5875C12.0087 11.1958 11.5379 11 10.9879 11C10.4379 11 9.96704 11.1958 9.57538 11.5875C9.18371 11.9792 8.98788 12.45 8.98788 13C8.98788 13.55 9.18371 14.0208 9.57538 14.4125C9.96704 14.8042 10.4379 15 10.9879 15ZM8.16288 7H13.7879L10.9629 2.8L8.16288 7Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-tight block">
              Pathivara
            </span>
            <span className="text-white/50 text-xs font-medium tracking-wide uppercase">
              Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 relative
                ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badges[to] > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#ffa535] text-white text-[10px] font-bold flex items-center justify-center">
                  {badges[to]}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Back to store + Logout */}
        <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
          <Link
            to="/homepage"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <ChevronRight size={16} />
            Back to Store
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Overlay (mobile) ─────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ─────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#C1C8C1]/60 px-4 sm:px-8 h-16 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#E2EAE3] text-[#1b5e40] transition"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[#E2EAE3] text-[#404943] transition">
            <Bell size={20} />
            {pendingWholesale + pendingPayments > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA1A1A]" />
            )}
          </button>
          {/* Admin avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1b5e40] text-white text-sm font-bold flex items-center justify-center select-none">
              A
            </div>
            <span className="hidden sm:block text-sm font-semibold text-[#1b1c1a]">
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
