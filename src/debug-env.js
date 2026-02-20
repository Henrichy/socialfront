// Debug environment variables
console.log('🔍 Environment Debug Info:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('REACT_APP_PAYSTACK_PUBLIC_KEY:', process.env.REACT_APP_PAYSTACK_PUBLIC_KEY);

// Export for use in components
export const debugEnv = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    paystackKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY
  };
};