import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) {
        return prev.map(p =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => setCart(cart.filter(p => p._id !== id));
  const clearCart = () => setCart([]);

  return (
  <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
    {children}
  </CartContext.Provider>
);
};
