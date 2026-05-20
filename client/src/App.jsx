import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Offers from './pages/Offers.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOffers from './pages/AdminOffers.jsx';
import AdminServices from './pages/AdminServices.jsx';
import AdminSettings from './pages/AdminSettings.jsx';

function AdminRoute({ children }) {
  const { admin } = useApp();
  return admin.loggedIn ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const { translation } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/products"
            element={<AdminRoute><AdminProducts /></AdminRoute>}
          />
          <Route
            path="/admin/offers"
            element={<AdminRoute><AdminOffers /></AdminRoute>}
          />
          <Route
            path="/admin/services"
            element={<AdminRoute><AdminServices /></AdminRoute>}
          />
          <Route
            path="/admin/settings"
            element={<AdminRoute><AdminSettings /></AdminRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
