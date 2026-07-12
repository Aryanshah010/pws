import { useAdminStore } from "../../store/adminStore";
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl p-6 border border-[#C1C8C1]/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={22} />
        </div>
        <ArrowRight
          size={16}
          className="text-[#707972] opacity-0 group-hover:opacity-100 transition mt-1"
        />
      </div>
      <div>
        <p className="text-3xl font-bold text-[#1b1c1a] leading-tight">
          {value}
        </p>
        <p className="text-sm font-semibold text-[#404943] mt-1">{label}</p>
        {sub && <p className="text-xs text-[#707972] mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

function ActivityRow({ label, time, badge, badgeColor }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#C1C8C1]/30 last:border-0">
      <div>
        <p className="text-sm font-medium text-[#1b1c1a]">{label}</p>
        <p className="text-xs text-[#707972] mt-0.5">{time}</p>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { users, wholesaleRequests, payments, products } = useAdminStore();

  const totalUsers = users.length;
  const activeWholesale = users.filter((u) => u.role === "wholesale").length;
  const pendingWholesale = wholesaleRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const approvedPayments = payments.filter(
    (p) => p.status === "approved",
  ).length;

  const totalProducts = products.length;
  const lowStock = products.filter(
    (p) => p.stock === "LOW STOCK" || p.stock === "OUT OF STOCK",
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#707972] mt-1">
          Welcome back, Admin. Here's what needs your attention.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          sub="Registered customers"
          color="bg-[#E2EAE3] text-[#1b5e40]"
          to="/admin/users"
        />
        <StatCard
          icon={Store}
          label="Wholesale Buyers"
          value={activeWholesale}
          sub={`${pendingWholesale} pending approval`}
          color="bg-[#ffdcbc] text-[#895100]"
          to="/admin/wholesale"
        />
        <StatCard
          icon={CreditCard}
          label="Pending Payments"
          value={pendingPayments}
          sub="Awaiting verification"
          color="bg-[#ffdad6] text-[#ba1a1a]"
          to="/admin/payments"
        />
        <StatCard
          icon={ShoppingBag}
          label="Payments Approved"
          value={approvedPayments}
          sub="All time"
          color="bg-[#aef1ca]/40 text-[#1b5e40]"
          to="/admin/payments"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={totalProducts}
          sub="In catalogue"
          color="bg-[#E2EAE3] text-[#1b5e40]"
          to="/admin/products"
        />
        <StatCard
          icon={Package}
          label="Low/Out of Stock"
          value={lowStock}
          sub="Needs attention"
          color="bg-[#ffdad6] text-[#ba1a1a]"
          to="/admin/products"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Wholesale */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#C1C8C1]/40">
            <h2 className="font-bold text-[#1b1c1a] text-base">
              Wholesale Requests
            </h2>
            <Link
              to="/admin/wholesale"
              className="text-xs font-semibold text-[#1b5e40] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-6 py-1">
            {wholesaleRequests.slice(0, 4).map((req) => (
              <ActivityRow
                key={req.id}
                label={`${req.shopName} — ${req.name}`}
                time={`Submitted ${req.submittedDate} · ${req.businessType}`}
                badge={req.status}
                badgeColor={
                  req.status === "pending"
                    ? "bg-[#ffdcbc] text-[#895100]"
                    : req.status === "approved"
                      ? "bg-[#aef1ca] text-[#00452b]"
                      : "bg-[#ffdad6] text-[#ba1a1a]"
                }
              />
            ))}
            {wholesaleRequests.length === 0 && (
              <p className="text-sm text-[#707972] py-4 text-center">
                No requests yet.
              </p>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#C1C8C1]/40">
            <h2 className="font-bold text-[#1b1c1a] text-base">
              Payment Verifications
            </h2>
            <Link
              to="/admin/payments"
              className="text-xs font-semibold text-[#1b5e40] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-6 py-1">
            {payments.slice(0, 4).map((pay) => (
              <ActivityRow
                key={pay.id}
                label={`${pay.orderId} — ${pay.customerName}`}
                time={`${pay.amount} · ${pay.method} · ${pay.submittedDate}`}
                badge={pay.status}
                badgeColor={
                  pay.status === "pending"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : "bg-[#aef1ca] text-[#00452b]"
                }
              />
            ))}
            {payments.length === 0 && (
              <p className="text-sm text-[#707972] py-4 text-center">
                No payments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
