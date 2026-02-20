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
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import apiClient from '../utils/axios';
import { getEndpoint } from '../config/api';

const WhatsAppPaymentModal = ({ 
  open, 
  onClose, 
  totalAmount, 
  cartItems,
  onPaymentComplete,
  onPaymentSuccess,
  isWalletFunding = false
}) => {
  const [whatsappSettings, setWhatsappSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [paymentCode, setPaymentCode] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [canClose, setCanClose] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    if (open) {
      fetchWhatsAppSettings();
      
      // Check if there's an existing payment in progress
      const existingPayment = localStorage.getItem('whatsapp_payment_in_progress');
      if (existingPayment) {
        try {
          const paymentData = JSON.parse(existingPayment);
          
          // Verify this payment matches current amount and is still pending
          if (paymentData.totalAmount === totalAmount && paymentData.code) {
            // Check if payment is still pending (not verified or expired)
            apiClient.get(`${getEndpoint('WHATSAPP', 'CODE_STATUS')}/${paymentData.code}`)
              .then(response => {
                if (response.data.success) {
                  const status = response.data.data.status;
                  
                  if (status === 'pending') {
                    // Only resume if payment is still pending
                    setPaymentCode(paymentData);
                    setActiveStep(2); // Go to step 3 (payment code already generated)
                    setMessage({ type: 'info', text: 'Continuing your previous payment...' });
                  } else {
                    // Payment is verified or expired, clear it
                    localStorage.removeItem('whatsapp_payment_in_progress');
                    setActiveStep(0);
                    setPaymentCode(null);
                  }
                }
              })
              .catch(() => {
                // If check fails, clear the payment
                localStorage.removeItem('whatsapp_payment_in_progress');
                setActiveStep(0);
                setPaymentCode(null);
              });
          } else {
            // Amount doesn't match or no code, clear old payment data
            localStorage.removeItem('whatsapp_payment_in_progress');
            setActiveStep(0);
            setPaymentCode(null);
          }
        } catch (error) {
          localStorage.removeItem('whatsapp_payment_in_progress');
          setActiveStep(0);
          setPaymentCode(null);
        }
      } else {
        // No existing payment, start fresh
        setActiveStep(0);
        setPaymentCode(null);
        setCanClose(true);
      }
      
      if (!message.text) {
        setMessage({ type: '', text: '' });
      }
    }
  }, [open, totalAmount]);

  // Separate effect to handle step advancement when payment code is generated
  useEffect(() => {
    if (paymentCode && activeStep === 0) {
      setActiveStep(1);
    }
  }, [paymentCode, activeStep]);

  // Auto-check payment verification when reaching step 3 for wallet funding
  useEffect(() => {
    if (activeStep === 2 && isWalletFunding && paymentCode && !paymentVerified) {
      checkPaymentVerification();
    }
  }, [activeStep, isWalletFunding]);

  const fetchWhatsAppSettings = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WHATSAPP', 'SETTINGS'));
      if (response.data.success) {
        setWhatsappSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      setMessage({ type: 'error', text: 'Failed to load payment settings' });
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentCode = async () => {
    setGeneratingCode(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await apiClient.post(getEndpoint('WHATSAPP', 'GENERATE_CODE'), {
        cartItems,
        totalAmount
      });

      if (response.data.success) {
        const codeData = response.data.data;
        setPaymentCode(codeData);
        setActiveStep(1);
        setCanClose(false); // Prevent closing once payment code is generated
        setMessage({ type: 'success', text: 'Payment code generated successfully!' });
        
        // Store payment in progress
        localStorage.setItem('whatsapp_payment_in_progress', JSON.stringify({
          ...codeData,
          cartItems,
          totalAmount,
          timestamp: Date.now()
        }));
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to generate payment code' });
      }
    } catch (error) {
      console.error('Error generating payment code:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to generate payment code' 
      });
    } finally {
      setGeneratingCode(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentCode) return;

    setCheckingStatus(true);
    try {
      const response = await apiClient.get(`${getEndpoint('WHATSAPP', 'CODE_STATUS')}/${paymentCode.code}`);
      
      if (response.data.success) {
        const status = response.data.data.status;
        
        if (status === 'verified') {
          // Clear payment in progress immediately
          localStorage.removeItem('whatsapp_payment_in_progress');
          setCanClose(true);
          
          if (isWalletFunding) {
            setMessage({ type: 'success', text: 'Payment verified! Your wallet has been funded.' });
            
            // Call onPaymentSuccess to refresh wallet balance
            if (onPaymentSuccess) {
              onPaymentSuccess(paymentCode.code, 'whatsapp-bank', paymentCode.totalAmount);
            }
            
            // Close modal after a short delay
            setTimeout(() => {
              onClose();
              // Reset modal state
              setActiveStep(0);
              setPaymentCode(null);
              setMessage({ type: '', text: '' });
              setReceiptFile(null);
              setPaymentVerified(false);
            }, 2000);
          } else {
            setMessage({ type: 'success', text: 'Payment verified! Your order has been created.' });
            
            // For regular orders, call onPaymentComplete
            if (onPaymentComplete) {
              setTimeout(() => {
                onPaymentComplete(response.data.data.order || {
                  orderNumber: response.data.data.orderNumber,
                  paymentMethod: 'whatsapp-bank',
                  paymentReference: paymentCode.code,
                  totalAmount: paymentCode.totalAmount
                });
              }, 2000);
            }
          }
        } else if (status === 'expired') {
          setMessage({ type: 'error', text: 'Payment code has expired. Please generate a new one.' });
          setCanClose(true);
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

  const handleClose = () => {
    if (canClose || activeStep === 0) {
      // Reset all state when closing
      setActiveStep(0);
      setPaymentCode(null);
      setMessage({ type: '', text: '' });
      setReceiptFile(null);
      setPaymentVerified(false);
      setCanClose(true);
      
      // Clear any payment in progress
      localStorage.removeItem('whatsapp_payment_in_progress');
      
      onClose();
    } else {
      // Show warning about ongoing payment
      setMessage({ 
        type: 'warning', 
        text: 'Payment is in progress. Please complete the process or it will be saved for later.' 
      });
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

  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please upload an image (JPG, PNG, GIF) or PDF file.' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB.' });
        return;
      }
      
      setReceiptFile(file);
      setMessage({ type: 'success', text: 'Receipt uploaded successfully!' });
    }
  };

  const submitReceiptAndComplete = async () => {
    if (!receiptFile) {
      setMessage({ type: 'error', text: 'Please upload a transaction receipt first.' });
      return;
    }

    if (!paymentVerified) {
      setMessage({ type: 'error', text: 'Please wait for admin to verify your payment before submitting receipt.' });
      return;
    }

    setUploadingReceipt(true);
    
    try {
      // For wallet funding, we'll simulate the upload and call onPaymentSuccess
      // In a real implementation, you would upload the file to your server
      
      setTimeout(() => {
        if (isWalletFunding && onPaymentSuccess) {
          onPaymentSuccess(paymentCode.code);
          setMessage({ type: 'success', text: 'Receipt uploaded! Your wallet will be credited after verification.' });
          setCanClose(true);
          
          // Clear payment in progress
          localStorage.removeItem('whatsapp_payment_in_progress');
          
          // Close modal after success
          setTimeout(() => {
            onClose();
            setActiveStep(0);
            setPaymentCode(null);
            setMessage({ type: '', text: '' });
            setReceiptFile(null);
            setPaymentVerified(false);
          }, 2000);
        }
        setUploadingReceipt(false);
      }, 1500); // Simulate upload time
      
    } catch (error) {
      console.error('Error uploading receipt:', error);
      setMessage({ type: 'error', text: 'Failed to upload receipt. Please try again.' });
      setUploadingReceipt(false);
    }
  };

  const checkPaymentVerification = async () => {
    if (!paymentCode) return;
    
    setCheckingVerification(true);
    
    try {
      const response = await apiClient.get(`${getEndpoint('WHATSAPP', 'CODE_STATUS')}/${paymentCode.code}`);
      
      if (response.data.success) {
        const status = response.data.data.status;
        
        if (status === 'verified') {
          setPaymentVerified(true);
          setMessage({ type: 'success', text: 'Payment verified! You can now submit your receipt.' });
        } else if (status === 'expired') {
          setMessage({ type: 'error', text: 'Payment code has expired. Please generate a new one.' });
          setCanClose(true);
          localStorage.removeItem('whatsapp_payment_in_progress');
        } else {
          setPaymentVerified(false);
          setMessage({ type: 'info', text: 'Payment is still pending admin verification. Please wait...' });
        }
      }
    } catch (error) {
      console.error('Error checking payment verification:', error);
      setMessage({ type: 'error', text: 'Failed to check payment status' });
    } finally {
      setCheckingVerification(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!whatsappSettings?.isEnabled) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Method Unavailable</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Bank payment is currently not available. Please choose another payment method.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableEscapeKeyDown={!canClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <WhatsAppIcon color="success" />
        Bank Payment
        {!canClose && (
          <Chip 
            label="Payment in Progress" 
            color="warning" 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        )}
      </DialogTitle>
      
      <DialogContent>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        {/* Order Summary */}
        {isWalletFunding ? (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Wallet Funding</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="h6">Amount to Add:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(totalAmount)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Items:</Typography>
                <Typography>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(totalAmount)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Payment Steps */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Make Bank Transfer */}
          <Step>
            <StepLabel>Make Bank Transfer</StepLabel>
            <StepContent>
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
                            {formatCurrency(totalAmount)}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => copyToClipboard(totalAmount.toString(), 'amount')}
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

              <Button
                variant="contained"
                color="success"
                onClick={() => setActiveStep(1)}
                fullWidth
                sx={{ mt: 2 }}
              >
                I've Made the Transfer - Continue
              </Button>
            </StepContent>
          </Step>

          {/* Step 2: Upload Receipt */}
          <Step>
            <StepLabel>Upload Transaction Receipt</StepLabel>
            <StepContent>
              <Box sx={{ py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload proof of your bank transfer to proceed.
                </Typography>
                
                {/* File Upload Area */}
                <Paper
                  sx={{
                    border: '2px dashed #7c3aed',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    mb: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(124, 58, 237, 0.05)'
                    }
                  }}
                  onClick={() => document.getElementById('receipt-upload').click()}
                >
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {receiptFile ? (
                    <Box>
                      <CheckIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                      <Typography variant="h6" color="success.main" gutterBottom>
                        Receipt Uploaded
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {receiptFile.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('receipt-upload').click();
                        }}
                        sx={{ mt: 1 }}
                      >
                        Change File
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <BankIcon sx={{ fontSize: 48, color: '#7c3aed', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Click to Upload Receipt
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Supported formats: JPG, PNG, GIF, PDF (Max 5MB)
                      </Typography>
                    </Box>
                  )}
                </Paper>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setActiveStep(2)}
                  disabled={!receiptFile}
                  fullWidth
                  size="large"
                >
                  Continue to Generate Payment Code
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Generate Payment Code */}
          <Step>
            <StepLabel>Generate Payment Code</StepLabel>
            <StepContent>
              {!paymentCode ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Generate a unique payment code for admin verification.
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={generatePaymentCode}
                    disabled={generatingCode}
                    startIcon={generatingCode ? <CircularProgress size={20} /> : <WhatsAppIcon />}
                    fullWidth
                  >
                    {generatingCode ? 'Generating...' : 'Generate Payment Code'}
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Payment Code Display */}
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Your Payment Code
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {paymentCode.code}
                      </Typography>
                      <IconButton
                        onClick={() => copyToClipboard(paymentCode.code, 'code')}
                        color="success"
                      >
                        <CopyIcon />
                      </IconButton>
                      {copiedField === 'code' && (
                        <Chip label="Copied!" color="success" size="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Expires: {format(new Date(paymentCode.expiresAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Paper>

                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Payment code generated!</strong><br />
                      Send your generated code (ONLY) to admin (09160826808) for approval. Once verified, your wallet will be automatically funded.
                    </Typography>
                  </Alert>

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
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={!canClose && activeStep !== 0}>
          {activeStep === 2 ? 'Continue' : canClose ? 'Cancel' : 'Continue Later'}
        </Button>
        {!canClose && activeStep > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            You can continue this payment later from your cart
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WhatsAppPaymentModal;