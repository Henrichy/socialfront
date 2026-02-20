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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  CurrencyBitcoin as BitcoinIcon,
  AccountBalanceWallet as WalletIcon,
  QrCode as QrCodeIcon,
  WhatsApp as WhatsAppIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';
import { compressImage, validateImageFile, getBase64FileSize } from '../../utils/imageCompression';

const CryptoSettings = () => {
  const [settings, setSettings] = useState({
    bitcoinAddress: '',
    bitcoinQrCode: '',
    usdtAddress: '',
    usdtQrCode: '',
    usdtNetwork: 'TRC20',
    whatsappCommunityLink: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageUploading, setImageUploading] = useState({ bitcoin: false, usdt: false });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get(getEndpoint('CRYPTO', 'SETTINGS'));
      if (response.data.success) {
        const { settings: fetchedSettings } = response.data;
        setSettings({
          bitcoinAddress: fetchedSettings.bitcoin.address || '',
          bitcoinQrCode: fetchedSettings.bitcoin.qrCode || '',
          usdtAddress: fetchedSettings.usdt.address || '',
          usdtQrCode: fetchedSettings.usdt.qrCode || '',
          usdtNetwork: fetchedSettings.usdt.network || 'TRC20',
          whatsappCommunityLink: fetchedSettings.whatsappCommunityLink || '',
          instructions: fetchedSettings.instructions || ''
        });
      }
    } catch (error) {
      console.error('Error fetching crypto settings:', error);
      setMessage({ type: 'error', text: 'Failed to load crypto settings' });
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (field, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const cryptoType = field.includes('bitcoin') ? 'bitcoin' : 'usdt';
    setImageUploading(prev => ({ ...prev, [cryptoType]: true }));
    setMessage({ type: '', text: '' });

    try {
      // Validate file
      const validation = validateImageFile(file, { maxSizeMB: 2 });
      if (!validation.isValid) {
        setMessage({ type: 'error', text: validation.error });
        return;
      }

      // Compress QR code image
      const compressedImage = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.9, // Higher quality for QR codes
        outputFormat: 'png' // PNG is better for QR codes
      });

      const sizeKB = getBase64FileSize(compressedImage);
      console.log(`QR Code compressed: ${file.name} -> ${sizeKB}KB`);

      handleInputChange(field, compressedImage);
      setMessage({ 
        type: 'success', 
        text: `QR code uploaded and compressed successfully (${sizeKB}KB)` 
      });
    } catch (error) {
      console.error('QR code upload error:', error);
      setMessage({ type: 'error', text: 'Failed to process QR code: ' + error.message });
    } finally {
      setImageUploading(prev => ({ ...prev, [cryptoType]: false }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiClient.put(getEndpoint('CRYPTO', 'SETTINGS'), settings);

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Crypto settings updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error updating crypto settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update crypto settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold', mb: 3 }}>
        Crypto Payment Settings
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Bitcoin Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BitcoinIcon sx={{ color: '#f7931a', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Bitcoin (BTC)
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Bitcoin Address"
                value={settings.bitcoinAddress}
                onChange={(e) => handleInputChange('bitcoinAddress', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter Bitcoin wallet address"
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Bitcoin QR Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="bitcoin-qr-upload"
                    type="file"
                    onChange={(e) => handleFileUpload('bitcoinQrCode', e)}
                  />
                  <label htmlFor="bitcoin-qr-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={imageUploading.bitcoin ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
                      disabled={imageUploading.bitcoin}
                      size="small"
                    >
                      {imageUploading.bitcoin ? 'Processing...' : 'Upload QR Code'}
                    </Button>
                  </label>
                </Box>
                {settings.bitcoinQrCode && (
                  <Paper sx={{ p: 1, textAlign: 'center', mt: 1, maxWidth: 200 }}>
                    <img 
                      src={settings.bitcoinQrCode} 
                      alt="Bitcoin QR Code" 
                      style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Size: {getBase64FileSize(settings.bitcoinQrCode)}KB
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* USDT Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WalletIcon sx={{ color: '#26a17b', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  USDT (Tether)
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Network</InputLabel>
                <Select
                  value={settings.usdtNetwork}
                  label="Network"
                  onChange={(e) => handleInputChange('usdtNetwork', e.target.value)}
                >
                  <MenuItem value="TRC20">TRC20 (Tron)</MenuItem>
                  <MenuItem value="ERC20">ERC20 (Ethereum)</MenuItem>
                  <MenuItem value="BEP20">BEP20 (BSC)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="USDT Address"
                value={settings.usdtAddress}
                onChange={(e) => handleInputChange('usdtAddress', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter USDT wallet address"
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  USDT QR Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="usdt-qr-upload"
                    type="file"
                    onChange={(e) => handleFileUpload('usdtQrCode', e)}
                  />
                  <label htmlFor="usdt-qr-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={imageUploading.usdt ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
                      disabled={imageUploading.usdt}
                      size="small"
                    >
                      {imageUploading.usdt ? 'Processing...' : 'Upload QR Code'}
                    </Button>
                  </label>
                </Box>
                {settings.usdtQrCode && (
                  <Paper sx={{ p: 1, textAlign: 'center', mt: 1, maxWidth: 200 }}>
                    <img 
                      src={settings.usdtQrCode} 
                      alt="USDT QR Code" 
                      style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Size: {getBase64FileSize(settings.usdtQrCode)}KB
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* WhatsApp Community Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WhatsAppIcon sx={{ color: '#25d366', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  WhatsApp Community & Instructions
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="WhatsApp Community Link"
                value={settings.whatsappCommunityLink}
                onChange={(e) => handleInputChange('whatsappCommunityLink', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="https://chat.whatsapp.com/your-community-link"
              />

              <TextField
                fullWidth
                label="Payment Instructions"
                value={settings.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                multiline
                rows={4}
                placeholder="Instructions for users after crypto payment..."
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={loading}
              sx={{
                backgroundColor: '#7c3aed',
                '&:hover': { backgroundColor: '#5b21b6' },
                px: 4,
                py: 1.5
              }}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CryptoSettings;