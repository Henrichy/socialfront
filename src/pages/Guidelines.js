import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const Guidelines = () => {
  const securityGuidelines = [
    {
      title: "Change Password Immediately",
      description: "Always change the account password as soon as you receive it. Use a strong, unique password that you haven't used elsewhere.",
      icon: <LockIcon sx={{ color: '#7c3aed' }} />
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Set up 2FA on all accounts where available. This adds an extra layer of security to protect your investment.",
      icon: <ShieldIcon sx={{ color: '#7c3aed' }} />
    },
    {
      title: "Update Recovery Information",
      description: "Change the recovery email and phone number to your own. This ensures you can recover the account if needed.",
      icon: <SecurityIcon sx={{ color: '#7c3aed' }} />
    },
    {
      title: "Review Privacy Settings",
      description: "Check and adjust privacy settings according to your needs. Make sure the account visibility matches your requirements.",
      icon: <VisibilityIcon sx={{ color: '#7c3aed' }} />
    }
  ];

  const usageGuidelines = [
    "Use accounts responsibly and in compliance with platform terms of service",
    "Avoid suspicious activities that might trigger security reviews",
    "Don't share account credentials with unauthorized persons",
    "Gradually increase activity levels rather than sudden spikes",
    "Keep accounts active with regular, natural usage patterns",
    "Respect platform community guidelines and posting policies",
    "Use appropriate profile information and avoid fake details",
    "Don't use accounts for spam, harassment, or illegal activities"
  ];

  const bestPractices = [
    {
      category: "Account Management",
      tips: [
        "Keep a secure record of all account credentials",
        "Use different passwords for each account",
        "Regularly monitor account activity and notifications",
        "Update contact information to your own details"
      ]
    },
    {
      category: "Security Practices",
      tips: [
        "Use VPN when accessing accounts from new locations",
        "Enable login notifications and alerts",
        "Regularly review connected apps and permissions",
        "Keep recovery codes in a safe place"
      ]
    },
    {
      category: "Platform Compliance",
      tips: [
        "Follow each platform's community guidelines",
        "Avoid automated tools that violate terms of service",
        "Post authentic, original content when possible",
        "Engage naturally with other users and content"
      ]
    }
  ];

  const warningItems = [
    "Account suspensions due to policy violations are not covered by our guarantee",
    "Using accounts for illegal activities will result in immediate termination of service",
    "Sharing purchased accounts with others may compromise security",
    "Failure to secure accounts properly may result in unauthorized access"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: { xs: 4, sm: 6 } }}>
        <AssignmentIcon sx={{ fontSize: 60, color: '#7c3aed', mb: 2 }} />
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#7c3aed',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Usage Guidelines
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}
        >
          Follow these guidelines to ensure the security, longevity, and proper usage of your purchased accounts.
        </Typography>
      </Box>

      {/* Important Notice */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Important Notice
        </Typography>
        Please read these guidelines carefully before using your purchased accounts. Following these recommendations will help ensure account security and compliance with platform policies.
      </Alert>

      {/* Security Guidelines */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            mb: 4, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Security Guidelines
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {securityGuidelines.map((guideline, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: 2, 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {guideline.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}
                      >
                        {guideline.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
                      >
                        {guideline.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Usage Guidelines */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            mb: 4, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Usage Guidelines
        </Typography>
        
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <List>
            {usageGuidelines.map((guideline, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#16a34a' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={guideline}
                  primaryTypographyProps={{
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Best Practices */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            mb: 4, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Best Practices
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {bestPractices.map((practice, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon sx={{ color: '#7c3aed', mr: 1 }} />
                    <Typography 
                      variant="h6"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}
                    >
                      {practice.category}
                    </Typography>
                  </Box>
                  <List dense>
                    {practice.tips.map((tip, tipIndex) => (
                      <ListItem key={tipIndex} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip}
                          primaryTypographyProps={{
                            fontSize: { xs: '0.85rem', sm: '0.9rem' }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Warnings */}
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Important Warnings
        </Typography>
        <List dense>
          {warningItems.map((warning, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <WarningIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText 
                primary={warning}
                primaryTypographyProps={{
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Alert>

      {/* Footer Note */}
      <Paper 
        elevation={1}
        sx={{ 
          p: { xs: 3, sm: 4 },
          backgroundColor: '#f8fafc',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <InfoIcon sx={{ fontSize: 40, color: '#7c3aed', mb: 2 }} />
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: '#7c3aed',
            fontWeight: 600,
            mb: 2
          }}
        >
          Need Help?
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          If you have questions about these guidelines or need assistance with your accounts, 
          our support team is available 24/7 to help you.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip 
            label="WhatsApp Support" 
            clickable 
            sx={{ backgroundColor: '#25D366', color: 'white' }}
            onClick={() => window.open('https://chat.whatsapp.com/DUx6ttrlnW6Bt4aXoImIBs', '_blank')}
          />
          <Chip 
            label="Email Support" 
            clickable 
            sx={{ backgroundColor: '#7c3aed', color: 'white' }}
            onClick={() => window.open('mailto:support@accvaultng.com', '_blank')}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Guidelines;