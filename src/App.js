import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import AddFunds from './pages/AddFunds';
import Support from './pages/Support';
import Guidelines from './pages/Guidelines';
import OrderSuccess from './pages/OrderSuccess';
import ContinuePayment from './pages/ContinuePayment';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EnvDebug from './components/EnvDebug';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed', // Purple
      light: '#a855f7',
      dark: '#5b21b6',
    },
    secondary: {
      main: '#ffffff', // White
      dark: '#f8fafc',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  // Show debug info when URL contains ?debug=true
  const showDebug = window.location.search.includes('debug=true');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              {showDebug && <EnvDebug />}
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/add-funds" 
                  element={
                    <ProtectedRoute>
                      <AddFunds />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/support" element={<Support />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/continue-payment" element={<ContinuePayment />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
