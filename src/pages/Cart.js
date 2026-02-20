import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert
} from '@mui/material';
import { Add, Remove, Delete, ExpandLess, ExpandMore, AccountBalanceWallet as AccountBalanceWalletIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CryptoPaymentModal from '../components/CryptoPaymentModal';
import WhatsAppPaymentModal from '../components/WhatsAppPaymentModal';
import PaymentContinuation from '../components/PaymentContinuation';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount,
    isLoading
  } = useCart();
  
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cryptoExpanded, setCryptoExpanded] = useState(false);
  
  // Crypto payment modal state
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [selectedCryptoType, setSelectedCryptoType] = useState('');
  
  // WhatsApp payment modal state
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  
  // Payment continuation state
  const [paymentContinuationOpen, setPaymentContinuationOpen] = useState(false);
  const [hasPaymentInProgress, setHasPaymentInProgress] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  
  // Purchase confirmation modal state
  const [confirmPurchaseOpen, setConfirmPurchaseOpen] = useState(false);

  // Load Paystack script and check for payment in progress
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    // Check for payment in progress
    const checkPaymentInProgress = () => {
      const existingPayment = localStorage.getItem('whatsapp_payment_in_progress');
      setHasPaymentInProgress(!!existingPayment);
    };

    checkPaymentInProgress();
    
    // Fetch wallet balance
    fetchWalletBalance();
    
    // Check periodically in case user completes payment in another tab
    const interval = setInterval(() => {
      checkPaymentInProgress();
      fetchWalletBalance();
    }, 10000);

    return () => {
      document.body.removeChild(script);
      clearInterval(interval);
    };
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WALLET', 'BALANCE'));
      if (response.data.success) {
        setWalletBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || '';
    
    if (platformLower.includes('facebook') || platformLower.includes('fb')) {
      return <FacebookIcon sx={{ fontSize: 20, color: '#1877f2' }} />;
    }
    if (platformLower.includes('instagram') || platformLower.includes('ig')) {
      return <InstagramIcon sx={{ fontSize: 20, color: '#E4405F' }} />;
    }
    if (platformLower.includes('twitter') || platformLower.includes('x.com')) {
      return <TwitterIcon sx={{ fontSize: 20, color: '#1DA1F2' }} />;
    }
    if (platformLower.includes('snapchat') || platformLower.includes('snap')) {
      return (
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg" 
          alt="Snapchat" 
          style={{ width: 20, height: 20 }}
        />
      );
    }
    if (platformLower.includes('tiktok') || platformLower.includes('tik tok')) {
      return (
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" 
          alt="TikTok" 
          style={{ width: 20, height: 20 }}
        />
      );
    }
    if (platformLower.includes('youtube') || platformLower.includes('yt')) {
      return <YouTubeIcon sx={{ fontSize: 20, color: '#FF0000' }} />;
    }
    if (platformLower.includes('linkedin')) {
      return <LinkedInIcon sx={{ fontSize: 20, color: '#0077B5' }} />;
    }
    if (platformLower.includes('telegram')) {
      return <TelegramIcon sx={{ fontSize: 20, color: '#0088cc' }} />;
    }
    if (platformLower.includes('whatsapp')) {
      return <WhatsAppIcon sx={{ fontSize: 20, color: '#25D366' }} />;
    }
    if (platformLower.includes('pinterest')) {
      return <PinterestIcon sx={{ fontSize: 20, color: '#BD081C' }} />;
    }
    if (platformLower.includes('reddit')) {
      return <RedditIcon sx={{ fontSize: 20, color: '#FF4500' }} />;
    }
    if (platformLower.includes('discord')) {
      return (
        <img 
          src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
          alt="Discord" 
          style={{ width: 20, height: 20 }}
        />
      );
    }
    if (platformLower.includes('apple') || platformLower.includes('ios')) {
      return <AppleIcon sx={{ fontSize: 20, color: '#000000' }} />;
    }
    if (platformLower.includes('android') || platformLower.includes('google')) {
      return <AndroidIcon sx={{ fontSize: 20, color: '#3DDC84' }} />;
    }
    if (platformLower.includes('dating') || platformLower.includes('tinder') || platformLower.includes('bumble')) {
      return <FavoriteIcon sx={{ fontSize: 20, color: '#E91E63' }} />;
    }
    if (platformLower.includes('text') || platformLower.includes('sms')) {
      return <MessageIcon sx={{ fontSize: 20, color: '#2196F3' }} />;
    }
    if (platformLower.includes('phone') || platformLower.includes('call')) {
      return <PhoneIcon sx={{ fontSize: 20, color: '#4CAF50' }} />;
    }
    
    // Default icon for unknown platforms
    return <AccountCircleIcon sx={{ fontSize: 20, color: '#7c3aed' }} />;
  };

  const getProductTypeColor = (type) => {
    const colors = {
      social_account: '#7c3aed',
      vpn: '#059669',
      dating_app: '#dc2626',
      texting_app: '#ea580c',
      proxy: '#0891b2',
      apple_service: '#6b7280',
      other: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const validateCartItems = async () => {
    try {
      const response = await apiClient.post(getEndpoint('ACCOUNTS', 'VALIDATE_CART'), {
        cartItems
      });
      
      return response.data;
    } catch (error) {
      console.error('Cart validation error:', error);
      return { valid: false, error: error.response?.data?.message || 'Validation failed' };
    }
  };

  const handleProceedToCheckout = async () => {
    // Validate cart items before processing
    const validation = await validateCartItems();
    if (!validation.valid && validation.invalidItems) {
      const invalidItems = validation.invalidItems;
      const invalidIds = invalidItems.map(item => item.id);
      
      // Remove invalid items from cart
      invalidIds.forEach(id => {
        removeFromCart(id);
      });
      
      alert(`Some items in your cart are no longer available and have been removed:\n${invalidItems.map(item => `- ${item.title}`).join('\n')}\n\nPlease review your cart and try again.`);
      return;
    }
    
    const cartTotal = getCartTotal();
    
    // Check if wallet has sufficient balance
    if (walletBalance < cartTotal) {
      alert(
        `Insufficient wallet balance.\n\n` +
        `Your balance: ₦${walletBalance.toLocaleString()}\n` +
        `Cart total: ₦${cartTotal.toLocaleString()}\n` +
        `Shortfall: ₦${(cartTotal - walletBalance).toLocaleString()}\n\n` +
        `Please add funds to your wallet to complete this purchase.`
      );
      return;
    }
    
    // Show confirmation modal
    setConfirmPurchaseOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setConfirmPurchaseOpen(false);
    const cartTotal = getCartTotal();
    await processWalletPayment(cartTotal);
  };

  const processWalletPayment = async (amount) => {
    try {
      console.log('Processing wallet payment...');
      console.log('Cart items:', cartItems);
      console.log('Total amount:', amount);
      
      // Create order with wallet payment - send full cart items like Paystack does
      const orderData = {
        cartItems: cartItems, // Send full cart items array
        totalAmount: amount,
        paymentMethod: 'wallet',
        paymentReference: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('Order data:', orderData);

      const response = await apiClient.post(getEndpoint('PAYMENTS', 'CREATE_ORDER'), orderData);

      console.log('Order response:', response.data);

      if (response.data.success) {
        // Payment successful, navigate to order success
        console.log('Wallet payment successful, clearing cart and navigating to success page');
        handlePaymentComplete(response.data.order);
      } else {
        const errorMsg = response.data.error || 'Failed to process wallet payment. Please try again or use another payment method.';
        console.error('Wallet payment failed:', errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error processing wallet payment:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to process wallet payment. Please try again or use another payment method.';
      alert(errorMessage);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'crypto') {
      setCryptoExpanded(true);
    } else {
      setCryptoExpanded(false);
    }
  };

  const handleCryptoSelect = (cryptoType) => {
    setSelectedCryptoType(cryptoType);
    setPaymentModalOpen(false);
    setCryptoModalOpen(true);
  };

  const handleWhatsAppSelect = () => {
    setPaymentModalOpen(false);
    setWhatsappModalOpen(true);
  };

  const handlePaymentComplete = (orderDetails) => {
    // Clear cart and navigate to success page
    clearCart();
    localStorage.removeItem('accvaultng_cart');
    localStorage.removeItem('whatsapp_payment_in_progress');
    setWhatsappModalOpen(false);
    setPaymentContinuationOpen(false);
    setHasPaymentInProgress(false);
    
    navigate('/order-success', {
      state: { orderDetails }
    });
  };

  const handlePaystackSelect = () => {
    // Validation checks
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to payment.');
      return;
    }

    if (!user?.email) {
      alert('Please ensure your account has a valid email address.');
      return;
    }

    const cartTotal = getCartTotal();
    if (cartTotal <= 0) {
      alert('Invalid cart total. Please refresh and try again.');
      return;
    }

    // Legacy Paystack code - can be removed if not needed
    const vpayPublicKey = 'pk_test_placeholder'; // Placeholder for legacy code
    
    if (!vpayPublicKey) {
      alert('Payment system is not configured. Please contact support.');
      return;
    }

    if (!window.PaystackPop) {
      alert('Payment system is not loaded. Please refresh the page and try again.');
      return;
    }

    // Calculate total amount in kobo (Paystack expects amount in kobo - multiply by 100)
    const totalAmountInKobo = Math.round(cartTotal * 100);
    
    console.log('Payment setup:');
    console.log('Total amount (Naira):', cartTotal);
    console.log('Total amount (Kobo):', totalAmountInKobo);
    console.log('User email:', user?.email);
    console.log('Cart items:', cartItems.length);

    const handler = window.PaystackPop.setup({
      key: vpayPublicKey,
      email: user.email,
      amount: totalAmountInKobo, // Amount in kobo
      currency: 'NGN',
      ref: `accvault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Cart Items",
            variable_name: "cart_items",
            value: cartItems.length
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name", 
            value: user?.name || 'Guest User'
          },
          {
            display_name: "Total Amount",
            variable_name: "total_amount",
            value: `₦${cartTotal.toLocaleString()}`
          }
        ]
      },
      callback: function(response) {
        // Payment successful - create order and get credentials
        console.log('Payment successful:', response);
        console.log('Cart items:', cartItems);
        console.log('User token:', localStorage.getItem('token'));
        
        // Use setTimeout to handle async operations properly
        setTimeout(async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              alert('Authentication error. Please login and try again.');
              return;
            }

            console.log('Creating order with data:', {
              cartItems,
              paymentReference: response.reference,
              paymentMethod: 'paystack',
              totalAmount: getCartTotal()
            });

            // Create order with credentials
            const orderResponse = await apiClient.post(getEndpoint('PAYMENTS', 'CREATE_ORDER'), {
              cartItems,
              paymentReference: response.reference,
              paymentMethod: 'paystack',
              totalAmount: getCartTotal()
            });

            console.log('Order response:', orderResponse.data);

            if (orderResponse.data.success) {
              // Redirect to order success page with credentials
              console.log('Order created successfully, redirecting to success page');
              console.log('Order details:', orderResponse.data.order);
              console.log('Order items:', orderResponse.data.order.items);
              console.log('First item credentials:', orderResponse.data.order.items[0]?.credentials);
              
              console.log('Cart items before clearing:', cartItems.length);
              clearCart();
              console.log('Cart cleared successfully');
              setPaymentModalOpen(false);
              
              // Double-check cart is cleared by also clearing localStorage directly
              localStorage.removeItem('accvaultng_cart');
              console.log('Cart localStorage also cleared as backup');
              
              // Navigate to order success page with order details
              navigate('/order-success', {
                state: { orderDetails: orderResponse.data.order }
              });
            } else {
              console.error('Order creation failed:', orderResponse.data);
              alert('Error creating order. Please contact support.');
            }
          } catch (error) {
            console.error('Order creation error:', error);
            console.error('Error response:', error.response?.data);
            
            // Check if it's an invalid cart items error
            if (error.response?.data?.invalidItems) {
              const invalidItems = error.response.data.invalidItems;
              const invalidIds = invalidItems.map(item => item.id);
              
              // Remove invalid items from cart
              invalidIds.forEach(id => {
                removeFromCart(id);
              });
              
              alert(`Some items in your cart are no longer available and have been removed:\n${invalidItems.map(item => `- ${item.title}`).join('\n')}\n\nPlease try your payment again.`);
            } else {
              alert('Payment successful but error getting credentials. Please contact support with reference: ' + response.reference);
            }
          }
        }, 100);
      },
      onClose: function() {
        // Payment cancelled or closed
        console.log('Payment cancelled');
        setPaymentModalOpen(false);
      }
    });

    handler.openIframe();
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading cart...
        </Typography>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/marketplace"
            size="large"
            sx={{
              backgroundColor: '#7c3aed',
              '&:hover': { backgroundColor: '#5b21b6' },
              px: 4,
              py: 1.5
            }}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#7c3aed', 
            fontWeight: 'bold',
            mb: 3,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Shopping Cart ({getCartItemsCount()} items)
        </Typography>

        {/* Payment in Progress Alert */}
        {hasPaymentInProgress && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setPaymentContinuationOpen(true)}
              >
                Continue
              </Button>
            }
          >
            You have a WhatsApp payment in progress. Click "Continue" to complete your payment.
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {/* Cart Items */}
          <Box sx={{ width: '100%' }}>
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ mb: 2, overflow: 'hidden' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Grid container spacing={2} alignItems="center">
                        {/* Product Image */}
                        {item.images && item.images.length > 0 && (
                          <Grid item xs={12} sm={3}>
                            <CardMedia
                              component="img"
                              height={isMobile ? "120" : "100"}
                              image={item.images[0]}
                              alt={item.title}
                              sx={{ 
                                borderRadius: 1,
                                objectFit: 'cover'
                              }}
                            />
                          </Grid>
                        )}

                        {/* Product Details */}
                        <Grid item xs={12} sm={item.images?.length > 0 ? 6 : 9}>
                          <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                              fontWeight: 600,
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            {getPlatformIcon(item.platform)}
                            <Box sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {item.title}
                            </Box>
                          </Typography>
                          
                          <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip
                              label={item.platform}
                              size="small"
                              sx={{ 
                                backgroundColor: '#7c3aed', 
                                color: 'white',
                                fontSize: '0.7rem'
                              }}
                            />
                            {item.productType && (
                              <Chip
                                label={item.productType.replace('_', ' ').toUpperCase()}
                                size="small"
                                sx={{ 
                                  backgroundColor: getProductTypeColor(item.productType), 
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>

                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.description}
                          </Typography>

                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#7c3aed', 
                              fontWeight: 'bold',
                              mt: 1
                            }}
                          >
                            ₦{item.price?.toLocaleString()}
                          </Typography>
                        </Grid>

                        {/* Quantity Controls & Remove */}
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'row', sm: 'column' },
                            alignItems: 'center',
                            justifyContent: { xs: 'space-between', sm: 'center' },
                            gap: 2
                          }}>
                            {/* Quantity Controls */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                sx={{ 
                                  backgroundColor: '#f3f4f6',
                                  '&:hover': { backgroundColor: '#e5e7eb' }
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  minWidth: '30px', 
                                  textAlign: 'center',
                                  fontWeight: 600
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                sx={{ 
                                  backgroundColor: '#f3f4f6',
                                  '&:hover': { backgroundColor: '#e5e7eb' }
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* Remove Button */}
                            <IconButton
                              onClick={() => removeFromCart(item._id)}
                              sx={{ 
                                color: '#dc2626',
                                '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.1)' }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>

                          {/* Subtotal */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textAlign: { xs: 'left', sm: 'center' },
                              mt: 1,
                              fontWeight: 600
                            }}
                          >
                            Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                sx={{ px: 3 }}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Items ({getCartItemsCount()})
                </Typography>
                <Typography variant="body2">
                  ₦{getCartTotal().toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">Free</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#7c3aed' }}
              >
                ₦{getCartTotal().toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceedToCheckout}
              disabled={loadingWallet || walletBalance < getCartTotal()}
              sx={{
                backgroundColor:
                  walletBalance < getCartTotal() ? '#9ca3af' : '#7c3aed',
                '&:hover': {
                  backgroundColor:
                    walletBalance < getCartTotal() ? '#9ca3af' : '#5b21b6',
                },
                py: 1.5,
                mb: 2,
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                  color: 'white',
                },
              }}
            >
              {loadingWallet
                ? 'Loading...'
                : walletBalance < getCartTotal()
                ? 'Insufficient Wallet Balance'
                : 'Purchase'}
            </Button>

            {!loadingWallet && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Wallet Balance:{' '}
                  <strong>₦{walletBalance.toLocaleString()}</strong>
                </Typography>

                {walletBalance < getCartTotal() && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Need ₦{(getCartTotal() - walletBalance).toLocaleString()} more.
                    <Button
                      size="small"
                      onClick={() => navigate('/add-funds')}
                      sx={{ ml: 1, textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Add Funds
                    </Button>
                  </Typography>
                )}
              </Box>
            )}

            {hasPaymentInProgress && (
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => setPaymentContinuationOpen(true)}
                sx={{
                  borderColor: '#25D366',
                  color: '#25D366',
                  '&:hover': {
                    borderColor: '#1da851',
                    backgroundColor: 'rgba(37, 211, 102, 0.05)',
                  },
                  mb: 2,
                }}
                startIcon={<WhatsAppIcon />}
              >
                Continue Bank Payment
              </Button>
            )}

            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/marketplace"
              sx={{
                borderColor: '#7c3aed',
                color: '#7c3aed',
                '&:hover': {
                  borderColor: '#5b21b6',
                  backgroundColor: 'rgba(124, 58, 237, 0.05)',
                },
              }}
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
        </Box>

        {/* Payment Method Selection Modal */}
        <Dialog
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            fontWeight: 600, 
            color: '#7c3aed',
            pb: 1
          }}>
            Choose Payment Method
          </DialogTitle>
          
          <DialogContent sx={{ px: 3, py: 2 }}>
            <List sx={{ p: 0 }}>
            {/* Bank Payment Option */}
              <ListItem disablePadding sx={{ mt: 1 }}>
                <ListItemButton
                  onClick={handleWhatsAppSelect}
                  sx={{
                    border: '2px solid',
                    borderColor: selectedPaymentMethod === 'whatsapp' ? '#25D366' : '#e5e7eb',
                    borderRadius: 2,
                    p: 2,
                    '&:hover': {
                      borderColor: '#25D366',
                      backgroundColor: 'rgba(37, 211, 102, 0.05)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <PaymentIcon sx={{ color: '#d32568ff', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bank Transfer"
                    secondary="Bank transfer with verification code"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#1f2937'
                    }}
                    secondaryTypographyProps={{
                      color: '#6b7280'
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {/* Crypto Option */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handlePaymentMethodSelect('crypto')}
                  sx={{
                    border: '2px solid',
                    borderColor: selectedPaymentMethod.includes('crypto') ? '#7c3aed' : '#e5e7eb',
                    borderRadius: 2,
                    p: 2,
                    '&:hover': {
                      borderColor: '#7c3aed',
                      backgroundColor: 'rgba(124, 58, 237, 0.05)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <CurrencyBitcoinIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pay with Cryptocurrency"
                    secondary="Bitcoin and USDT accepted"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#1f2937'
                    }}
                    secondaryTypographyProps={{
                      color: '#6b7280'
                    }}
                  />
                  {cryptoExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              {/* Crypto Sub-options */}
              <Collapse in={cryptoExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2, mt: 1 }}>
                  {/* Bitcoin Option */}
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => handleCryptoSelect('bitcoin')}
                      sx={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 1,
                        p: 1.5,
                        '&:hover': {
                          borderColor: '#f59e0b',
                          backgroundColor: 'rgba(245, 158, 11, 0.05)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CurrencyBitcoinIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Bitcoin (BTC)"
                        secondary="Pay with Bitcoin"
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem',
                          color: '#6b7280'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>

                  {/* USDT Option */}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleCryptoSelect('usdt')}
                      sx={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 1,
                        p: 1.5,
                        '&:hover': {
                          borderColor: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.05)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}
                        >
                          ₮
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary="USDT (Tether)"
                        secondary="Pay with USDT"
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.8rem',
                          color: '#6b7280'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              {/* Paystack Option */}
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  // onClick={handlePaystackSelect}
                  sx={{
                    border: '2px solid',
                    borderColor: selectedPaymentMethod === 'paystack' ? '#7c3aed' : '#e5e7eb',
                    borderRadius: 2,
                    p: 2,
                    '&:hover': {
                      borderColor: '#7c3aed',
                      backgroundColor: 'rgba(124, 58, 237, 0.05)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <PaymentIcon sx={{ color: '#7c3aed', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pay to Vpay (auto)"
                    secondary="Secure payment with cards, bank transfer, and more"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#1f2937'
                    }}
                    secondaryTypographyProps={{
                      color: '#6b7280'
                    }}
                  />
                </ListItemButton>
              </ListItem>
              
            </List>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setPaymentModalOpen(false)}
              sx={{ 
                color: '#6b7280',
                '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Crypto Payment Modal */}
        <CryptoPaymentModal
          open={cryptoModalOpen}
          onClose={() => setCryptoModalOpen(false)}
          cryptoType={selectedCryptoType}
          totalAmount={getCartTotal()}
          cartItems={cartItems}
        />

        {/* WhatsApp Payment Modal */}
        <WhatsAppPaymentModal
          open={whatsappModalOpen}
          onClose={() => setWhatsappModalOpen(false)}
          totalAmount={getCartTotal()}
          cartItems={cartItems}
          onPaymentComplete={handlePaymentComplete}
        />

        {/* Payment Continuation Modal */}
        <PaymentContinuation
          open={paymentContinuationOpen}
          onClose={() => setPaymentContinuationOpen(false)}
          onPaymentComplete={handlePaymentComplete}
        />

        {/* Purchase Confirmation Modal */}
        <Dialog
          open={confirmPurchaseOpen}
          onClose={() => setConfirmPurchaseOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            fontWeight: 600, 
            color: '#7c3aed',
            pb: 1,
            fontSize: '1.3rem'
          }}>
            Confirm Purchase
          </DialogTitle>
          
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 64, color: '#7c3aed', mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 2, color: '#1f2937' }}>
                Are you sure you want to purchase this order?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The amount will be deducted from your wallet balance.
              </Typography>
              
              <Box sx={{ 
                backgroundColor: '#f8fafc', 
                borderRadius: 2, 
                p: 2, 
                mb: 2,
                border: '1px solid #e2e8f0'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₦{walletBalance.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Order Total:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>
                    -₦{getCartTotal().toLocaleString()}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    New Balance:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#16a34a' }}>
                    ₦{(walletBalance - getCartTotal()).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setConfirmPurchaseOpen(false)}
              variant="outlined"
              fullWidth
              sx={{ 
                borderColor: '#9ca3af',
                color: '#6b7280',
                '&:hover': { 
                  borderColor: '#6b7280',
                  backgroundColor: 'rgba(107, 114, 128, 0.05)' 
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#7c3aed',
                '&:hover': { backgroundColor: '#5b21b6' }
              }}
            >
              Confirm Purchase
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default Cart;