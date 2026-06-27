import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { Globe, User, LogOut } from 'lucide-react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage, user, logout } = useStore();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/85 backdrop-blur-md border-b border-outline-variant shadow-level-1 transition-all duration-medium ease-standard">
      <div className="max-w-7xl mx-auto px-md h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-sm group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-headline-sm shadow-level-2 group-hover:scale-105 transition-transform duration-medium ease-standard">
            P
          </div>
          <span className="font-sans text-headline-sm font-bold text-primary tracking-wide">
            {t('header.logo')}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-lg">
          <Link to="/about" className="font-sans text-body-md font-medium text-on-surface-variant hover:text-primary transition-colors duration-medium ease-standard">
            {t('header.about')}
          </Link>
          <Link to="/contact" className="font-sans text-body-md font-medium text-on-surface-variant hover:text-primary transition-colors duration-medium ease-standard">
            {t('header.contact')}
          </Link>
          {user && (
            <Link to="/orders" className="font-sans text-body-md font-medium text-on-surface-variant hover:text-primary transition-colors duration-medium ease-standard">
              My Orders
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-md">
          
          {/* Language Selector Pill */}
          <div className="flex items-center p-1 bg-surface-container rounded-full border border-outline-variant">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-sm py-1 rounded-full text-label-sm font-semibold transition-all duration-medium ease-standard ${
                language === 'en'
                  ? 'bg-primary text-white shadow-level-1'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ne')}
              className={`px-sm py-1 rounded-full text-label-sm font-semibold transition-all duration-medium ease-standard ${
                language === 'ne'
                  ? 'bg-primary text-white shadow-level-1'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              ने
            </button>
          </div>

          {/* User Section / Login Button */}
          {user ? (
            <div className="flex items-center gap-sm">
              <div className="flex items-center gap-xs text-body-md font-semibold text-on-surface">
                <User size={18} className="text-primary" />
                <span className="hidden sm:inline">{user.name}</span>
                {user.type === 'shop' && (
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container px-xs py-0.5 rounded-sm font-bold tracking-wider uppercase">
                    Wholesale
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-sm text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-all duration-medium ease-standard"
                title={t('header.logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-sm">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline px-md py-sm font-sans text-label-md font-bold text-primary hover:text-primary-container transition-colors duration-medium ease-standard"
              >
                {t('header.login')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-md py-sm rounded-default bg-primary text-white hover:bg-primary-container font-sans text-label-md font-bold shadow-level-1 hover:shadow-level-2 transition-all duration-medium ease-standard"
              >
                {t('header.register')}
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
