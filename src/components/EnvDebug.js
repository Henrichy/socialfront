import React from 'react';
import { appConfig } from '../config/environments';

const EnvDebug = () => {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    ENVIRONMENT: appConfig.ENVIRONMENT,
    API_BASE_URL: appConfig.API_BASE_URL,
    PAYSTACK_PUBLIC_KEY: appConfig.PAYSTACK_PUBLIC_KEY ? 'Set' : 'Missing',
    DEBUG: appConfig.DEBUG,
    BUILD_TIME: new Date().toISOString()
  };

  // Log to console for debugging
  console.log('🔍 Environment Debug Info:', envInfo);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 Environment Debug</h4>
      {Object.entries(envInfo).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  );
};

export default EnvDebug;