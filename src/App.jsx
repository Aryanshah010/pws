import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import LanguageModal from "./components/ui/LanguageModal";
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
      <LanguageModal />
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
