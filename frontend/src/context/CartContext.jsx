import { createContext, useState, useEffect } from 'react';

const CART_KEY = 'noor_cart';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize from localStorage — runs once on mount
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Clear cart state when AuthContext fires logout event
  useEffect(() => {
    const handleClear = () => setCart([]);
    window.addEventListener('cart:clear', handleClear);
    return () => window.removeEventListener('cart:clear', handleClear);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) {
        return prev.map(p =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p._id !== id));

  // delta = +1 to increase, -1 to decrease; auto-removes item if quantity reaches 0
  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev
        .map(p => p._id === id ? { ...p, quantity: p.quantity + delta } : p)
        .filter(p => p.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
