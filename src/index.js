import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import CORS test
import './utils/corsTest';

// Debug environment variables in production
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Development Environment Check:');
  console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
  console.log('Paystack Key:', process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ? 'Set' : 'Missing');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
