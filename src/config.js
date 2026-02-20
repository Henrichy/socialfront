// Environment-based API Configuration
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

export const API_BASE_URL = 'https://social-1-ukw2.onrender.com';
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_live_4b6f0e6c3e8a9f2d1c5b7a8e9f0d1c2b';

console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('API Base URL:', API_BASE_URL);
console.log('Paystack Key:', PAYSTACK_PUBLIC_KEY ? 'Set' : 'Not Set');

export default {
  API_BASE_URL,
  PAYSTACK_PUBLIC_KEY
};