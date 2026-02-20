import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ShieldIcon from '@mui/icons-material/Shield';
import PaymentIcon from '@mui/icons-material/Payment';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Home = () => {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Authenticity',
      description: 'ACCVAULTNG ensures quality and accuracy by thoroughly reviewing all records before making them live. This process helps maintain standards and prevent errors.'
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Accountability',
      description: 'Always secure your accounts shortly after logging in to ensure their safety. Ignorance of the rules does not exempt users from accountability.'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Verified Quality',
      description: 'Every account in our store is carefully checked and validated. We guarantee top quality and stand behind everything we offer.'
    }
  ];

  const services = [
    {
      icon: <SwapHorizIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Replacement Policy',
      description: 'We provide replacements for faulty accounts, but only if the issue is on our end and not due to usage.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Support Service',
      description: 'Our technical support team is available 24/7 to address any issues or concerns.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Secure Account Transfer',
      description: 'All accounts undergo thorough checks using our private program and mobile proxy to ensure 100% validity.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Secure Transactions',
      description: 'Shop confidently, knowing our platform keeps you secure. Your payments are protected, ensuring safety for all clients.'
    }
  ];

  const accountTypes = [
    'Facebook (Below 50 Friends)',
    'Facebook (Standard)',
    'Instagram',
    'Texting Apps',
    'Twitter',
    'TikTok',
    'Rare Social Accounts',
    'Dating App Accounts',
    'VPN Services',
    'Proxy Services'
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white',
          py: { xs: 6, sm: 8, md: 10 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.75rem' }
            }}
          >
            ACCVAULTNG
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Your Sure Plug for Everything Social Media!
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.8,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
              lineHeight: { xs: 1.4, sm: 1.5 },
              px: { xs: 1, sm: 2, md: 0 }
            }}
          >
            Skip the hassle of creating and managing new social media accounts. Our platform offers a wide range of ready-made accounts for immediate use. Whether you need them for business, personal use, or special projects, we make buying social media accounts simple, secure, and convenient.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/marketplace"
            sx={{
              backgroundColor: 'white',
              color: '#7c3aed',
              px: { xs: 3, sm: 4 },
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f8fafc',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
              }
            }}
          >
            Explore Marketplace
          </Button>
        </Container>
      </Box>

      {/* Account Types Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            mb: { xs: 4, sm: 6 }, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Shop Social Media Accounts with Ease
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 6 }}>
          {accountTypes.map((type, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)',
                    backgroundColor: '#f8fafc'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  sx={{ 
                    color: '#7c3aed',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }}
                >
                  {type}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 } }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            mb: { xs: 4, sm: 6 }, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Why Choose ACCVAULTNG?
        </Typography>
        
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: { xs: 2, sm: 3 },
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-4px)' }
                }
              }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: { xs: 6, sm: 8 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              color: '#7c3aed',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Our Features
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              color: 'text.secondary',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            ACCVAULTNG Has Many Features
          </Typography>
          <Typography 
            variant="body1" 
            textAlign="center" 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Our services come with a satisfaction guarantee. We ensure quality results through our proven methodologies.
          </Typography>
          
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  p: { xs: 2, sm: 3 },
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-4px)' }
                  }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      backgroundColor: '#f3f4f6', 
                      borderRadius: 2, 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {service.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          color: '#7c3aed',
                          fontWeight: 600
                        }}
                      >
                        {index + 1}. {service.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                      >
                        {service.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8 }, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Ready to Start your Journey
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            px: { xs: 2, sm: 0 }
          }}
        >
          Explore our marketplace now and unlock a world of genuine accounts. Join ACCVAULTNG today and experience a new way to buy and connect.
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          px: { xs: 2, sm: 0 }
        }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/marketplace"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: { xs: '200px', sm: 'auto' },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)'
              }
            }}
          >
            Explore Marketplace
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              minWidth: { xs: '200px', sm: 'auto' }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        py: { xs: 4, sm: 6 },
        mt: 4
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {/* Company Info */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#7c3aed',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ACCVAULTNG
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2, 
                  color: '#d1d5db',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Your trusted marketplace for premium social media accounts and digital services.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FacebookIcon sx={{ color: '#7c3aed', cursor: 'pointer', '&:hover': { color: '#a855f7' } }} />
                <InstagramIcon sx={{ color: '#7c3aed', cursor: 'pointer', '&:hover': { color: '#a855f7' } }} />
                <TwitterIcon sx={{ color: '#7c3aed', cursor: 'pointer', '&:hover': { color: '#a855f7' } }} />
                <LinkedInIcon sx={{ color: '#7c3aed', cursor: 'pointer', '&:hover': { color: '#a855f7' } }} />
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  component={Link} 
                  to="/marketplace" 
                  variant="body2" 
                  sx={{ 
                    color: '#d1d5db', 
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  Marketplace
                </Typography>
                <Typography 
                  component={Link} 
                  to="/register" 
                  variant="body2" 
                  sx={{ 
                    color: '#d1d5db', 
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  Register
                </Typography>
                <Typography 
                  component={Link} 
                  to="/login" 
                  variant="body2" 
                  sx={{ 
                    color: '#d1d5db', 
                    textDecoration: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': { color: '#7c3aed' }
                  }}
                >
                  Login
                </Typography>
              </Box>
            </Grid>

            {/* Services */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Social Media Accounts
                </Typography>
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Dating App Accounts
                </Typography>
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  VPN Services
                </Typography>
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Proxy Services
                </Typography>
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                  <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    support@accvaultng.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                  <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    +234 (0) 123 456 7890
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                  <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Lagos, Nigeria
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, backgroundColor: '#374151' }} />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#9ca3af',
                fontSize: { xs: '0.75rem', sm: '0.8rem' }
              }}
            >
              © 2024 ACCVAULTNG. All rights reserved.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#9ca3af', 
                  cursor: 'pointer',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  '&:hover': { color: '#7c3aed' }
                }}
              >
                Privacy Policy
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#9ca3af', 
                  cursor: 'pointer',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  '&:hover': { color: '#7c3aed' }
                }}
              >
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;