// Configuration Validator
import { appConfig } from './environments';

// Required configuration keys
const REQUIRED_CONFIG = [
  'API_BASE_URL',
  'PAYSTACK_PUBLIC_KEY',
  'ENVIRONMENT'
];

// Validation rules
const VALIDATION_RULES = {
  API_BASE_URL: (value) => {
    if (!value) return 'API_BASE_URL is required';
    if (!value.startsWith('http')) return 'API_BASE_URL must start with http:// or https://';
    return null;
  },
  
  PAYSTACK_PUBLIC_KEY: (value) => {
    if (!value) return 'PAYSTACK_PUBLIC_KEY is required';
    if (!value.startsWith('pk_')) return 'PAYSTACK_PUBLIC_KEY must start with pk_';
    return null;
  },
  
  ENVIRONMENT: (value) => {
    if (!value) return 'ENVIRONMENT is required';
    const validEnvs = ['development', 'production', 'staging', 'local'];
    if (!validEnvs.includes(value)) {
      return `ENVIRONMENT must be one of: ${validEnvs.join(', ')}`;
    }
    return null;
  }
};

// Validate configuration
export const validateConfig = (config = appConfig) => {
  const errors = [];
  const warnings = [];

  // Check required fields
  REQUIRED_CONFIG.forEach(key => {
    if (!config[key]) {
      errors.push(`Missing required configuration: ${key}`);
    }
  });

  // Run validation rules
  Object.entries(VALIDATION_RULES).forEach(([key, validator]) => {
    const error = validator(config[key]);
    if (error) {
      errors.push(error);
    }
  });

  // Environment-specific warnings
  if (config.ENVIRONMENT === 'production' && config.DEBUG) {
    warnings.push('DEBUG mode is enabled in production');
  }

  if (config.ENVIRONMENT !== 'production' && config.PAYSTACK_PUBLIC_KEY?.includes('live')) {
    warnings.push('Using live Paystack key in non-production environment');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  };
};

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  const validation = validateConfig();
  
  if (!validation.isValid) {
    console.error('❌ Configuration Validation Failed:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration Warnings:', validation.warnings);
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ Configuration validation passed');
  }
}

export default validateConfig;