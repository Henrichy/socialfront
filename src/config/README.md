# Configuration Management

This folder contains the application configuration organized by environment.

## 📁 Folder Structure

```
config/
├── environments/
│   ├── index.js          # Main configuration manager
│   ├── development.js    # Development environment
│   ├── production.js     # Production environment
│   ├── staging.js        # Staging environment
│   └── local.js          # Local development
├── api.js                # API endpoints configuration
└── README.md             # This file
```

## 🔧 Environment Configuration

### How It Works

1. **Environment Detection**: Automatically detects current environment
2. **Fallback System**: Uses environment variables if available, otherwise uses config files
3. **Debug Logging**: Shows configuration in development mode

### Environment Priority

1. `REACT_APP_ENVIRONMENT` environment variable
2. `NODE_ENV` (production/development)
3. Default to 'development'

### Configuration Files

#### `development.js`
- Local development with backend on localhost:5000
- Debug mode enabled
- Uses live Paystack keys (for testing)

#### `production.js`
- Production deployment configuration
- Points to production backend URL
- Debug mode disabled
- Uses live Paystack keys

#### `staging.js`
- Staging environment for testing
- Points to staging backend URL
- Debug mode enabled
- Should use test Paystack keys

#### `local.js`
- Local development alternative
- Uses test Paystack keys
- Debug mode enabled

## 🚀 Usage

### Import Configuration
```javascript
import { appConfig, API_BASE_URL, PAYSTACK_PUBLIC_KEY } from './config/environments';

// Use specific values
console.log(API_BASE_URL);

// Use full config object
console.log(appConfig.ENVIRONMENT);
```

### Override with Environment Variables
```bash
# Set specific environment
REACT_APP_ENVIRONMENT=staging npm start

# Override API URL
REACT_APP_API_BASE_URL=https://custom-backend.com npm start

# Override Paystack key
REACT_APP_PAYSTACK_PUBLIC_KEY=pk_test_custom_key npm start
```

## 🔍 Debugging

### View Current Configuration
Add `?debug=true` to your URL to see the debug panel:
```
http://localhost:3000?debug=true
```

### Console Logging
Configuration is automatically logged in development mode:
```javascript
🔧 App Configuration: {
  environment: 'development',
  apiBaseUrl: 'http://localhost:5000',
  paystackKey: 'Set',
  debug: true,
  configSource: 'Config Files'
}
```

## 🌍 Deployment Environments

### Development
```bash
npm start
# Uses: development.js
```

### Production Build
```bash
npm run build
# Uses: production.js
```

### Staging
```bash
REACT_APP_ENVIRONMENT=staging npm run build
# Uses: staging.js
```

### Custom Environment
```bash
REACT_APP_ENVIRONMENT=custom npm start
# Falls back to: development.js
```

## 🔒 Security Notes

- ✅ Configuration files are safe to commit (no secrets)
- ✅ Real secrets should be set via environment variables
- ✅ Test keys can be included in staging/local configs
- ⚠️ Never commit real API keys to Git

## 📝 Adding New Environments

1. Create new config file: `environments/myenv.js`
2. Add to environments object in `index.js`
3. Set `REACT_APP_ENVIRONMENT=myenv` to use it

Example:
```javascript
// environments/testing.js
export const testingConfig = {
  API_BASE_URL: 'https://test-api.example.com',
  PAYSTACK_PUBLIC_KEY: 'pk_test_testing_key',
  ENVIRONMENT: 'testing',
  DEBUG: true
};
```