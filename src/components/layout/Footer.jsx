import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#E2EAE3] border-t border-[#C1C8C1] py-lg px-md transition-colors duration-medium ease-standard">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-md text-on-surface-variant">
        
        {/* Left Side: Copyright & Logo */}
        <div className="flex flex-col items-center md:items-start gap-xs">
          <div className="flex items-center gap-xs">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-label-sm">
              P
            </div>
            <span className="font-sans text-label-md font-bold text-primary">
              {t('header.logo')} Staples
            </span>
          </div>
          <span className="font-sans text-label-sm text-on-surface-variant">
            {t('footer.copyright')}
          </span>
        </div>

        {/* Middle: Links */}
        <div className="flex items-center gap-md text-label-sm font-semibold">
          <a href="/terms" className="hover:text-primary transition-colors duration-medium ease-standard">
            Terms of Service
          </a>
          <span className="text-[#C1C8C1]">•</span>
          <a href="/privacy" className="hover:text-primary transition-colors duration-medium ease-standard">
            Privacy Policy
          </a>
          <span className="text-[#C1C8C1]">•</span>
          <a href="/help" className="hover:text-primary transition-colors duration-medium ease-standard">
            Help Center
          </a>
        </div>

        {/* Right Side: Communication Channels */}
        <div className="flex items-center gap-sm">
          <span className="hidden lg:inline font-sans text-label-sm font-bold mr-xs">
            {t('footer.contact_us')}:
          </span>
          
          {/* Phone Call */}
          <a
            href="tel:+9779800000000"
            className="w-10 h-10 rounded-full bg-white border border-[#C1C8C1] flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:scale-105 transition-all duration-medium ease-standard shadow-level-1"
            title="Call Us"
          >
            <Phone size={18} />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/9779800000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-[#C1C8C1] flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:scale-105 transition-all duration-medium ease-standard shadow-level-1"
            title="WhatsApp Us"
          >
            <MessageSquare size={18} />
          </a>

          {/* Viber (Simulated using Lucide-react and localized link) */}
          <a
            href="viber://chat?number=+9779800000000"
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-container hover:scale-105 transition-all duration-medium ease-standard shadow-level-1"
            title="Viber Us"
          >
            <span className="font-sans text-label-sm font-bold">V</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
