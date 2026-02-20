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
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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

const Marketplace = () => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    platform: ''
  });
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [userStats, setUserStats] = useState({
    totalSpent: 0,
    totalPurchases: 0,
    recentTransactions: [],
    recentOrdersCount: 0,
    totalOrders: 0
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, getEffectiveAvailableStock } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCategories();
    fetchAccounts();
    if (user) {
      fetchUserStats();
      fetchWalletBalance();
    }
  }, [filters, user]);

  const fetchUserStats = async () => {
    try {
      const response = await apiClient.get(getEndpoint('USER', 'STATS'));
      
      if (response.data.success) {
        setUserStats({
          totalSpent: response.data.stats.totalSpent,
          totalPurchases: response.data.stats.totalPurchases,
          recentTransactions: response.data.stats.recentTransactions,
          recentOrdersCount: response.data.stats.recentOrdersCount,
          totalOrders: response.data.stats.totalOrders
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values if API fails
      setUserStats({
        totalSpent: 0,
        totalPurchases: 0,
        recentTransactions: [],
        recentOrdersCount: 0,
        totalOrders: 0
      });
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WALLET', 'BALANCE'));
      if (response.data.success) {
        setWalletBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const response = await apiClient.get(getEndpoint('PAYMENTS', 'MY_ORDERS'));
      if (response.data.success) {
        setAllTransactions(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      setAllTransactions([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(getEndpoint('CATEGORIES', 'LIST'));
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await apiClient.get(`${getEndpoint('ACCOUNTS', 'LIST')}?${params}`);
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      platform: ''
    });
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'transactions':
        // Open transaction history modal
        fetchAllTransactions();
        setTransactionHistoryOpen(true);
        break;
      case 'orders':
        // Could open orders history
        console.log('Show order history');
        break;
      case 'spending':
        // Could show spending breakdown
        console.log('Show spending breakdown');
        break;
      case 'purchases':
        // Could show purchase history
        console.log('Show purchase history');
        break;
      default:
        break;
    }
  };

  const handleAddToCart = (account) => {
    if (!user) {
      // User is not logged in, redirect to login page
      navigate('/login');
      return;
    }
    
    // Check if we can add to cart (stock availability)
    const effectiveStock = getEffectiveAvailableStock(account._id, account.availableCredentialsCount);
    if (effectiveStock <= 0) {
      alert('Sorry, this item is out of stock or you have reached the maximum quantity available.');
      return;
    }
    
    // User is logged in and stock is available, proceed with adding to cart
    addToCart(account, 1);
    setToastOpen(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
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

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#7c3aed', 
          fontWeight: 'bold',
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          textAlign: 'left'
        }}
      >
        Dashboard
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          textAlign: 'left',
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}
      >
        Browse our collection of premium social media accounts and digital services
      </Typography>

      {/* User Dashboard Cards - Only show if user is logged in */}
      {user && (
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          {/* Mobile Layout - Stack (xs to md) */}
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <Stack spacing={2}>
              {/* Wallet Balance Card */}
              <Card 
                onClick={() => navigate('/add-funds')}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: '1px solid #60a5fa',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Wallet Balance
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#93c5fd', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#1e40af' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      mb: 0.5
                    }}
                  >
                    {loadingWallet ? '...' : `₦${walletBalance.toLocaleString()}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {walletBalance === 0 ? 'Add funds to get started' : 'Available balance'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Total Spent Card */}
              <Card 
                onClick={() => handleCardClick('spending')}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total Spent
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#fed7aa', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 20, color: '#ea580c' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      mb: 0.5
                    }}
                  >
                    ₦{userStats.totalSpent.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userStats.totalSpent === 0 ? 'No spending yet' : 'Total amount spent'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Total Purchases Card */}
              <Card 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '1px solid #fbbf24',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total Purchases
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#fbbf24', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ReceiptIcon sx={{ fontSize: 20, color: '#92400e' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      mb: 0.5
                    }}
                  >
                    {userStats.totalPurchases}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userStats.totalPurchases === 0 ? 'No purchases yet' : 'Accounts purchased'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Recent Orders Card */}
              <Card 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  transition: 'all 0.3s ease',
                  height: '140px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Recent Orders
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#bbf7d0', 
                      borderRadius: '50%', 
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCartIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                    </Box>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      mb: 0.5
                    }}
                  >
                    {userStats.recentOrdersCount}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                    <Typography variant="body2" color="#16a34a" sx={{ fontWeight: 500 }}>
                      This month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Transactions Card */}
              <Card 
                onClick={() => handleCardClick('transactions')}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  minHeight: '140px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ReceiptIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      Recent Transactions
                    </Typography>
                  </Box>
                  
                  {userStats.recentTransactions.length === 0 ? (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                        No transactions yet
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#16a34a',
                          fontSize: '0.7rem',
                          py: 0.5,
                          px: 1.5,
                          '&:hover': {
                            backgroundColor: '#15803d'
                          }
                        }}
                        onClick={() => {
                          document.getElementById('accounts-grid')?.scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                        }}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1 }}>
                        {userStats.recentTransactions.length} recent orders
                      </Typography>
                      {userStats.recentTransactions.slice(0, 2).map((transaction, index) => (
                        <Box key={transaction.id} sx={{ mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                            ₦{transaction.amount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {transaction.itemCount} item{transaction.itemCount > 1 ? 's' : ''} • {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                      {userStats.recentTransactions.length > 2 && (
                        <Typography variant="body2" color="#7c3aed" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                          +{userStats.recentTransactions.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Desktop Layout - Grid (lg and up) */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'stretch',
              gap: 4,
              maxWidth: '1400px',
              mx: 'auto',
              px: 2
            }}>
              {/* Wallet Balance Card */}
              <Card 
                onClick={() => navigate('/add-funds')}
                sx={{ 
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  p: 4,
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: '1px solid #60a5fa',
                  transition: 'all 0.3s ease',
                  height: '180px',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Wallet Balance
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#93c5fd', 
                      borderRadius: '50%', 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 24, color: '#1e40af' }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        fontSize: '2.2rem',
                        mb: 1,
                        lineHeight: 1.2
                      }}
                    >
                      {loadingWallet ? '...' : `₦${walletBalance.toLocaleString()}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {walletBalance === 0 ? 'Add funds to get started' : 'Available balance'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Total Spent Card */}
              <Card 
                sx={{ 
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  p: 4,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  height: '180px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(124, 58, 237, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Total Spent
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#fed7aa', 
                      borderRadius: '50%', 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 24, color: '#ea580c' }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        fontSize: '2.2rem',
                        mb: 1,
                        lineHeight: 1.2
                      }}
                    >
                      ₦{userStats.totalSpent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {userStats.totalSpent === 0 ? 'No spending yet' : 'Total amount spent'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Total Purchases Card */}
              <Card 
                sx={{ 
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  p: 4,
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '1px solid #fbbf24',
                  transition: 'all 0.3s ease',
                  height: '180px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Total Purchases
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#fbbf24', 
                      borderRadius: '50%', 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ReceiptIcon sx={{ fontSize: 24, color: '#92400e' }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        fontSize: '2.2rem',
                        mb: 1,
                        lineHeight: 1.2
                      }}
                    >
                      {userStats.totalPurchases}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {userStats.totalPurchases === 0 ? 'No purchases yet' : 'Accounts purchased'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Orders Card */}
              <Card 
                sx={{ 
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  p: 4,
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  transition: 'all 0.3s ease',
                  height: '180px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(34, 197, 94, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      Recent Orders
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: '#bbf7d0', 
                      borderRadius: '50%', 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCartIcon sx={{ fontSize: 24, color: '#16a34a' }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#1f2937',
                        fontSize: '2.2rem',
                        mb: 1,
                        lineHeight: 1.2
                      }}
                    >
                      {userStats.recentOrdersCount}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                      <Typography variant="body2" color="#16a34a" sx={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4 }}>
                        This month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Transactions Card */}
              <Card 
                onClick={() => handleCardClick('transactions')}
                sx={{ 
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  p: 4,
                  height: '180px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(124, 58, 237, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ReceiptIcon sx={{ fontSize: 20, color: '#7c3aed' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      Recent Transactions
                    </Typography>
                  </Box>
                  
                  {userStats.recentTransactions.length === 0 ? (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                        No transactions yet
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#16a34a',
                          fontSize: '0.8rem',
                          py: 0.8,
                          px: 2,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#15803d'
                          }
                        }}
                        onClick={() => {
                          document.getElementById('accounts-grid')?.scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                        }}
                      >
                        Start Shopping
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                        {userStats.recentTransactions.length} recent orders
                      </Typography>
                      {userStats.recentTransactions.slice(0, 3).map((transaction, index) => (
                        <Box key={transaction.id} sx={{ mb: 0.8 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            ₦{transaction.amount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {transaction.itemCount} item{transaction.itemCount > 1 ? 's' : ''} • {new Date(transaction.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                      {userStats.recentTransactions.length > 3 && (
                        <Typography variant="body2" color="#7c3aed" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          +{userStats.recentTransactions.length - 3} more orders
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      )}

      {/* Filters */}
      <Box sx={{ 
        mb: { xs: 3, sm: 4 }, 
        p: { xs: 2, sm: 3 }, 
        backgroundColor: '#f8fafc', 
        borderRadius: 2 
      }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Filter Products
        </Typography>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Platform"
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              placeholder="e.g. Facebook, Instagram"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Accounts Grid */}
      {loading ? (
        <Box textAlign="center" py={4}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ justifyContent: 'space-between' }} id="accounts-grid">
          <AnimatePresence>
            {accounts.map((account, index) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={account._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      minHeight: { xs: '380px', sm: '420px', md: '450px' },
                      maxWidth: { xs: '100%', sm: '400px' },
                      margin: '0 auto',
                      width: '100%',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.1)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(124, 58, 237, 0.2)'
                      }
                    }}
                  >

                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: { xs: 1.5, sm: 2, md: 2.5 },
                  pb: { xs: 1, sm: 1.5 }
                }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                  >
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                        lineHeight: 1.3,
                        minHeight: { xs: '2.4rem', sm: '2.6rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {/* Product Image or Platform Icon */}
                      {account.images && account.images.length > 0 ? (
                        <Box
                          component="img"
                          src={account.images[0]}
                          alt={account.title}
                          sx={{
                            width: { xs: 20, sm: 24 },
                            height: { xs: 20, sm: 24 },
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        getPlatformIcon(account.platform)
                      )}
                      <Box sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {account.title}
                      </Box>
                    </Typography>
                  </motion.div>
                  
                  <Box sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    minHeight: { xs: '50px', sm: '60px' },
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5
                  }}>
                    <Chip
                      label={account.platform}
                      size="small"
                      sx={{ 
                        backgroundColor: '#7c3aed', 
                        color: 'white', 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        height: { xs: '22px', sm: '24px' }
                      }}
                    />
                    {account.category && (
                      <Chip
                        label={account.category.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: '22px', sm: '24px' }
                        }}
                      />
                    )}
                    {account.productType && (
                      <Chip
                        label={account.productType.replace('_', ' ').toUpperCase()}
                        size="small"
                        sx={{ 
                          backgroundColor: getProductTypeColor(account.productType), 
                          color: 'white',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: '22px', sm: '24px' }
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 1.5, sm: 2 },
                      minHeight: { xs: '32px', sm: '40px' },
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {account.description}
                  </Typography>
                  
                  {account.productType === 'social_account' && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: { xs: 'flex-start', sm: 'space-between' }, 
                      alignItems: 'center', 
                      mb: { xs: 1.5, sm: 2 }, 
                      minHeight: '20px',
                      flexDirection: 'row',
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                        <strong>Followers:</strong> {account.followers?.toLocaleString() || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                        <strong>Age:</strong> {account.accountAge || 'N/A'}
                      </Typography>
                    </Box>
                  )}

                  {(account.productType === 'vpn' || account.productType === 'dating_app') && account.duration && (
                    <Typography variant="body2" sx={{ 
                      mb: { xs: 1.5, sm: 2 }, 
                      minHeight: '20px', 
                      fontSize: { xs: '0.8rem', sm: '0.85rem' }
                    }}>
                      <strong>Duration:</strong> {account.duration}
                    </Typography>
                  )}

                  {account.specifications && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 }, 
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        fontStyle: 'italic',
                        minHeight: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {account.specifications}
                    </Typography>
                  )}

                  {account.features && account.features.length > 0 && (
                    <Box sx={{ 
                      mb: { xs: 1.5, sm: 2 }, 
                      minHeight: { xs: '26px', sm: '32px' }
                    }}>
                      {account.features.slice(0, isMobile ? 2 : 3).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            mr: 0.5, 
                            mb: 0.5, 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: '20px', sm: '24px' }
                          }}
                        />
                      ))}
                      {account.features.length > (isMobile ? 2 : 3) && (
                        <Chip
                          label={`+${account.features.length - (isMobile ? 2 : 3)} more`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            mb: 0.5, 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: '20px', sm: '24px' },
                            color: '#7c3aed'
                          }}
                        />
                      )}
                    </Box>
                  )}

                  {(account.guarantee || account.bulkDiscount) && (
                    <Box sx={{ 
                      mb: { xs: 1.5, sm: 2 }, 
                      minHeight: { xs: '24px', sm: '28px' },
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5
                    }}>
                      {account.guarantee && (
                        <Chip
                          label="🔒 Guarantee"
                          size="small"
                          color="success"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                            height: { xs: '20px', sm: '24px' }
                          }}
                        />
                      )}
                      {account.bulkDiscount && (
                        <Chip
                          label="💰 Bulk Discount"
                          size="small"
                          color="info"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                            height: { xs: '20px', sm: '24px' }
                          }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
                
                {/* Fixed position price - always 20px above button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1.0, duration: 0.4 }}
                >
                  <Box sx={{ 
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                    pb: '20px'
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#7c3aed', 
                        fontWeight: 'bold',
                        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem' },
                        textAlign: 'right'
                      }}
                    >
                      ₦{account.price?.toLocaleString()}
                    </Typography>
                    
                    {/* Stock Indicator */}
                    <Chip
                      label={`${getEffectiveAvailableStock(account._id, account.availableCredentialsCount)} in stock`}
                      size="small"
                      color={getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? 'success' : 'error'}
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        height: { xs: '20px', sm: '24px' }
                      }}
                    />
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1.1, duration: 0.4 }}
                >
                  <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, pt: 0 }}>


                    {/* Add to Cart Button */}
                    <motion.div
                      whileHover={{ scale: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? 1.02 : 1 }}
                      whileTap={{ scale: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? 0.98 : 1 }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        size={isMobile ? "medium" : "large"}
                        onClick={() => handleAddToCart(account)}
                        disabled={getEffectiveAvailableStock(account._id, account.availableCredentialsCount) === 0}
                        sx={{ 
                          backgroundColor: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? '#7c3aed' : '#9ca3af',
                          py: { xs: 1, sm: 1.2 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 600,
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? '#5b21b6' : '#9ca3af',
                            transform: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? 'translateY(-2px)' : 'none',
                            boxShadow: getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? '0 8px 25px rgba(124, 58, 237, 0.3)' : 'none'
                          },
                          '&:disabled': {
                            backgroundColor: '#9ca3af',
                            color: '#ffffff'
                          }
                        }}
                      >
                        {getEffectiveAvailableStock(account._id, account.availableCredentialsCount) > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </AnimatePresence>
        </Grid>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Added, Check your cart
        </Alert>
      </Snackbar>

      {/* Transaction History Modal */}
      <Dialog 
        open={transactionHistoryOpen} 
        onClose={() => setTransactionHistoryOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          borderBottom: '1px solid #e5e7eb',
          pb: 2
        }}>
          <ReceiptIcon sx={{ color: '#7c3aed' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Transaction History
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {allTransactions.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 6,
              textAlign: 'center'
            }}>
              <ReceiptIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Transactions Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your transaction history will appear here after you make your first purchase.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Mobile Layout - Cards */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
                {allTransactions.map((transaction) => (
                  <Card key={transaction._id} sx={{ mb: 2, border: '1px solid #e5e7eb' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#7c3aed', fontSize: '0.85rem' }}>
                          {transaction.orderNumber}
                        </Typography>
                        <Chip
                          label={
                            transaction.paymentStatus === 'completed' ? 'Completed' :
                            transaction.paymentStatus === 'pending' ? 'Pending' :
                            transaction.paymentStatus === 'failed' ? 'Failed' :
                            transaction.paymentStatus || 'Unknown'
                          }
                          size="small"
                          color={
                            transaction.paymentStatus === 'completed' ? 'success' :
                            transaction.paymentStatus === 'pending' ? 'warning' :
                            transaction.paymentStatus === 'failed' ? 'error' :
                            'default'
                          }
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {transaction.items?.length === 0 ? 'Wallet Funding' : `${transaction.items?.length || 0} item${(transaction.items?.length || 0) !== 1 ? 's' : ''}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          ₦{(transaction.totalAmount || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={
                          transaction.paymentMethod === 'paystack' ? 'Paystack' :
                          transaction.paymentMethod === 'whatsapp-bank' ? 'Bank Transfer' :
                          transaction.paymentMethod === 'crypto-bitcoin' ? 'Bitcoin' :
                          transaction.paymentMethod === 'crypto-usdt' ? 'USDT' :
                          transaction.paymentMethod || 'Unknown'
                        }
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          backgroundColor: 
                            transaction.paymentMethod === 'paystack' ? '#e0f2fe' :
                            transaction.paymentMethod === 'whatsapp-bank' ? '#e8f5e8' :
                            transaction.paymentMethod?.includes('crypto') ? '#fff3e0' :
                            '#f5f5f5',
                          color:
                            transaction.paymentMethod === 'paystack' ? '#0277bd' :
                            transaction.paymentMethod === 'whatsapp-bank' ? '#2e7d32' :
                            transaction.paymentMethod?.includes('crypto') ? '#f57c00' :
                            '#666'
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Desktop Layout - Table */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell><strong>Order #</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Items</strong></TableCell>
                        <TableCell><strong>Payment Method</strong></TableCell>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allTransactions.map((transaction) => (
                        <TableRow key={transaction._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#7c3aed' }}>
                              {transaction.orderNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.items?.length === 0 ? 'Wallet Funding' : `${transaction.items?.length || 0} item${(transaction.items?.length || 0) !== 1 ? 's' : ''}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                transaction.paymentMethod === 'paystack' ? 'Paystack' :
                                transaction.paymentMethod === 'whatsapp-bank' ? 'Bank Transfer' :
                                transaction.paymentMethod === 'crypto-bitcoin' ? 'Bitcoin' :
                                transaction.paymentMethod === 'crypto-usdt' ? 'USDT' :
                                transaction.paymentMethod || 'Unknown'
                              }
                              size="small"
                              sx={{
                                backgroundColor: 
                                  transaction.paymentMethod === 'paystack' ? '#e0f2fe' :
                                  transaction.paymentMethod === 'whatsapp-bank' ? '#e8f5e8' :
                                  transaction.paymentMethod?.includes('crypto') ? '#fff3e0' :
                                  '#f5f5f5',
                                color:
                                  transaction.paymentMethod === 'paystack' ? '#0277bd' :
                                  transaction.paymentMethod === 'whatsapp-bank' ? '#2e7d32' :
                                  transaction.paymentMethod?.includes('crypto') ? '#f57c00' :
                                  '#666'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ₦{(transaction.totalAmount || 0).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                transaction.paymentStatus === 'completed' ? 'Completed' :
                                transaction.paymentStatus === 'pending' ? 'Pending' :
                                transaction.paymentStatus === 'failed' ? 'Failed' :
                                transaction.paymentStatus || 'Unknown'
                              }
                              size="small"
                              color={
                                transaction.paymentStatus === 'completed' ? 'success' :
                                transaction.paymentStatus === 'pending' ? 'warning' :
                                transaction.paymentStatus === 'failed' ? 'error' :
                                'default'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
          <Button 
            onClick={() => setTransactionHistoryOpen(false)}
            variant="contained"
            sx={{ 
              backgroundColor: '#7c3aed',
              '&:hover': { backgroundColor: '#5b21b6' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Marketplace;