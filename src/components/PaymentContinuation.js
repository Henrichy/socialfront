import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Alert,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';

const PaymentContinuation = ({ open, onClose, onPaymentComplete }) => {
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [whatsappSettings, setWhatsappSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (open) {
      fetchWhatsAppSettings();
      
      // Check if there's a payment in progress
      const existingPayment = localStorage.getItem('whatsapp_payment_in_progress');
      if (existingPayment) {
        try {
          const data = JSON.parse(existingPayment);
          setPaymentCode(data.code);
          setPaymentData(data);
        } catch (error) {
          localStorage.removeItem('whatsapp_payment_in_progress');
        }
      }
    }
  }, [open]);

  const fetchWhatsAppSettings = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WHATSAPP', 'SETTINGS'));
      if (response.data.success) {
        setWhatsappSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
    }
  };

  const handleCodeSubmit = async () => {
    if (!paymentCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter your payment code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await apiClient.get(`${getEndpoint('WHATSAPP', 'CODE_STATUS')}/${paymentCode.trim()}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setPaymentData({
          code: data.code,
          totalAmount: data.totalAmount,
          expiresAt: data.expiresAt,
          status: data.status
        });
        
        if (data.status === 'verified') {
          setMessage({ type: 'success', text: 'Payment verified! Your order has been created.' });
          localStorage.removeItem('whatsapp_payment_in_progress');
          
          setTimeout(() => {
            onPaymentComplete(data.order || {
              orderNumber: data.orderNumber,
              paymentMethod: 'whatsapp-bank',
              paymentReference: data.code,
              totalAmount: data.totalAmount
            });
          }, 2000);
        } else if (data.status === 'expired') {
          setMessage({ type: 'error', text: 'Payment code has expired. Please generate a new one from your cart.' });
          localStorage.removeItem('whatsapp_payment_in_progress');
        } else {
          setMessage({ type: 'info', text: 'Payment code found! You can continue with your payment below.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Payment code not found. Please check your code or generate a new one.' });
      }
    } catch (error) {
      console.error('Error checking payment code:', error);
      setMessage({ type: 'error', text: 'Failed to check payment code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData) return;

    setCheckingStatus(true);
    try {
      const response = await apiClient.get(`${getEndpoint('WHATSAPP', 'CODE_STATUS')}/${paymentData.code}`);
      
      if (response.data.success) {
        const status = response.data.data.status;
        
        if (status === 'verified') {
          setMessage({ type: 'success', text: 'Payment verified! Your order has been created.' });
          localStorage.removeItem('whatsapp_payment_in_progress');
          
          setTimeout(() => {
            onPaymentComplete(response.data.data.order || {
              orderNumber: response.data.data.orderNumber,
              paymentMethod: 'whatsapp-bank',
              paymentReference: paymentData.code,
              totalAmount: paymentData.totalAmount
            });
          }, 2000);
        } else if (status === 'expired') {
          setMessage({ type: 'error', text: 'Payment code has expired. Please generate a new one.' });
          localStorage.removeItem('whatsapp_payment_in_progress');
        } else {
          setMessage({ type: 'info', text: 'Payment is still pending verification.' });
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setMessage({ type: 'error', text: 'Failed to check payment status' });
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(''), 2000);
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
        fallbackCopyTextToClipboard(text, fieldName);
      });
    } else {
      fallbackCopyTextToClipboard(text, fieldName);
    }
  };

  const fallbackCopyTextToClipboard = (text, fieldName) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(''), 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <WhatsAppIcon color="success" />
        Continue WhatsApp Payment
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        {/* Payment Code Input */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Enter Your Payment Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the payment code you received earlier to continue your payment.
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Payment Code"
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
                  placeholder="e.g., WA123456ABCD"
                  variant="outlined"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCodeSubmit();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleCodeSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <WhatsAppIcon />}
                >
                  {loading ? 'Checking...' : 'Continue Payment'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {paymentData && whatsappSettings && (
          <Box>
            {/* Payment Code Display */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                Your Payment Code
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {paymentData.code}
                </Typography>
                <IconButton
                  onClick={() => copyToClipboard(paymentData.code, 'code')}
                  color="success"
                >
                  <CopyIcon />
                </IconButton>
                {copiedField === 'code' && (
                  <Chip label="Copied!" color="success" size="small" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Expires: {format(new Date(paymentData.expiresAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Paper>

            {/* Bank Details */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BankIcon />
                  Bank Transfer Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                        <Typography variant="body1" fontWeight="bold">{whatsappSettings.bankName}</Typography>
                      </Box>
                      <IconButton
                        onClick={() => copyToClipboard(whatsappSettings.bankName, 'bankName')}
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Account Name</Typography>
                        <Typography variant="body1" fontWeight="bold">{whatsappSettings.accountName}</Typography>
                      </Box>
                      <IconButton
                        onClick={() => copyToClipboard(whatsappSettings.accountName, 'accountName')}
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Account Number</Typography>
                        <Typography variant="body1" fontWeight="bold">{whatsappSettings.accountNumber}</Typography>
                      </Box>
                      <IconButton
                        onClick={() => copyToClipboard(whatsappSettings.accountNumber, 'accountNumber')}
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Amount to Transfer</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formatCurrency(paymentData.totalAmount)}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => copyToClipboard(paymentData.totalAmount.toString(), 'amount')}
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {whatsappSettings.instructions}
              </Typography>
            </Alert>

            {/* Check Status Button */}
            <Button
              variant="outlined"
              color="success"
              onClick={checkPaymentStatus}
              disabled={checkingStatus}
              startIcon={checkingStatus ? <CircularProgress size={20} /> : <RefreshIcon />}
              fullWidth
            >
              {checkingStatus ? 'Checking Status...' : 'Check Payment Status'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentContinuation;