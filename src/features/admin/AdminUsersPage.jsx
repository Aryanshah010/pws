import { useEffect, useState } from "react";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import { Search, ChevronDown, Users } from "lucide-react";

const ROLE_LABELS = {
  wholesale: { label: "Wholesale", color: "bg-[#ffdcbc] text-[#895100]" },
  regular: { label: "Regular", color: "bg-[#E2EAE3] text-[#404943]" },
  pending_wholesale: {
    label: "Pending WS",
    color: "bg-[#fff8e0] text-[#6b3f00] border border-[#ffa535]/40",
  },
};

const STATUS_LABELS = {
  active: { label: "Active", dot: "bg-[#00452b]" },
  inactive: { label: "Inactive", dot: "bg-[#707972]" },
  pending_wholesale: { label: "Pending", dot: "bg-[#ffa535]" },
};

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hues = [
    "bg-[#aef1ca] text-[#00452b]",
    "bg-[#ffdcbc] text-[#895100]",
    "bg-[#E2EAE3] text-[#1b5e40]",
    "bg-[#c8f0ff] text-[#1a4c6e]",
  ];
  const color = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}
    >
      {initials}
    </div>
  );
}

export default function AdminUsersPage() {
  const { token } = useStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("joinedDate");
  useEffect(() => {
    if (!token) return;
    apiRequest("/auth/admin/users", { headers: authHeader(token) })
      .then((data) =>
        setUsers(
          data.users.map((user) => ({
            id: user.id,
            name: user.fullName,
            phone: user.phone,
            location: user.wholesaleDetails?.shopLocation || "—",
            role:
              user.role === "verified_wholesale"
                ? "wholesale"
                : user.role === "pending_wholesale"
                  ? "pending_wholesale"
                  : "regular",
            status:
              user.wholesaleStatus === "pending"
                ? "pending_wholesale"
                : "active",
            totalOrders: user.totalOrders,
            joinedDate: new Date(user.joinedAt).toLocaleDateString(),
          })),
        ),
      )
      .catch(() => setUsers([]));
  }, [token]);

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q);
      const matchRole =
        roleFilter === "all" ||
        u.role === roleFilter ||
        u.status === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "orders") return b.totalOrders - a.totalOrders;
      return new Date(b.joinedDate) - new Date(a.joinedDate);
    });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1a]">All Users</h1>
          <p className="text-sm text-[#707972] mt-0.5">
            {users.length} registered customers
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707972]"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name, phone, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] placeholder:text-[#707972] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition"
          />
        </div>
        {/* Role filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] font-medium outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="regular">Regular</option>
            <option value="wholesale">Wholesale</option>
            <option value="pending_wholesale">Pending WS</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707972] pointer-events-none"
          />
        </div>
        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] font-medium outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition cursor-pointer"
          >
            <option value="joinedDate">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="orders">Most Orders</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707972] pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="bg-[#F5F3F0] border-b border-[#C1C8C1]/40">
                <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  User
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Phone
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Location
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Role
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Status
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Orders
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C1C8C1]/30">
              {filtered.map((user) => {
                const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.regular;
                const statusInfo =
                  STATUS_LABELS[user.status] || STATUS_LABELS.active;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-[#F5F3F0]/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} />
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1a]">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#404943]">
                      {user.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#404943]">
                      {user.location}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${statusInfo.dot}`}
                        />
                        <span className="text-xs font-medium text-[#404943]">
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#1b1c1a]">
                      {user.totalOrders}
                    </td>
                    <td className="px-4 py-4 text-xs text-[#707972]">
                      {user.joinedDate}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-sm text-[#707972]"
                  >
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#C1C8C1]/30">
          {filtered.map((user) => {
            const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.regular;
            const statusInfo =
              STATUS_LABELS[user.status] || STATUS_LABELS.active;
            return (
              <div key={user.id} className="p-4 flex items-start gap-3">
                <Avatar name={user.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1b1c1a]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#707972]">{user.phone}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleInfo.color}`}
                    >
                      {roleInfo.label}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-[#707972]">
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                      />
                      {statusInfo.label}
                    </span>
                    <span>·</span>
                    <span>{user.location}</span>
                    <span>·</span>
                    <span>{user.totalOrders} orders</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-[#707972]">
              No users match your search.
            </div>
          )}
        </div>
      </div>

      {/* Footer row */}
      <p className="text-xs text-[#707972] text-right">
        Showing {filtered.length} of {users.length} users
      </p>
    </div>
  );
}
