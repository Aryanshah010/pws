import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        logo: "Pathivara",
        about: "About Us",
        contact: "Contact",
        login: "Log In",
        register: "Register",
        logout: "Log Out"
      },
      onboarding: {
        title: "Welcome to Pathivara",
        subtitle: "Select your preferred language to continue",
        english: "English",
        nepali: "नेपाली (Nepali)",
        proceed: "Proceed"
      },
      hero: {
        title: "Pathivara",
        subtitle: "Staples made simple, prices made fair",
        description: "We source directly to provide the best value grains, oils, and grocery staples. Convenient pickup at our Jhapa hub with live stock status and transparent role-based pricing.",
        cta: "Browse Catalogue"
      },
      benefits: {
        title: "Why Choose Pathivara?",
        card1_title: "Live Stock Badging",
        card1_desc: "Real-time stock status (In Stock, Low Stock, Out of Stock) visible on every item. No surprise order cancellations.",
        card2_title: "Role-Based Tiered Pricing",
        card2_desc: "Special volume discounts and wholesale rates for registered Kirana shop owners, and fair retail rates for households.",
        card3_title: "Zero Delivery Complexity",
        card3_desc: "Enjoy pickup-only convenience. Choose a fixed pickup slot, pay at pickup or via digital transfer, and avoid delivery fees."
      },
      shelf: {
        title: "Browse Staples",
        oils: "Oils & Ghee",
        grains: "Rice & Grains",
        lentils: "Lentils & Pulses",
        spices: "Spices & Herbs",
        all: "See All"
      },
      footer: {
        copyright: "© 2026 Pathivara Staples. All Rights Reserved.",
        contact_us: "Contact Us",
        phone: "Phone: +977-9800000000",
        viber: "Viber",
        whatsapp: "WhatsApp"
      }
    }
  },
  ne: {
    translation: {
      header: {
        logo: "पाथिभरा",
        about: "हाम्रो बारेमा",
        contact: "सम्पर्क",
        login: "लॉग इन",
        register: "दर्ता गर्नुहोस्",
        logout: "लॉग आउट"
      },
      onboarding: {
        title: "पाथिभरामा स्वागत छ",
        subtitle: "अगाडि बढ्नको लागि आफ्नो रोजाइको भाषा छनौट गर्नुहोस्",
        english: "English",
        nepali: "नेपाली (Nepali)",
        proceed: "अगाडि बढ्नुहोस्"
      },
      hero: {
        title: "पाथिभरा",
        subtitle: "खाद्यान्न सरल, मूल्य उचित",
        description: "हामी उत्कृष्ट मूल्यमा खाद्यान्न, तेल, र दालहरू सिधै उपलब्ध गराउँदछौं। वास्तविक स्टक विवरण र स्पष्ट मूल्यका साथ झापाको हाम्रो केन्द्रबाट पिकअप गर्नुहोस्।",
        cta: "सामानहरू हेर्नुहोस्"
      },
      benefits: {
        title: "पाथिभरा किन रोज्ने?",
        card1_title: "लाइभ स्टक विवरण",
        card1_desc: "प्रत्येक सामानमा वास्तविक स्टक विवरण (उपलब्ध, थोरै, वा सकिएको) तुरुन्तै हेर्नुहोस्। अर्डर रद्द हुने चिन्ता छैन।",
        card2_title: "भूमिका अनुसारको मूल्य",
        card2_desc: "किराना पसलहरूका लागि थोक मूल्य र मात्रा अनुसार छुट, र घरधुरीका लागि उचित खुद्रा मूल्य।",
        card3_title: "सजिलो पिकअप मात्र",
        card3_desc: "चेकआउट गर्दा पिकअप समय रोज्नुहोस्। कुनै डेलिभरी शुल्क लाग्दैन, सजिलो नगद वा डिजिटल भुक्तानी गर्न सकिनेछ।"
      },
      shelf: {
        title: "खाद्यान्न कोटिहरू",
        oils: "तेल र घ्यू",
        grains: "चामल र अन्न",
        lentils: "दाल र गेडागुडी",
        spices: "मसाला र सुख्खा खानेकुरा",
        all: "सबै हेर्नुहोस्"
      },
      footer: {
        copyright: "© २०२६ पाथिभरा स्टेपल्स। सर्वाधिकार सुरक्षित।",
        contact_us: "सम्पर्क गर्नुहोस्",
        phone: "फोन: +९७७-९८००००००००",
        viber: "भाइबर",
        whatsapp: "व्हाट्सएप"
      }
    }
  }
};

const savedLang = localStorage.getItem('pathivara_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
