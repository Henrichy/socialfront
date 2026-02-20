import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  IconButton,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  AccountBalanceWallet,
  Payment as PaymentIcon,
  CurrencyBitcoin,
  WhatsApp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';
import { PAYSTACK_PUBLIC_KEY } from '../config';
import CryptoPaymentModal from '../components/CryptoPaymentModal';
import WhatsAppPaymentModal from '../components/WhatsAppPaymentModal';

const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Quick select amounts
  const quickAmounts = [1000, 2000, 5000, 10000];

  useEffect(() => {
    fetchWalletBalance();
    
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WALLET', 'BALANCE'));
      if (response.data.success) {
        setWalletBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const handlePaystackPayment = () => {
    const fundingAmount = Number(amount);
    
    if (!fundingAmount || fundingAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fundingAmount < 100) {
      setError('Minimum funding amount is ₦100');
      return;
    }

    if (fundingAmount > 1000000) {
      setError('Maximum funding amount is ₦1,000,000');
      return;
    }

    if (!user?.email) {
      setError('Please ensure your account has a valid email address');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      setError('Paystack is not configured. Please contact support.');
      return;
    }

    if (!window.PaystackPop) {
      setError('Payment system is not loaded. Please refresh the page and try again.');
      return;
    }

    // Calculate total amount in kobo (Paystack expects amount in kobo - multiply by 100)
    const totalAmountInKobo = Math.round(fundingAmount * 100);
    
    console.log('Paystack payment setup:');
    console.log('Amount (Naira):', fundingAmount);
    console.log('Amount (Kobo):', totalAmountInKobo);
    console.log('User email:', user?.email);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: totalAmountInKobo,
      currency: 'NGN',
      ref: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'], // Enable all payment channels
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: user?.name || 'Guest User'
          },
          {
            display_name: "Funding Amount",
            variable_name: "funding_amount",
            value: `₦${fundingAmount.toLocaleString()}`
          },
          {
            display_name: "Purpose",
            variable_name: "purpose",
            value: 'Wallet Funding'
          }
        ]
      },
      callback: function(response) {
        console.log('Paystack payment successful:', response);
        setLoading(true);
        
        // Add funds to wallet
        handlePaymentSuccess(response.reference, 'paystack', fundingAmount);
      },
      onClose: function() {
        console.log('Paystack payment cancelled');
      }
    });

    handler.openIframe();
  };

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
    setSelectedAmount(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedAmount(Number(value));
  };

  const handlePaymentSuccess = async (reference, method, fundingAmount) => {
    try {
      setLoading(true);
      
      // For WhatsApp bank transfer, wallet is already funded by backend during verification
      // So we just refresh the balance and show success message
      if (method === 'whatsapp-bank') {
        setSuccess(`₦${fundingAmount.toLocaleString()} has been added to your wallet!`);
        setAmount('');
        setSelectedAmount(null);
        await fetchWalletBalance(); // Refresh balance
        
        // Close any open modals
        setCryptoModalOpen(false);
        setWhatsappModalOpen(false);
        setLoading(false);
        return;
      }
      
      // For other payment methods (Paystack, Crypto), call the add-funds endpoint
      const response = await apiClient.post(getEndpoint('WALLET', 'ADD_FUNDS'), {
        amount: fundingAmount,
        paymentReference: reference,
        paymentMethod: method
      });

      if (response.data.success) {
        setSuccess(`₦${fundingAmount.toLocaleString()} has been added to your wallet!`);
        setAmount('');
        setSelectedAmount(null);
        await fetchWalletBalance(); // Refresh balance
        
        // Close any open modals
        setCryptoModalOpen(false);
        setWhatsappModalOpen(false);
      } else {
        setError('Failed to add funds. Please contact support.');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      setError('Failed to add funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = () => {
    const fundingAmount = Number(amount);
    
    if (!fundingAmount || fundingAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fundingAmount < 100) {
      setError('Minimum funding amount is ₦100');
      return;
    }

    if (fundingAmount > 1000000) {
      setError('Maximum funding amount is ₦1,000,000');
      return;
    }

    setCryptoModalOpen(true);
  };

  const handleWhatsAppPayment = () => {
    const fundingAmount = Number(amount);
    
    if (!fundingAmount || fundingAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (fundingAmount < 100) {
      setError('Minimum funding amount is ₦100');
      return;
    }

    if (fundingAmount > 1000000) {
      setError('Maximum funding amount is ₦1,000,000');
      return;
    }

    setWhatsappModalOpen(true);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/marketplace')} 
            sx={{ mr: 2, color: '#7c3aed' }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet sx={{ color: '#7c3aed' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Wallet Funding
            </Typography>
          </Box>
        </Box>

        {/* Current Balance Card */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
          <CardContent sx={{ color: 'white', textAlign: 'center', py: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Current Wallet Balance
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ₦{walletBalance.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Main Funding Card */}
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
              Add Funds to Your Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              Top up your wallet to continue enjoying our services
            </Typography>

            {/* Amount Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                Amount (₦)
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
                type="number"
                inputProps={{ min: 100, max: 1000000 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    '&:hover fieldset': {
                      borderColor: '#7c3aed',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7c3aed',
                    },
                  },
                }}
              />
            </Box>

            {/* Quick Select */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Select
              </Typography>
              <Grid container spacing={2}>
                {quickAmounts.map((quickAmount) => (
                  <Grid item xs={6} key={quickAmount}>
                    <Button
                      fullWidth
                      variant={selectedAmount === quickAmount ? "contained" : "outlined"}
                      onClick={() => handleQuickSelect(quickAmount)}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: selectedAmount === quickAmount ? '#7c3aed' : 'transparent',
                        borderColor: '#7c3aed',
                        color: selectedAmount === quickAmount ? 'white' : '#7c3aed',
                        '&:hover': {
                          backgroundColor: selectedAmount === quickAmount ? '#5b21b6' : 'rgba(124, 58, 237, 0.05)',
                          borderColor: '#5b21b6',
                        },
                      }}
                    >
                      ₦{quickAmount.toLocaleString()}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

         {/* Payment Method Buttons */}
<Box sx={{ mb: 3 }}>
  <Typography
    variant="body1"
    sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
  >
    Choose Payment Method
  </Typography>

  {/* Payment Buttons Grid */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
      mb: 2,
      width: '100%',
    }}
  >
    {/* Paystack Payment */}
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handlePaystackPayment}
      disabled={!amount || Number(amount) <= 0 || loading}
      startIcon={<PaymentIcon />}
      sx={{
        py: 2.5,
        borderRadius: 3,
        fontSize: '0.95rem',
        fontWeight: 600,
        borderColor: '#7c3aed',
        color: '#7c3aed',
        borderWidth: 2,
        minHeight: '64px',
        textTransform: 'none',
        '&:hover': {
          borderColor: '#5b21b6',
          backgroundColor: 'rgba(124, 58, 237, 0.05)',
          borderWidth: 2,
        },
      }}
    >
      Pay via Paystack
    </Button>

    {/* Bank Transfer */}
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handleWhatsAppPayment}
      disabled={!amount || Number(amount) <= 0 || loading}
      startIcon={<WhatsApp />}
      sx={{
        py: 2.5,
        borderRadius: 3,
        fontSize: '0.95rem',
        fontWeight: 600,
        borderColor: '#10b981',
        color: '#10b981',
        borderWidth: 2,
        minHeight: '64px',
        textTransform: 'none',
        '&:hover': {
          borderColor: '#059669',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderWidth: 2,
        },
      }}
    >
      Bank Transfer
    </Button>

    {/* Crypto Payment */}
    <Button
      fullWidth
      variant="outlined"
      size="large"
      onClick={handleCryptoPayment}
      disabled={!amount || Number(amount) <= 0 || loading}
      startIcon={<CurrencyBitcoin />}
      sx={{
        py: 2.5,
        borderRadius: 3,
        fontSize: '0.95rem',
        fontWeight: 600,
        borderColor: '#f59e0b',
        color: '#f59e0b',
        borderWidth: 2,
        minHeight: '64px',
        textTransform: 'none',
        gridColumn: { xs: '1', sm: 'span 2' },
        '&:hover': {
          borderColor: '#d97706',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderWidth: 2,
        },
      }}
    >
      Pay via Crypto
    </Button>
  </Box>
</Box>


            {/* Info Text */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              Minimum: ₦100 • Maximum: ₦1,000,000
            </Typography>
          </CardContent>
        </Card>

        {/* Crypto Payment Modal */}
        <CryptoPaymentModal
          open={cryptoModalOpen}
          onClose={() => setCryptoModalOpen(false)}
          totalAmount={Number(amount)}
          onPaymentSuccess={(reference, method) => handlePaymentSuccess(reference, method, Number(amount))}
          isWalletFunding={true}
        />

        {/* WhatsApp Payment Modal */}
        <WhatsAppPaymentModal
          open={whatsappModalOpen}
          onClose={() => setWhatsappModalOpen(false)}
          cartItems={[]} // Empty for wallet funding
          totalAmount={Number(amount)}
          onPaymentSuccess={(reference) => handlePaymentSuccess(reference, 'whatsapp-bank', Number(amount))}
          isWalletFunding={true}
        />

        {/* Success/Error Snackbars */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default AddFunds;