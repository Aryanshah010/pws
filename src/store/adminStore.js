import { create } from "zustand";

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@gmail.com",
    phone: "9841234567",
    role: "wholesale",
    status: "active",
    joinedDate: "2024-11-12",
    location: "Kathmandu",
    totalOrders: 24,
  },
  {
    id: 2,
    name: "Sita Rai",
    email: "sita.rai@email.com",
    phone: "9852345678",
    role: "regular",
    status: "active",
    joinedDate: "2025-01-04",
    location: "Birtamode, Jhapa",
    totalOrders: 8,
  },
  {
    id: 3,
    name: "Bikram Thapa",
    email: "bikram.t@yahoo.com",
    phone: "9863456789",
    role: "regular",
    status: "active",
    joinedDate: "2025-03-17",
    location: "Pokhara",
    totalOrders: 3,
  },
  {
    id: 4,
    name: "Priya Gurung",
    email: "priya.gurung@gmail.com",
    phone: "9874567890",
    role: "wholesale",
    status: "active",
    joinedDate: "2024-09-22",
    location: "Butwal",
    totalOrders: 41,
  },
  {
    id: 5,
    name: "Roshan Koirala",
    email: "roshan.k@gmail.com",
    phone: "9885678901",
    role: "regular",
    status: "inactive",
    joinedDate: "2025-05-01",
    location: "Biratnagar",
    totalOrders: 1,
  },
  {
    id: 6,
    name: "Manisha Devi",
    email: "manisha.devi@outlook.com",
    phone: "9896789012",
    role: "regular",
    status: "active",
    joinedDate: "2025-06-20",
    location: "Lalitpur",
    totalOrders: 6,
  },
  {
    id: 7,
    name: "Suraj Bhandari",
    email: "suraj.b@gmail.com",
    phone: "9807890123",
    role: "regular",
    status: "pending_wholesale",
    joinedDate: "2025-07-01",
    location: "Chitwan",
    totalOrders: 2,
  },
  {
    id: 8,
    name: "Kamala Shrestha",
    email: "kamala.s@gmail.com",
    phone: "9818901234",
    role: "regular",
    status: "pending_wholesale",
    joinedDate: "2025-07-05",
    location: "Dharan",
    totalOrders: 0,
  },
];

const MOCK_WHOLESALE_REQUESTS = [
  {
    id: "WR-001",
    userId: 7,
    name: "Suraj Bhandari",
    email: "suraj.b@gmail.com",
    phone: "9807890123",
    shopName: "Bhandari General Store",
    location: "Chitwan-4, Bharatpur",
    businessType: "Grocery Shop",
    panVat: "302456789",
    hasPhoto: true,
    submittedDate: "2025-07-01",
    status: "pending",
  },
  {
    id: "WR-002",
    userId: 8,
    name: "Kamala Shrestha",
    email: "kamala.s@gmail.com",
    phone: "9818901234",
    shopName: "Shrestha Retail Mart",
    location: "Dharan-10, Sunsari",
    businessType: "Retail Store",
    panVat: null,
    hasPhoto: false,
    submittedDate: "2025-07-05",
    status: "pending",
  },
  {
    id: "WR-003",
    userId: null,
    name: "Deepak Acharya",
    email: "deepak.a@gmail.com",
    phone: "9829012345",
    shopName: "Acharya Supermart",
    location: "Damak-3, Jhapa",
    businessType: "Supermarket",
    panVat: "415678901",
    hasPhoto: true,
    submittedDate: "2025-07-08",
    status: "pending",
  },
];

const MOCK_PAYMENTS = [
  {
    id: "PAY-2041",
    orderId: "ORD-7812",
    customerName: "Aarav Sharma",
    customerEmail: "aarav@gmail.com",
    amount: "Rs. 4,580",
    method: "eSewa",
    proofAvailable: true,
    submittedDate: "2025-07-10",
    status: "pending",
    items: ["Mustard Oil 5L x2", "Beaten Rice 2kg x3"],
  },
  {
    id: "PAY-2042",
    orderId: "ORD-7813",
    customerName: "Sita Rai",
    customerEmail: "sita.rai@email.com",
    amount: "Rs. 1,220",
    method: "Khalti",
    proofAvailable: true,
    submittedDate: "2025-07-11",
    status: "pending",
    items: ["Ghee 500g x1", "Salt 1kg x2"],
  },
  {
    id: "PAY-2043",
    orderId: "ORD-7814",
    customerName: "Priya Gurung",
    customerEmail: "priya.gurung@gmail.com",
    amount: "Rs. 12,400",
    method: "Bank Transfer",
    proofAvailable: true,
    submittedDate: "2025-07-12",
    status: "pending",
    items: ["Mustard Oil 15L x4", "Flour 10kg x2"],
  },
  {
    id: "PAY-2040",
    orderId: "ORD-7810",
    customerName: "Bikram Thapa",
    customerEmail: "bikram.t@yahoo.com",
    amount: "Rs. 760",
    method: "eSewa",
    proofAvailable: false,
    submittedDate: "2025-07-09",
    status: "approved",
    items: ["Honey 250g x1"],
  },
];

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useAdminStore = create((set) => ({
  users: MOCK_USERS,
  wholesaleRequests: MOCK_WHOLESALE_REQUESTS,
  payments: MOCK_PAYMENTS,

  // Approve wholesale request
  approveWholesale: (requestId) =>
    set((state) => ({
      wholesaleRequests: state.wholesaleRequests.map((r) =>
        r.id === requestId ? { ...r, status: "approved" } : r,
      ),
      users: state.users.map((u) => {
        const req = state.wholesaleRequests.find((r) => r.id === requestId);
        if (req && u.id === req.userId)
          return { ...u, role: "wholesale", status: "active" };
        return u;
      }),
    })),

  // Reject wholesale request
  rejectWholesale: (requestId) =>
    set((state) => ({
      wholesaleRequests: state.wholesaleRequests.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" } : r,
      ),
    })),

  // Approve payment
  approvePayment: (paymentId) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === paymentId ? { ...p, status: "approved" } : p,
      ),
    })),

  // Reject payment
  rejectPayment: (paymentId) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === paymentId ? { ...p, status: "rejected" } : p,
      ),
    })),
}));
