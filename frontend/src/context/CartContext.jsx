import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// ── Toast notification helper ─────────────────────────────────────────────────
let toastTimeout;
const showToast = (setToast, message, type = 'success') => {
  clearTimeout(toastTimeout);
  setToast({ message, type, visible: true });
  toastTimeout = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('boutique_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  useEffect(() => {
    localStorage.setItem('boutique_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const normalizeId = (product) => product._id || product.id;

  const addToCart = useCallback((product) => {
    const pid = normalizeId(product);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === pid);
      if (existing) {
        showToast(setToast, `${product.name} quantity updated!`);
        return prev.map(item =>
          item.id === pid ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const numPrice = typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
        : product.price;
      showToast(setToast, `${product.name} added to bag!`);
      return [...prev, { ...product, id: pid, price: numPrice, quantity: 1, size: product.size || 'One Size' }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + change;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  }, []);

  const addToWishlist = useCallback((product) => {
    const pid = normalizeId(product);
    setWishlistItems(prev => {
      if (prev.find(item => item.id === pid)) {
        showToast(setToast, `${product.name} is already in your wishlist!`, 'info');
        return prev;
      }
      const numPrice = typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
        : product.price;
      showToast(setToast, `${product.name} added to wishlist!`);
      return [...prev, { ...product, id: pid, price: numPrice }];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      wishlistItems, addToWishlist, removeFromWishlist,
    }}>
      {children}

      {/* Toast Notification */}
      <div
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 99999,
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          transform: toast.visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: toast.visible ? 1 : 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{
          background: toast.type === 'info' ? 'rgba(59,130,246,0.95)' : 'rgba(34,197,94,0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(12px)',
          maxWidth: 300,
        }}>
          🛍️ {toast.message}
        </div>
      </div>
    </CartContext.Provider>
  );
};
