import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import NotificationPrompt from "./components/layout/NotificationPrompt";
import LanguageModal from "./features/home/LanguageModal";
import LandingPage from "./features/home/LandingPage";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/home/HomePage";
import About from "./features/home/About";
import Contact from "./features/home/Contact";
import "./config/i18n"; // Initialize i18next translation configurations
import ForgetPassword from "./features/auth/ForgetPassword";
import OtpVerification from "./features/auth/Otp";
import ChangePassword from "./features/auth/ChangePassword";
import MainNavbar from "./components/layout/MainNav";
import WholesaleForm from "./features/wholesale/WholesaleForm";
import WholesalePending from "./features/wholesale/WholesalePending";
import WholesaleApproved from "./features/wholesale/WholesaleApprove";
import ViewProductDetailIS from "./features/products/ViewProductDetailsIS";
import CartPage from "./features/checkout/CartPage";
import ProductDetailOS from "./features/products/VIewProductDetailsOS";
import Checkout from "./features/checkout/CheckoutPage";
import PaymentQr from "./features/checkout/PaymentQrPage";
import PaymentProofSubmitted from "./features/checkout/PaymentProofSubmitted";
import TrackOrderPage from "./features/order/TrackOrder";
import OrderSuccess from "./features/order/OrderSuccess";
import MyOrder from "./features/order/MyOrderPage";
import BasketReview from "./features/order/BasketReview";
import CustomBasketTemplate from "./features/order/CustomBasket";
import SubmitComplaint from "./features/order/Complain";
import AccountActive from "./features/auth/AccountActive";
import AdminLayout from "./components/layout/AdminLayout";
import AdminOverviewPage from "./features/admin/AdminOverviewPage";
import AdminUsersPage from "./features/admin/AdminUsersPage";
import AdminWholesalePage from "./features/admin/AdminWholesalePage";
import AdminPaymentsPage from "./features/admin/AdminPaymentsPage";
import AdminProductsPage from "./features/admin/AdminProductsPage";
import AdminOrdersPage from "./features/admin/AdminOrdersPage";
import AdminSettingsPage from "./features/admin/AdminSettingsPage";
import ProfilePage from "./features/auth/ProfilePage";
import { useStore } from "./store/store";
import { apiRequest, authHeader } from "./services/api";

function AuthSession() {
  const { token, setUser, logout } = useStore();

  useEffect(() => {
    if (!token) return undefined;

    const refresh = async () => {
      try {
        const data = await apiRequest("/auth/me", {
          headers: authHeader(token),
        });
        setUser(data.user, token);
      } catch {
        logout();
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, 30000);
    return () => window.clearInterval(intervalId);
  }, [token, setUser, logout]);

  return null;
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="grow">{children}</main>
      <Footer />
      <NotificationPrompt />
    </div>
  );
}

function Layout2({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="grow">{children}</main>
      <Footer />
      <NotificationPrompt />
    </div>
  );
}

/**
 * FirstVisitGate: For first-time visitors hitting /login or /register,
 * show the language selection screen first. Once they proceed, show the real page.
 */
function FirstVisitGate({ children }) {
  const { onboarded } = useStore();
  if (!onboarded)
    return (
      <Layout>
        <LanguageModal />
      </Layout>
    );
  return children;
}

function App() {
  return (
    <Router>
      <AuthSession />
      {/* Single toast host for the whole app. Without this, every toast()
          call in the codebase renders nothing at all. */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <FirstVisitGate>
              <Login />
            </FirstVisitGate>
          }
        />
        <Route
          path="/register"
          element={
            <FirstVisitGate>
              <Register />
            </FirstVisitGate>
          }
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/account-active"
          element={
            <Layout2>
              <AccountActive />
            </Layout2>
          }
        />
        <Route
          path="/wholesale-pending"
          element={
            <Layout2>
              <WholesalePending />
            </Layout2>
          }
        />
        <Route
          path="/wholesale-form"
          element={
            <Layout2>
              <WholesaleForm />
            </Layout2>
          }
        />
        <Route
          path="/homepage"
          element={
            <Layout2>
              <Home />
            </Layout2>
          }
        />
        <Route
          path="/view-product"
          element={
            <Layout2>
              <ViewProductDetailIS />
            </Layout2>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout2>
              <ProfilePage />
            </Layout2>
          }
        />
        <Route
          path="/view-product-os"
          element={
            <Layout2>
              <ProductDetailOS />
            </Layout2>
          }
        />
        <Route
          path="/wholesale-approved"
          element={
            <Layout2>
              <WholesaleApproved />
            </Layout2>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout2>
              <CartPage />
            </Layout2>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout2>
              <Checkout />
            </Layout2>
          }
        />
        <Route
          path="/payment"
          element={
            <Layout2>
              <PaymentQr />
            </Layout2>
          }
        />
        <Route
          path="/payment-proof"
          element={
            <Layout2>
              <PaymentProofSubmitted />
            </Layout2>
          }
        />
        <Route
          path="/order-success"
          element={
            <Layout2>
              <OrderSuccess />
            </Layout2>
          }
        />
        <Route
          path="/track"
          element={
            <Layout2>
              <TrackOrderPage />
            </Layout2>
          }
        />
        <Route
          path="/myorder"
          element={
            <Layout2>
              <MyOrder />
            </Layout2>
          }
        />
        <Route
          path="/basket-review"
          element={
            <Layout2>
              <BasketReview />
            </Layout2>
          }
        />
        <Route
          path="/custom-basket"
          element={
            <Layout2>
              <CustomBasketTemplate />
            </Layout2>
          }
        />
        <Route
          path="/complain"
          element={
            <Layout2>
              <SubmitComplaint />
            </Layout2>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />

        {/* ── Admin Routes ─────────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminOverviewPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/wholesale"
          element={
            <AdminLayout>
              <AdminWholesalePage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminLayout>
              <AdminPaymentsPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
