import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import LanguageModal from './components/ui/LanguageModal';
import LandingPage from './features/home/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Products from './features/home/Products';
import About from './features/home/About';
import Contact from './features/home/Contact';
import './config/i18n'; // Initialize i18next translation configurations

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
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
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Layout><Products /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;