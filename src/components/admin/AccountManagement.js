import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await apiClient.get(getEndpoint('ADMIN', 'ACCOUNTS'));
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Typography>Loading accounts...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ color: '#7c3aed', fontWeight: 'bold', mb: 3 }}>
        Account Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Platform</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Followers</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Seller</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.title}</TableCell>
                <TableCell>
                  <Chip
                    label={account.platform}
                    size="small"
                    sx={{ backgroundColor: '#7c3aed', color: 'white' }}
                  />
                </TableCell>
                <TableCell>{account.category?.name || 'No Category'}</TableCell>
                <TableCell>${account.price}</TableCell>
                <TableCell>{account.followers?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={account.isAvailable ? 'Available' : 'Sold'}
                    color={account.isAvailable ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{account.seller?.name || 'Unknown'}</TableCell>
                <TableCell>{formatDate(account.createdAt)}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountManagement;