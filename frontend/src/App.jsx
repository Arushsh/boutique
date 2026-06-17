import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api/axios';
import { useAuth } from './context/AuthContext';

import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import ShopByCategory from './components/ShopByCategory';
import ProductShowcase from './components/ProductShowcase';
import PromoBanner from './components/PromoBanner';
import TrendingProducts from './components/TrendingProducts';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import InstagramGallery from './components/InstagramGallery';
import Footer from './components/Footer';

// Customer Pages
import NewArrivals from './pages/NewArrivals';
import Collections from './pages/Collections';
import Story from './pages/Story';
import Lookbook from './pages/Lookbook';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Accessories from './pages/Accessories';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

// Guard: admin-only routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <Hero />
      <main>
        <FeaturedCollections />
        <ShopByCategory />
        <ProductShowcase />
        
        {settings?.saleActive && (
          <PromoBanner
            headline={settings.saleHeadline}
            subheadline={settings.saleSubheadline}
            ctaText={settings.saleCtaText}
            image={settings.saleImage}
          />
        )}
        
        <TrendingProducts />
        <Testimonials />
        <PromoBanner
          headline="Exclusive Festive Collection Launch"
          subheadline="Discover Elegant Styles Crafted For Celebrations"
          ctaText="View Collection"
          image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
          reverse={true}
        />
        <Newsletter />
        <InstagramGallery />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/accessories" element={<Accessories />} />
          <Route path="/story" element={<Story />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
