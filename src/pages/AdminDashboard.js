import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DashboardStats from '../components/admin/DashboardStats';
import CategoryManagement from '../components/admin/CategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import UserManagement from '../components/admin/UserManagement';
import AccountManagement from '../components/admin/AccountManagement';
import CryptoSettings from '../components/admin/CryptoSettings';
import WhatsAppPaymentSettings from '../components/admin/WhatsAppPaymentSettings';
import WhatsAppPaymentVerification from '../components/admin/WhatsAppPaymentVerification';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#7c3aed', 
          fontWeight: 'bold',
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Admin Dashboard
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          textAlign: { xs: 'center', sm: 'left' },
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}
      >
        Manage your ACCVAULTNG platform
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                minWidth: { xs: 80, sm: 120 }
              },
              '& .Mui-selected': {
                color: '#7c3aed'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#7c3aed'
              }
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Categories" />
            <Tab label="Products" />
            <Tab label="Users" />
            <Tab label="All Products" />
            <Tab label="Crypto Settings" />
            <Tab label="WhatsApp Payment" />
            <Tab label="Payment Verification" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DashboardStats />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CategoryManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ProductManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <UserManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <AccountManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <CryptoSettings />
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          <WhatsAppPaymentSettings />
        </TabPanel>

        <TabPanel value={tabValue} index={7}>
          <WhatsAppPaymentVerification />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;