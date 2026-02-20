import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Category as CategoryIcon,
  AccountBox as AccountBoxIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import apiClient from '../../utils/axios';
import { getEndpoint } from '../../config/api';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.7 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalAccounts: 0,
    availableAccounts: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get(getEndpoint('ADMIN', 'STATS'));
      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers);
      setRecentAccounts(response.data.recentAccounts);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#7c3aed"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={<CategoryIcon sx={{ fontSize: 40 }} />}
            color="#059669"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Accounts"
            value={stats.totalAccounts}
            icon={<AccountBoxIcon sx={{ fontSize: 40 }} />}
            color="#dc2626"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={stats.availableAccounts}
            icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
            color="#ea580c"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed' }}>
                Recent Users
              </Typography>
              <List>
                {recentUsers.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <ListItem>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.email} • ${user.role}`}
                      />
                    </ListItem>
                    {index < recentUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#7c3aed' }}>
                Recent Accounts
              </Typography>
              <List>
                {recentAccounts.map((account, index) => (
                  <React.Fragment key={account._id}>
                    <ListItem>
                      <ListItemText
                        primary={account.title}
                        secondary={`${account.platform} • $${account.price} • ${account.category?.name || 'No Category'}`}
                      />
                    </ListItem>
                    {index < recentAccounts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;