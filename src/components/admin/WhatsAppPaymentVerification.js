import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';

const WhatsAppPaymentVerification = () => {
  const [pendingCodes, setPendingCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCode, setSelectedCode] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchPendingCodes();
  }, []);

  const fetchPendingCodes = async () => {
    setRefreshing(true);
    try {
      const response = await apiClient.get(getEndpoint('WHATSAPP', 'PENDING_CODES'));
      if (response.data.success) {
        setPendingCodes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending codes:', error);
      setMessage({ type: 'error', text: 'Failed to load pending payment codes' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a payment code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await apiClient.post(getEndpoint('WHATSAPP', 'VERIFY_CODE'), {
        code: verificationCode.trim()
      });

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: `Payment verified successfully! Order ${response.data.data.orderNumber} created for ${response.data.data.buyerName}` 
        });
        setVerificationCode('');
        fetchPendingCodes(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to verify payment' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to verify payment code' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (code) => {
    setSelectedCode(code);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'verified': return 'success';
      case 'expired': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon />;
      case 'verified': return <CheckIcon />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <VerifiedIcon color="success" />
        WhatsApp Payment Verification
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Verify payment codes provided by users after they complete bank transfers.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      {/* Manual Verification Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Verify Payment Code
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the payment code provided by the user to verify their payment and create their order.
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Payment Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="e.g., WA123456ABCD"
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyCode();
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
                onClick={handleVerifyCode}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
              >
                {loading ? 'Verifying...' : 'Verify Payment'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pending Codes Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Pending Payment Codes ({pendingCodes.length})
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchPendingCodes}
              disabled={refreshing}
              startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No pending payment codes found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingCodes.map((code) => (
                    <TableRow key={code._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {code.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{code.buyer.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {code.buyer.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(code.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {code.cartItems.length} item{code.cartItems.length !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(code.createdAt), 'MMM dd, HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error">
                          {format(new Date(code.expiresAt), 'MMM dd, HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={code.status}
                          color={getStatusColor(code.status)}
                          size="small"
                          icon={getStatusIcon(code.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(code)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Payment Code Details</DialogTitle>
        <DialogContent>
          {selectedCode && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Payment Code</Typography>
                <Typography variant="h6" gutterBottom>{selectedCode.code}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                <Typography variant="h6" gutterBottom>{formatCurrency(selectedCode.totalAmount)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Buyer Information</Typography>
                <Typography variant="body1">{selectedCode.buyer.name}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedCode.buyer.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Items</Typography>
                {selectedCode.cartItems.map((item, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhatsAppPaymentVerification;