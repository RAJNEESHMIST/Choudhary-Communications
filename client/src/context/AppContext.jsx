import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const AppContext = createContext(null);

const defaultSettings = {
  whatsapp: 'https://wa.me/917891753753',
  phone: '+91 78917 53753',
  address: 'Near City Center, Main Road, Jaipur',
  mapLink: 'https://www.google.com/maps',
  timings: '10:00 AM - 9:00 PM, Mon-Sat'
};

const sampleProducts = [
  {
    _id: 'p1',
    name: 'Samsung Galaxy M14',
    price: 12499,
    brand: 'Samsung',
    category: 'Smartphones',
    shortDescription: 'Long-lasting battery with fast charging.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=70',
    availability: 'In Stock',
    featured: true
  },
  {
    _id: 'p2',
    name: 'Realme Earbuds 3',
    price: 1799,
    brand: 'Realme',
    category: 'Earbuds',
    shortDescription: 'Crystal clear sound and lightweight fit.',
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155221c2f3?auto=format&fit=crop&w=900&q=70',
    availability: 'In Stock',
    featured: true
  }
];

const sampleOffers = [
  {
    _id: 'o1',
    title: 'Festive Smartphone Sale',
    description: 'Up to 35% off on selected phones for a limited time.',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3c5b36b7b48c?auto=format&fit=crop&w=900&q=70',
    startDate: '2026-05-10',
    endDate: '2026-07-01',
    active: true
  }
];

const sampleServices = [
  {
    _id: 's1',
    title: 'Screen Replacement',
    description: 'Fast, reliable screen replacement for phones.',
    icon: '🔧'
  },
  {
    _id: 's2',
    title: 'Recharge',
    description: 'Instant prepaid and postpaid recharge support.',
    icon: '⚡'
  }
];

const credentials = {
  username: import.meta.env.VITE_ADMIN_USER || 'admin',
  password: import.meta.env.VITE_ADMIN_PASS || 'shopkeeper'
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translation, setTranslation] = useState(en);
  const [settings, setSettings] = useState(defaultSettings);
  const [products, setProducts] = useState(sampleProducts);
  const [offers, setOffers] = useState(sampleOffers);
  const [services, setServices] = useState(sampleServices);
  const [admin, setAdmin] = useState({ loggedIn: false, username: '', loginTime: null });
  const [loading, setLoading] = useState(false);

  const SESSION_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

  useEffect(() => {
    const storedLang = localStorage.getItem('shopLanguage');
    const storedAdmin = localStorage.getItem('shopAdmin');
    if (storedLang) setLanguage(storedLang);
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        const loginTime = adminData.loginTime ? new Date(adminData.loginTime).getTime() : Date.now();
        const now = Date.now();
        
        if (now - loginTime > SESSION_TIMEOUT_MS) {
          // Session expired
          localStorage.removeItem('shopAdmin');
        } else {
          setAdmin({ ...adminData, loginTime });
        }
      } catch (error) {
        console.warn(error);
      }
    }
  }, []);

  useEffect(() => {
    if (!admin.loggedIn || !admin.loginTime) return;
    
    const checkSessionTimeout = setInterval(() => {
      const loginTime = new Date(admin.loginTime).getTime();
      const now = Date.now();
      
      if (now - loginTime > SESSION_TIMEOUT_MS) {
        setAdmin({ loggedIn: false, username: '', loginTime: null });
        localStorage.removeItem('shopAdmin');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSessionTimeout);
  }, [admin, SESSION_TIMEOUT_MS]);

  useEffect(() => {
    setTranslation(language === 'hi' ? hi : en);
    localStorage.setItem('shopLanguage', language);
  }, [language]);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, offerRes, serviceRes, settingRes] = await Promise.all([
          fetch(`${apiBase}/api/products`),
          fetch(`${apiBase}/api/offers`),
          fetch(`${apiBase}/api/services`),
          fetch(`${apiBase}/api/settings`)
        ]);

        if (productRes.ok) {
          const productPayload = await productRes.json();
          setProducts(Array.isArray(productPayload) ? productPayload : productPayload.data || sampleProducts);
        }

        if (offerRes.ok) {
          const offerPayload = await offerRes.json();
          setOffers(Array.isArray(offerPayload) ? offerPayload : offerPayload.data || sampleOffers);
        }

        if (serviceRes.ok) {
          const servicePayload = await serviceRes.json();
          setServices(Array.isArray(servicePayload) ? servicePayload : servicePayload.data || sampleServices);
        }

        if (settingRes.ok) {
          const settingPayload = await settingRes.json();
          setSettings(settingPayload?.data || settingPayload || defaultSettings);
        }
      } catch (error) {
        console.warn('Using sample data due to API fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds to stay in sync with DB
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      translation,
      settings,
      setSettings,
      products,
      setProducts,
      offers,
      setOffers,
      services,
      setServices,
      admin,
      setAdmin,
      credentials,
      loading,
      setLoading,
      refreshProducts: async () => {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        try {
          const res = await fetch(`${apiBase}/api/products`);
          if (res.ok) {
            const refreshPayload = await res.json();
            setProducts(Array.isArray(refreshPayload) ? refreshPayload : refreshPayload.data || sampleProducts);
          }
        } catch (error) {
          console.warn('Failed to refresh products:', error);
        }
      }
    }),
    [language, translation, settings, products, offers, services, admin, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
