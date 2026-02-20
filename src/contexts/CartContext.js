import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

const CART_STORAGE_KEY = 'accvaultng_cart';
const CART_VERSION = '1.0'; // For future data migrations

// Import debug utilities in development (commented out to avoid runtime issues)
// if (process.env.NODE_ENV === 'development') {
//   import('../utils/cartDebug');
// }

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartData = loadFromLocalStorage(CART_STORAGE_KEY, { items: [], version: CART_VERSION });
    
    // Handle data migration if needed
    if (Array.isArray(savedCartData)) {
      // Old format - just an array of items
      setCartItems(savedCartData);
    } else if (savedCartData && Array.isArray(savedCartData.items)) {
      // New format - object with items and version
      setCartItems(savedCartData.items);
    }
    
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      const cartData = {
        items: cartItems,
        version: CART_VERSION,
        lastUpdated: new Date().toISOString()
      };
      saveToLocalStorage(CART_STORAGE_KEY, cartData);
    }
  }, [cartItems, isLoading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage immediately
    removeFromLocalStorage(CART_STORAGE_KEY);
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get effective available stock for a product (actual stock - items in cart)
  const getEffectiveAvailableStock = (productId, actualStock) => {
    const cartQuantity = getCartItemQuantity(productId);
    return Math.max(0, actualStock - cartQuantity);
  };

  // Check if a product can be added to cart
  const canAddToCart = (productId, actualStock, requestedQuantity = 1) => {
    const currentCartQuantity = getCartItemQuantity(productId);
    return (currentCartQuantity + requestedQuantity) <= actualStock;
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemQuantity,
    getCartTotal,
    getCartItemsCount,
    getEffectiveAvailableStock,
    canAddToCart,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};