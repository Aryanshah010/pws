import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/store';
import { Check } from 'lucide-react';

export default function LanguageModal() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, onboarded, setOnboarded } = useStore();
  
  // Local state to manage active selection before committing
  const [selectedLang, setSelectedLang] = useState(language);

  // If user is already onboarded, don't show the modal
  if (onboarded) return null;

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleProceed = () => {
    setOnboarded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-md animate-fade-in">
      <div className="w-full max-w-md bg-surface-lowest rounded-lg border border-outline-variant shadow-level-4 p-xl flex flex-col gap-lg transform hover:scale-[1.01] transition-transform duration-long ease-standard">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-headline-md mx-auto mb-md shadow-level-2">
            P
          </div>
          <h2 className="font-sans text-headline-sm font-bold text-on-surface">
            {t('onboarding.title')}
          </h2>
          <p className="font-sans text-body-md text-on-surface-variant mt-xs">
            {t('onboarding.subtitle')}
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-1 gap-md">
          
          {/* English Option */}
          <button
            onClick={() => handleSelect('en')}
            className={`flex items-center justify-between p-lg rounded-md border-2 text-left font-sans transition-all duration-medium ease-standard ${
              selectedLang === 'en'
                ? 'border-primary bg-primary-fixed/30 text-on-primary-fixed'
                : 'border-outline-variant hover:border-outline text-on-surface-variant'
            }`}
          >
            <div className="flex flex-col gap-xs">
              <span className="text-body-lg font-bold">English</span>
              <span className="text-label-sm opacity-85">Browse in English</span>
            </div>
            {selectedLang === 'en' && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-level-1">
                <Check size={16} />
              </div>
            )}
          </button>

          {/* Nepali Option */}
          <button
            onClick={() => handleSelect('ne')}
            className={`flex items-center justify-between p-lg rounded-md border-2 text-left font-sans transition-all duration-medium ease-standard ${
              selectedLang === 'ne'
                ? 'border-primary bg-primary-fixed/30 text-on-primary-fixed'
                : 'border-outline-variant hover:border-outline text-on-surface-variant'
            }`}
          >
            <div className="flex flex-col gap-xs">
              <span className="text-body-lg font-bold">नेपाली (Nepali)</span>
              <span className="text-label-sm opacity-85">नेपाली भाषामा ब्राउज गर्नुहोस्</span>
            </div>
            {selectedLang === 'ne' && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shadow-level-1">
                <Check size={16} />
              </div>
            )}
          </button>

        </div>

        {/* Action Button */}
        <button
          onClick={handleProceed}
          className="w-full py-md rounded-default bg-primary text-white font-sans text-label-md font-bold hover:bg-primary-container shadow-level-1 hover:shadow-level-2 hover:-translate-y-px active:translate-y-0 transition-all duration-medium ease-standard mt-sm"
        >
          {t('onboarding.proceed')}
        </button>

      </div>
    </div>
  );
}
