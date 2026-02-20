// Environment Configuration Manager
import developmentConfig from './development';
import productionConfig from './production';
import stagingConfig from './staging';
import localConfig from './local';

// Determine current environment
const getEnvironment = () => {
  // Check for custom environment variable first
  if (process.env.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }
  
  // Check if we're in production build
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  
  // Default to development
  return 'development';
};

// Environment configurations
const environments = {
  development: developmentConfig,
  production: productionConfig,
  staging: stagingConfig,
  local: localConfig
};

// Get current environment config
const currentEnvironment = getEnvironment();
const config = environments[currentEnvironment] || environments.development;

// Fallback to environment variables if config values are missing
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || config.API_BASE_URL;
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || config.PAYSTACK_PUBLIC_KEY;
export const ENVIRONMENT = currentEnvironment;
export const DEBUG = config.DEBUG;

// Export full config object
export const appConfig = {
  API_BASE_URL,
  PAYSTACK_PUBLIC_KEY,
  ENVIRONMENT,
  DEBUG,
  ...config
};

// Log configuration in development/debug mode
if (DEBUG || process.env.NODE_ENV === 'development') {
  console.log('🔧 App Configuration:', {
    environment: ENVIRONMENT,
    apiBaseUrl: API_BASE_URL,
    paystackKey: PAYSTACK_PUBLIC_KEY ? 'Set' : 'Missing',
    debug: DEBUG,
    configSource: process.env.REACT_APP_API_BASE_URL ? 'Environment Variables' : 'Config Files'
  });
}

// Export individual configurations for direct access
export { developmentConfig, productionConfig, stagingConfig, localConfig };

export default appConfig;