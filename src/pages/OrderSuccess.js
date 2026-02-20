import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  ContentCopy,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [copiedField, setCopiedField] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run redirect logic once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const stateOrder = location.state?.orderDetails;
    const storedOrder = localStorage.getItem('last_order');

    console.log('OrderSuccess - Initializing...');
    console.log('State order:', !!stateOrder);
    console.log('Stored order:', !!storedOrder);

    if (stateOrder) {
      // Fresh order from payment flow
      console.log('OrderSuccess - Processing fresh order');
      setOrderDetails(stateOrder);
      localStorage.setItem('last_order', JSON.stringify(stateOrder));
      clearCart();
      localStorage.removeItem('accvaultng_cart');
      console.log('OrderSuccess - Order saved and cart cleared');
    } else if (storedOrder) {
      // Restored order from localStorage (refresh/navigation)
      console.log('OrderSuccess - Restoring order from storage');
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrderDetails(parsedOrder);
        console.log('OrderSuccess - Order restored successfully');
      } catch (error) {
        console.error('OrderSuccess - Error parsing stored order:', error);
        navigate('/marketplace', { replace: true });
      }
    } else {
      // No order data available
      console.log('OrderSuccess - No order data, redirecting to marketplace');
      navigate('/marketplace', { replace: true });
    }
  }, []); // Empty dependency array - only run once

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

  const downloadCredentials = () => {
    if (!orderDetails) return;

    let content = `Order #${orderDetails.orderNumber}\n`;
    content += `Date: ${new Date(orderDetails.createdAt || Date.now()).toLocaleDateString()}\n`;
    content += `Total: ₦${(orderDetails.totalAmount || 0).toLocaleString()}\n\n`;
    content += `=== ACCOUNT CREDENTIALS ===\n\n`;

    if (orderDetails.items && Array.isArray(orderDetails.items)) {
      orderDetails.items.forEach((item, itemIndex) => {
        content += `Item #${itemIndex + 1} - ₦${(item.price || 0).toLocaleString()}\n`;
        content += `Quantity: ${item.quantity || 1}\n\n`;

        if (Array.isArray(item.credentials) && item.credentials.length > 0) {
          const validCredentials = item.credentials.filter(cred => cred && cred.trim());
          if (validCredentials.length > 0) {
            validCredentials.forEach((credential, credIndex) => {
              content += `Login Details Block ${credIndex + 1}:\n`;
              content += `${credential}\n\n`;
            });
          } else {
            content += `No credentials available for this item.\n\n`;
          }
        } else if (item.credentials && typeof item.credentials === 'string') {
          content += `Login Details:\n`;
          content += `${item.credentials}\n\n`;
        } else {
          content += `No credentials available for this item.\n\n`;
        }
      });
    }

    content += `\nIMPORTANT: Keep these credentials secure and do not share them.\n`;
    content += `For support, contact us with order number: ${orderDetails.orderNumber}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Order-${orderDetails.orderNumber}-Credentials.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!orderDetails) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading order details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
          </motion.div>
          <Typography variant="h3" gutterBottom sx={{ color: '#10b981', fontWeight: 'bold' }}>
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your account credentials are ready
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your cart has been cleared and items have been delivered
          </Typography>
          <Chip
            label={`Order #${orderDetails.orderNumber}`}
            color="primary"
            sx={{ mt: 1, fontSize: '1rem', px: 2, py: 1 }}
          />
        </Box>

        {/* Order Summary */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
          <CardContent sx={{ color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Order Total
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ₦{(orderDetails.totalAmount || 0).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Items Purchased
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {orderDetails.items?.length || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Order Date
                </Typography>
                <Typography variant="h6">
                  {new Date(orderDetails.createdAt || Date.now()).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Important:</strong> Please save these credentials securely. You can download them as a text file or copy each field individually.
            For support, contact us with order number: <strong>{orderDetails.orderNumber}</strong>
          </Typography>
        </Alert>

        {/* Download Button */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={downloadCredentials}
            size="large"
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
              px: 4,
              py: 1.5
            }}
          >
            Download All Credentials
          </Button>
        </Box>

        {/* Credentials Cards */}
        <Typography variant="h5" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold', mb: 3 }}>
          Your Account Credentials
        </Typography>

        {orderDetails.items && Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? orderDetails.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: '#7c3aed', fontWeight: 600 }}>
                    Account #{index + 1}
                  </Typography>
                  <Chip
                    label={`₦${(item.price || 0).toLocaleString()}`}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Grid container spacing={3}>
                  {/* Handle multiple credential blocks */}
                  {Array.isArray(item.credentials) && item.credentials.length > 0 ? (
                    item.credentials.map((credential, credIndex) => (
                      credential && credential.trim() ? (
                        <Grid item xs={12} key={credIndex}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#7c3aed' }}>
                            Credential Block {credIndex + 1}:
                          </Typography>
                          <TextField
                            label={`Login Details ${credIndex + 1}`}
                            value={credential}
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <IconButton
                                  onClick={() => copyToClipboard(credential, `credentials-${index}-${credIndex}`)}
                                  color="primary"
                                  sx={{ alignSelf: 'flex-start', mt: 1 }}
                                >
                                  {copiedField === `credentials-${index}-${credIndex}` ?
                                    <CheckCircle sx={{ color: '#10b981' }} /> :
                                    <ContentCopy />
                                  }
                                </IconButton>
                              ),
                              sx: {
                                fontFamily: 'monospace',
                                fontSize: '0.9rem'
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f8fafc'
                              }
                            }}
                          />
                        </Grid>
                      ) : null
                    ))
                  ) : (
                    /* Handle single credential string (backward compatibility) */
                    <Grid item xs={12}>
                      <TextField
                        label="Login Credentials"
                        value={item.credentials || 'Credentials not available'}
                        fullWidth
                        multiline
                        rows={8}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <IconButton
                              onClick={() => copyToClipboard(item.credentials || '', `credentials-${index}`)}
                              color="primary"
                              sx={{ alignSelf: 'flex-start', mt: 1 }}
                            >
                              {copiedField === `credentials-${index}` ?
                                <CheckCircle sx={{ color: '#10b981' }} /> :
                                <ContentCopy />
                              }
                            </IconButton>
                          ),
                          sx: {
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f8fafc'
                          }
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )) : (
          // Fallback when no items are available
          <Card elevation={3} sx={{ mb: 3, textAlign: 'center', py: 4 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Order Details Loading...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your credentials will appear here once the order is fully processed.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => {
              // Clear stored order when navigating away
              localStorage.removeItem('last_order');
              navigate('/');
            }}
            size="large"
            sx={{
              backgroundColor: '#7c3aed',
              '&:hover': { backgroundColor: '#5b21b6' },
              px: 4
            }}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartIcon />}
            onClick={() => {
              // Clear stored order when navigating away
              localStorage.removeItem('last_order');
              navigate('/marketplace');
            }}
            size="large"
            sx={{
              borderColor: '#7c3aed',
              color: '#7c3aed',
              '&:hover': {
                borderColor: '#5b21b6',
                backgroundColor: 'rgba(124, 58, 237, 0.05)'
              },
              px: 4
            }}
          >
            Continue Shopping
          </Button>
        </Box>

        {/* Security Notice */}
        <Alert severity="warning" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Security Notice:</strong> Keep these credentials private and secure. Do not share them with anyone.
            If you suspect your account has been compromised, contact our support team immediately.
          </Typography>
        </Alert>
      </motion.div>
    </Container>
  );
};

export default OrderSuccess;