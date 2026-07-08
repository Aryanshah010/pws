import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
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
import PaymentProofPage from "./features/checkout/PaymentQrPage";
import PaymentConfirm from "./features/checkout/PaymentProofSubmitted";
import PaymentProofSubmitted from "./features/checkout/PaymentProofSubmitted";
import TrackOrderPage from "./features/order/TrackOrder";
import OrderSuccess from "./features/order/OrderSuccess";
import MyOrder from "./features/order/MyOrderPage";
import BasketReview from "./features/order/BasketReview";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}

function Layout2({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/language-model" element={<LanguageModal />} />
        <Route
          path="/wholesale-pending"
          element={
            <Layout>
              <WholesalePending />
            </Layout>
          }
        />
        <Route
          path="/wholesale-form"
          element={
            <Layout>
              <WholesaleForm />
            </Layout>
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
          path="/track-order"
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
      </Routes>
    </Router>
  );
}

export default App;
