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
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  AccountBalance as BankIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';

const WhatsAppPaymentSettings = () => {
  const [settings, setSettings] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    instructions: '',
    isEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get(getEndpoint('WHATSAPP', 'SETTINGS'));
      if (response.data.success) {
        const { settings: fetchedSettings } = response.data;
        setSettings({
          bankName: fetchedSettings.bankName || '',
          accountName: fetchedSettings.accountName || '',
          accountNumber: fetchedSettings.accountNumber || '',
          instructions: fetchedSettings.instructions || '',
          isEnabled: fetchedSettings.isEnabled || false
        });
      }
    } catch (error) {
      console.error('Error fetching WhatsApp payment settings:', error);
      setMessage({ type: 'error', text: 'Failed to load WhatsApp payment settings' });
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate required fields if enabling
    if (settings.isEnabled && (!settings.bankName.trim() || !settings.accountName.trim() || !settings.accountNumber.trim())) {
      setMessage({ 
        type: 'error', 
        text: 'Bank name, account name, and account number are required when enabling WhatsApp payment' 
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.put(getEndpoint('WHATSAPP', 'SETTINGS'), settings);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'WhatsApp payment settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update settings' });
      }
    } catch (error) {
      console.error('Error updating WhatsApp payment settings:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update WhatsApp payment settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateAccounts = async () => {
    setMigrating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await apiClient.post(`${getEndpoint('WHATSAPP', 'SETTINGS').replace('/settings', '')}/migrate-accounts`);
      
      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: `Migration completed! ${response.data.migratedCount} accounts were updated.` 
        });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Migration failed' });
      }
    } catch (error) {
      console.error('Error running migration:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to run migration' 
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <WhatsAppIcon color="success" />
        Bank Payment Settings
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure bank account details for WhatsApp verification payments. Users will transfer to this account and provide a payment code for verification.
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Enable/Disable Toggle */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.isEnabled}
                    onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                    color="success"
                  />
                }
                label={
                  <Box>
                    <Typography variant="h6">
                      Enable WhatsApp Bank Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Allow users to pay via bank transfer with WhatsApp verification
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Bank Account Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BankIcon />
                Bank Account Details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={settings.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="e.g., First Bank of Nigeria"
                    variant="outlined"
                    required={settings.isEnabled}
                    error={settings.isEnabled && !settings.bankName.trim()}
                    helperText={settings.isEnabled && !settings.bankName.trim() ? 'Required when payment is enabled' : ''}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Name"
                    value={settings.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    placeholder="e.g., ACCVAULT NIGERIA"
                    variant="outlined"
                    required={settings.isEnabled}
                    error={settings.isEnabled && !settings.accountName.trim()}
                    helperText={settings.isEnabled && !settings.accountName.trim() ? 'Required when payment is enabled' : ''}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={settings.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="e.g., 1234567890"
                    variant="outlined"
                    required={settings.isEnabled}
                    error={settings.isEnabled && !settings.accountNumber.trim()}
                    helperText={settings.isEnabled && !settings.accountNumber.trim() ? 'Required when payment is enabled' : ''}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Instructions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Instructions shown to users during the payment process
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Instructions"
                value={settings.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Enter instructions for users on how to complete the payment..."
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleMigrateAccounts}
              disabled={migrating}
              startIcon={migrating ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {migrating ? 'Migrating...' : 'Fix Account Data'}
            </Button>
            
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSave}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Use "Fix Account Data" if you encounter errors with payment verification
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhatsAppPaymentSettings;