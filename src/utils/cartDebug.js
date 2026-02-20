// Debug utilities for cart localStorage functionality

export const debugCart = () => {
  const cartData = localStorage.getItem('accvaultng_cart');
  console.log('=== CART DEBUG INFO ===');
  console.log('Raw localStorage data:', cartData);
  
  if (cartData) {
    try {
      const parsed = JSON.parse(cartData);
      console.log('Parsed cart data:', parsed);
      console.log('Items count:', parsed.items ? parsed.items.length : 'N/A');
      console.log('Version:', parsed.version || 'N/A');
      console.log('Last updated:', parsed.lastUpdated || 'N/A');
    } catch (error) {
      console.error('Error parsing cart data:', error);
    }
  } else {
    console.log('No cart data found in localStorage');
  }
  console.log('=======================');
};

export const clearCartDebug = () => {
  localStorage.removeItem('accvaultng_cart');
  console.log('Cart cleared from localStorage');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.debugCart = debugCart;
  window.clearCartDebug = clearCartDebug;
}