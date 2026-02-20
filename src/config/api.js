// API Configuration
import config from '../config';

const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: config.API_BASE_URL,
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me'
    },
    
    // Accounts/Products
    ACCOUNTS: {
      LIST: '/api/accounts',
      VALIDATE_CART: '/api/accounts/validate-cart'
    },
    
    // Categories
    CATEGORIES: {
      LIST: '/api/categories'
    },
    
    // Payments
    PAYMENTS: {
      CREATE_ORDER: '/api/payments/create-order',
      VERIFY_PAYMENT: '/api/payments/verify-payment',
      MY_ORDERS: '/api/payments/my-orders'
    },
    
    // User Stats
    USER: {
      STATS: '/api/user/stats',
      ORDERS: '/api/user/orders'
    },
    
    // Wallet
    WALLET: {
      BALANCE: '/api/wallet/balance',
      ADD_FUNDS: '/api/wallet/add-funds',
      TRANSACTIONS: '/api/wallet/transactions'
    },
    
    // Admin
    ADMIN: {
      ACCOUNTS: '/api/admin/accounts',
      CATEGORIES: '/api/admin/categories',
      USERS: '/api/admin/users',
      STATS: '/api/admin/stats'
    },
    
    // Crypto Settings
    CRYPTO: {
      SETTINGS: '/api/crypto-settings'
    },
    
    // WhatsApp Payment
    WHATSAPP: {
      SETTINGS: '/api/whatsapp-payment/settings',
      GENERATE_CODE: '/api/whatsapp-payment/generate-code',
      PENDING_CODES: '/api/whatsapp-payment/pending-codes',
      VERIFY_CODE: '/api/whatsapp-payment/verify-code',
      CODE_STATUS: '/api/whatsapp-payment/code-status'
    }
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get endpoint
export const getEndpoint = (category, action) => {
  return API_CONFIG.ENDPOINTS[category]?.[action] || '';
};

// Export the full API URL for a specific endpoint
export const getApiUrl = (category, action) => {
  const endpoint = getEndpoint(category, action);
  return buildApiUrl(endpoint);
};

// Export base URL for direct use
export const API_BASE_URL_EXPORT = API_CONFIG.BASE_URL;

export default API_CONFIG;