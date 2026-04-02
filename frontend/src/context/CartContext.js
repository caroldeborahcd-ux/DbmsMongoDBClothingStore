import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); setCartCount(0); return; }
    try {
      const { data } = await API.get('/cart');
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) { console.error(err); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    try {
      const { data } = await API.post('/cart/add', { productId, size, color, quantity });
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${itemId}`);
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) { console.error(err); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await API.put(`/cart/update/${itemId}`, { quantity });
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch (err) { console.error(err); }
  };

  const cartTotal = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
