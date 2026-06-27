import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Database, BadgePercent, ShieldAlert, ArrowRight, Activity, Percent, Clock } from 'lucide-react';
import { useStore } from '../../store/store';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language } = useStore();

  const categories = [
    { id: 'oils', name: t('shelf.oils'), color: 'bg-primary-fixed/40 text-on-primary-fixed' },
    { id: 'grains', name: t('shelf.grains'), color: 'bg-secondary-fixed/40 text-on-secondary-fixed' },
    { id: 'lentils', name: t('shelf.lentils'), color: 'bg-error-container/40 text-on-error-container' },
    { id: 'spices', name: t('shelf.spices'), color: 'bg-primary-fixed/40 text-on-primary-fixed' },
  ];

  return (
    <div className="w-full bg-background min-h-screen pb-3xl">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-md py-xl md:py-2xl grid grid-cols-1 md:grid-cols-2 items-center gap-xl">
        
        {/* Left: Text & CTA */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-xs text-primary font-bold text-label-sm uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            Pathivara Jhapa Hub
          </div>
          
          <h1 className="font-sans text-[44px] md:text-[56px] leading-[1.1] font-black text-on-background tracking-tight">
            {t('hero.title')}
          </h1>
          
          <p className="font-sans text-headline-sm font-bold text-primary-container leading-snug">
            {t('hero.subtitle')}
          </p>
          
          <p className="font-sans text-body-lg text-on-surface-variant leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="mt-sm">
            <button
              onClick={() => navigate('/products')}
              className="group px-xl py-lg rounded-default bg-primary text-white font-sans text-label-md font-bold hover:bg-primary-container shadow-level-2 hover:shadow-level-3 hover:translate-y-[-1px] active:translate-y-[0px] flex items-center gap-sm transition-all duration-medium ease-standard"
            >
              {t('hero.cta')}
              <ArrowRight size={18} className="group-hover:translate-x-xs transition-transform duration-medium ease-standard" />
            </button>
          </div>
        </div>

        {/* Right: Decorative Image */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-lg border border-outline-variant bg-[#E8F0E8] overflow-hidden shadow-level-2 transform hover:scale-[1.01] transition-transform duration-long ease-standard">
          <img
            src="/staples_hero.png"
            alt="Organic grocery staples"
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
        </div>

      </section>

      {/* 2. Key Benefits Section */}
      <section className="bg-surface-low border-y border-outline-variant py-2xl px-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-xl">
            <h2 className="font-sans text-headline-md md:text-headline-lg font-bold text-on-surface">
              {t('benefits.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            
            {/* Card 1: Live Stock Visibility */}
            <div className="bg-surface-lowest rounded-md border border-outline-variant p-lg shadow-level-1 hover:shadow-level-2 transition-all duration-medium ease-standard flex flex-col gap-md">
              <div className="w-12 h-12 rounded-default bg-[#BFEDD0] flex items-center justify-center text-primary-container">
                <Activity size={24} />
              </div>
              <div className="flex flex-col gap-sm">
                <h3 className="font-sans text-headline-sm font-bold text-on-surface">
                  {t('benefits.card1_title')}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                  {t('benefits.card1_desc')}
                </p>
              </div>
            </div>

            {/* Card 2: Role-Based Pricing */}
            <div className="bg-surface-lowest rounded-md border border-outline-variant p-lg shadow-level-1 hover:shadow-level-2 transition-all duration-medium ease-standard flex flex-col gap-md">
              <div className="w-12 h-12 rounded-default bg-[#FFDCBC] flex items-center justify-center text-[#895100]">
                <Percent size={24} />
              </div>
              <div className="flex flex-col gap-sm">
                <h3 className="font-sans text-headline-sm font-bold text-on-surface">
                  {t('benefits.card2_title')}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                  {t('benefits.card2_desc')}
                </p>
              </div>
            </div>

            {/* Card 3: Zero Delivery Complexity */}
            <div className="bg-surface-lowest rounded-md border border-outline-variant p-lg shadow-level-1 hover:shadow-level-2 transition-all duration-medium ease-standard flex flex-col gap-md">
              <div className="w-12 h-12 rounded-default bg-[#FFDBD2] flex items-center justify-center text-[#ba1a1a]">
                <Clock size={24} />
              </div>
              <div className="flex flex-col gap-sm">
                <h3 className="font-sans text-headline-sm font-bold text-on-surface">
                  {t('benefits.card3_title')}
                </h3>
                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">
                  {t('benefits.card3_desc')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Category shelf */}
      <section className="max-w-7xl mx-auto px-md mt-2xl">
        <h2 className="font-sans text-headline-sm md:text-headline-md font-bold text-on-surface mb-lg">
          {t('shelf.title')}
        </h2>
        
        {/* Horizontal Category Shelf Row */}
        <div className="flex items-center gap-md overflow-x-auto pb-sm scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className={`flex items-center gap-sm px-xl py-md rounded-full bg-white border border-outline-variant font-sans text-label-md font-bold hover:border-primary hover:shadow-level-1 whitespace-nowrap transition-all duration-medium ease-standard`}
            >
              <span className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center text-label-sm`}>
                {cat.name.charAt(0)}
              </span>
              {cat.name}
            </button>
          ))}
          
          {/* See All Category */}
          <button
            onClick={() => navigate('/products')}
            className="px-xl py-md rounded-full bg-[#E2EAE3] text-primary border border-[#C1C8C1] font-sans text-label-md font-bold hover:bg-[#D4DFD6] hover:shadow-level-1 whitespace-nowrap transition-all duration-medium ease-standard"
          >
            {t('shelf.all')}
          </button>
        </div>
      </section>

    </div>
  );
}
