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
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckIcon,
  CurrencyBitcoin as BitcoinIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';

const CryptoPaymentModal = ({ 
  open, 
  onClose, 
  cryptoType, 
  totalAmount, 
  cartItems,
  onPaymentSuccess,
  isWalletFunding = false
}) => {
  const [cryptoSettings, setCryptoSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCryptoSettings();
    }
  }, [open]);

  const fetchCryptoSettings = async () => {
    try {
      const response = await apiClient.get(getEndpoint('CRYPTO', 'SETTINGS'));
      if (response.data.success) {
        setCryptoSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching crypto settings:', error);
    } finally {
      setLoading(false);
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

  const handleWhatsAppRedirect = () => {
    if (cryptoSettings?.whatsappCommunityLink) {
      window.open(cryptoSettings.whatsappCommunityLink, '_blank');
    }
  };

  const handlePaymentConfirmation = async () => {
    setConfirmingPayment(true);
    
    try {
      // Generate a unique reference for crypto payment
      const paymentReference = `crypto_${cryptoType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For wallet funding, call onPaymentSuccess directly
      if (isWalletFunding && onPaymentSuccess) {
        setTimeout(() => {
          onPaymentSuccess(paymentReference, 'crypto');
          setPaymentConfirmed(true);
          setConfirmingPayment(false);
          
          // Close modal after success
          setTimeout(() => {
            onClose();
            setPaymentConfirmed(false);
          }, 2000);
        }, 1500); // Simulate processing time
      } else {
        // For regular orders, you would typically create an order here
        // For now, we'll just show confirmation
        setPaymentConfirmed(true);
        setConfirmingPayment(false);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setConfirmingPayment(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading payment details...</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!cryptoSettings) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="error">
            Crypto payment settings not configured. Please contact support.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const currentCrypto = cryptoType === 'bitcoin' ? cryptoSettings.bitcoin : cryptoSettings.usdt;
  const cryptoName = cryptoType === 'bitcoin' ? 'Bitcoin (BTC)' : `USDT (${cryptoSettings.usdt.network})`;
  const cryptoIcon = cryptoType === 'bitcoin' ? 
    <BitcoinIcon sx={{ color: '#f7931a', fontSize: 32 }} /> : 
    <WalletIcon sx={{ color: '#26a17b', fontSize: 32 }} />;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 600, 
        color: '#7c3aed',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {cryptoIcon}
          <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
            Pay with {cryptoName}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Order Summary */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {isWalletFunding ? 'Wallet Funding Amount' : 'Order Total'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                ₦{totalAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {isWalletFunding ? 'Add funds to your wallet' : `${cartItems?.length || 0} item${(cartItems?.length || 0) > 1 ? 's' : ''}`}
              </Typography>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Payment Instructions:</strong><br />
              1. Send the exact amount to the {cryptoName} address below<br />
              2. Take a screenshot of your transaction<br />
              {isWalletFunding ? (
                <>
                  3. Click "I Have Made Payment" to confirm<br />
                  4. Your wallet will be credited after confirmation
                </>
              ) : (
                <>
                  3. Join our WhatsApp community and send the screenshot to admin<br />
                  4. You'll receive your credentials after verification
                </>
              )}
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* QR Code */}
            {currentCrypto.qrCode && (
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
                  <QrCodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Scan QR Code
                </Typography>
                <Paper sx={{ p: 2, display: 'inline-block' }}>
                  <img 
                    src={currentCrypto.qrCode} 
                    alt={`${cryptoName} QR Code`} 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                </Paper>
              </Box>
            )}

            {/* Address */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
                {cryptoName} Address
              </Typography>
              
              {cryptoType === 'usdt' && (
                <Chip 
                  label={`Network: ${cryptoSettings.usdt.network}`}
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                value={currentCrypto.address}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton 
                      onClick={() => copyToClipboard(currentCrypto.address, 'address')}
                      color="primary"
                    >
                      {copiedField === 'address' ? 
                        <CheckIcon sx={{ color: '#10b981' }} /> : 
                        <CopyIcon />
                      }
                    </IconButton>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8fafc'
                  }
                }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click the copy icon to copy the address
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* WhatsApp Community */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
              After Payment
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {cryptoSettings.instructions}
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppRedirect}
              size="large"
              sx={{
                backgroundColor: '#25d366',
                '&:hover': { backgroundColor: '#128c7e' },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Join WhatsApp Community
            </Button>
          </Box>

          {/* Important Notice */}
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Make sure to send the exact amount to the correct address. 
              Double-check the network for USDT payments. Transactions cannot be reversed.
            </Typography>
          </Alert>
        </motion.div>
      </DialogContent>

      {/* <DialogActions sx={{ px: 3, pb: 3 }}>
        {!paymentConfirmed ? (
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ 
                borderColor: '#7c3aed',
                color: '#7c3aed',
                '&:hover': { 
                  borderColor: '#5b21b6',
                  backgroundColor: 'rgba(124, 58, 237, 0.05)' 
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirmation}
              variant="contained"
              disabled={confirmingPayment}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' },
                px: 3
              }}
            >
              {confirmingPayment ? 'Confirming...' : 'I Have Made Payment'}
            </Button>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
            <CheckIcon />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Payment Confirmed! {isWalletFunding ? 'Funds added to wallet.' : 'Processing order...'}
            </Typography>
          </Box>
        )}
      </DialogActions> */}
    </Dialog>
  );
};

export default CryptoPaymentModal;