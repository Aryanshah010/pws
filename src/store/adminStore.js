import { create } from "zustand";

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: 1,
    name: "Aarav Sharma",
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
    customerPhone: "9841234567",
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
    customerPhone: "9852345678",
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
    customerPhone: "9874567890",
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
    customerPhone: "9863456789",
    amount: "Rs. 760",
    method: "eSewa",
    proofAvailable: false,
    submittedDate: "2025-07-09",
    status: "approved",
    items: ["Honey 250g x1"],
  },
];

// ─────────────────────────────────────────────
// Products Mock Data
// ─────────────────────────────────────────────

const MOCK_PRODUCTS = [
  {
    id: "P-001",
    name: "Mustard Oil 1L",
    price: 160,
    oldPrice: 185,
    description:
      "Pure cold-pressed mustard oil, extracted from premium mustard seeds. Rich in aroma and natural nutrients, perfect for traditional cooking.",
    stock: "IN STOCK",
    stockQty: 240,
    category: "Oil",
    image: null,
    unit: "1L PET Bottle",
    grade: "A",
    shelfLife: "12 Months",
    origin: "Terai, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 9, price: 160 },
      { minQty: 10, maxQty: 49, price: 150 },
      { minQty: 50, maxQty: null, price: 145 },
    ],
    createdAt: "2024-10-01",
  },
  {
    id: "P-002",
    name: "Mustard Oil 5L",
    price: 400,
    oldPrice: null,
    description:
      "Economy 5-litre pack of cold-pressed mustard oil. Ideal for bulk buyers and wholesale customers.",
    stock: "IN STOCK",
    stockQty: 80,
    category: "Oil",
    image: null,
    unit: "5L HDPE Jar",
    grade: "A",
    shelfLife: "12 Months",
    origin: "Terai, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 9, price: 400 },
      { minQty: 10, maxQty: 49, price: 380 },
      { minQty: 50, maxQty: null, price: 360 },
    ],
    createdAt: "2024-10-01",
  },
  {
    id: "P-003",
    name: "Tea Box",
    price: 320,
    oldPrice: null,
    description:
      "Premium CTC tea sourced from Ilam's high-altitude gardens. Bold flavour, rich colour.",
    stock: "LOW STOCK",
    stockQty: 14,
    category: "Beverages",
    image: null,
    unit: "250g Box",
    grade: "Premium",
    shelfLife: "18 Months",
    origin: "Ilam, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 19, price: 320 },
      { minQty: 20, maxQty: null, price: 300 },
    ],
    createdAt: "2024-11-15",
  },
  {
    id: "P-004",
    name: "Rice 25kg",
    price: 2100,
    oldPrice: 2350,
    description:
      "Medium-grain white rice, milled fresh from Terai farms. Soft texture, ideal for everyday meals.",
    stock: "LOW STOCK",
    stockQty: 9,
    category: "Rice",
    image: null,
    unit: "25kg Bora",
    grade: "A",
    shelfLife: "12 Months",
    origin: "Chitwan, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 4, price: 2100 },
      { minQty: 5, maxQty: null, price: 2000 },
    ],
    createdAt: "2025-01-10",
  },
  {
    id: "P-005",
    name: "Flour 10kg",
    price: 720,
    oldPrice: null,
    description:
      "Fine-milled all-purpose wheat flour. Great for bread, roti, and baked goods.",
    stock: "OUT OF STOCK",
    stockQty: 0,
    category: "Flour",
    image: null,
    unit: "10kg Pack",
    grade: "B",
    shelfLife: "6 Months",
    origin: "Rupandehi, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 9, price: 720 },
      { minQty: 10, maxQty: null, price: 690 },
    ],
    createdAt: "2025-02-20",
  },
  {
    id: "P-006",
    name: "Sugar 5kg",
    price: 475,
    oldPrice: null,
    description: "Refined white sugar, ideal for household and commercial use.",
    stock: "IN STOCK",
    stockQty: 120,
    category: "Essentials",
    image: null,
    unit: "5kg Bag",
    grade: "A",
    shelfLife: "24 Months",
    origin: "Bara, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 9, price: 475 },
      { minQty: 10, maxQty: null, price: 455 },
    ],
    createdAt: "2025-03-05",
  },
  {
    id: "P-007",
    name: "Dal 5kg",
    price: 650,
    oldPrice: null,
    description:
      "Locally sourced lentils, handpicked and cleaned. High protein, no added preservatives.",
    stock: "IN STOCK",
    stockQty: 55,
    category: "Dal",
    image: null,
    unit: "5kg Bag",
    grade: "A",
    shelfLife: "12 Months",
    origin: "Parsa, Nepal",
    pricingTiers: [
      { minQty: 1, maxQty: 9, price: 650 },
      { minQty: 10, maxQty: null, price: 620 },
    ],
    createdAt: "2025-04-01",
  },
];

let nextProductId = 8;

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useAdminStore = create((set) => ({
  users: MOCK_USERS,
  wholesaleRequests: MOCK_WHOLESALE_REQUESTS,
  payments: MOCK_PAYMENTS,
  products: MOCK_PRODUCTS,

  // ── Wholesale actions ─────────────────────

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

  rejectWholesale: (requestId) =>
    set((state) => ({
      wholesaleRequests: state.wholesaleRequests.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" } : r,
      ),
    })),

  // ── Payment actions ───────────────────────

  approvePayment: (paymentId) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === paymentId ? { ...p, status: "approved" } : p,
      ),
    })),

  rejectPayment: (paymentId) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === paymentId ? { ...p, status: "rejected" } : p,
      ),
    })),

  // ── Product actions ───────────────────────

  addProduct: (productData) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...productData,
          id: `P-${String(nextProductId++).padStart(3, "0")}`,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ],
    })),

  updateProduct: (id, productData) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...productData } : p,
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
