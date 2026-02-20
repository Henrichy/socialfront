import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Support as SupportIcon,
  LiveHelp as LiveHelpIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';

const Support = () => {
  const faqs = [
    {
      question: "How do I purchase an account?",
      answer: "Simply browse our marketplace, select the account you want, add it to your cart, and proceed to checkout. You'll receive the account details immediately after payment confirmation."
    },
    {
      question: "Are the accounts guaranteed to work?",
      answer: "Yes! All our accounts are thoroughly tested before listing. We provide a replacement guarantee if there are any issues on our end within the first 24 hours of purchase."
    },
    {
      question: "How quickly will I receive my account details?",
      answer: "Account details are delivered instantly to your email and dashboard after successful payment. Most customers receive their accounts within 1-5 minutes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, cryptocurrency, and mobile money. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer replacements for faulty accounts within 24 hours. Refunds are considered on a case-by-case basis for accounts that don't meet the described specifications."
    },
    {
      question: "How do I secure my purchased account?",
      answer: "Immediately after receiving your account, change the password, enable two-factor authentication, and update the recovery information. This ensures maximum security for your new account."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes! We offer attractive discounts for bulk purchases. Contact our support team with your requirements, and we'll provide you with a custom quote."
    },
    {
      question: "What if my account gets suspended?",
      answer: "Account suspensions due to platform policy changes are not covered by our guarantee. However, we provide guidelines on how to maintain your accounts safely to minimize risks."
    }
  ];

  const supportChannels = [
    {
      title: "WhatsApp Support",
      description: "Get instant help through WhatsApp",
      icon: <WhatsAppIcon sx={{ fontSize: 40, color: '#25D366' }} />,
      action: "Chat Now",
      link: "https://chat.whatsapp.com/DUx6ttrlnW6Bt4aXoImIBs",
      availability: "24/7 Available"
    },
    {
      title: "Email Support",
      description: "Send us detailed inquiries",
      icon: <EmailIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      action: "Send Email",
      link: "mailto:support@accvaultng.com",
      availability: "Response within 2 hours"
    },
    {
      title: "Live Chat",
      description: "Real-time assistance",
      icon: <LiveHelpIcon sx={{ fontSize: 40, color: '#7c3aed' }} />,
      action: "Start Chat",
      link: "#",
      availability: "9 AM - 11 PM WAT"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: { xs: 4, sm: 6 } }}>
        <SupportIcon sx={{ fontSize: 60, color: '#7c3aed', mb: 2 }} />
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
          Support Center
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            maxWidth: '600px', 
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
          }}
        >
          We're here to help! Get assistance with your account purchases, technical issues, or any questions you might have.
        </Typography>
      </Box>

      {/* Support Channels */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            mb: 4, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Get Help Now
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {supportChannels.map((channel, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  transition: 'all 0.3s ease',
                  width: '320px',
                  mx: 'auto',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-8px)' },
                    boxShadow: { xs: '0 4px 20px rgba(124, 58, 237, 0.15)', sm: '0 12px 40px rgba(124, 58, 237, 0.2)' }
                  }
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  minHeight: { xs: '200px', sm: '220px' }
                }}>
                  <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                    {channel.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      mb: { xs: 1, sm: 1.5 }
                    }}
                  >
                    {channel.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.875rem', sm: '0.9rem' },
                      textAlign: 'center'
                    }}
                  >
                    {channel.description}
                  </Typography>
                  <Chip 
                    label={channel.availability}
                    size="small"
                    sx={{ 
                      mb: { xs: 2, sm: 3 },
                      backgroundColor: '#f0fdf4',
                      color: '#16a34a',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    href={channel.link}
                    target={channel.link.startsWith('http') ? '_blank' : '_self'}
                    sx={{
                      backgroundColor: channel.title === 'WhatsApp Support' ? '#25D366' : '#7c3aed',
                      py: { xs: 1, sm: 1.2 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: channel.title === 'WhatsApp Support' ? '#1da851' : '#5b21b6'
                      }
                    }}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            mb: 4, 
            color: '#7c3aed',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index}
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px !important',
                '&.Mui-expanded': {
                  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0'
                  }
                }}
              >
                <Typography 
                  variant="h6"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography 
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* Contact Information */}
      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 3, sm: 4 },
          backgroundColor: '#f8fafc',
          borderRadius: 3
        }}
      >
        <Typography 
          variant="h5" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            color: '#7c3aed',
            fontWeight: 600,
            mb: 3
          }}
        >
          Still Need Help?
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '100px'
            }}>
              <EmailIcon sx={{ fontSize: 32, color: '#7c3aed', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Email Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                support@accvaultng.com
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '100px'
            }}>
              <PhoneIcon sx={{ fontSize: 32, color: '#7c3aed', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Call Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                +234 (0) 123 456 7890
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '100px'
            }}>
              <AccessTimeIcon sx={{ fontSize: 32, color: '#7c3aed', mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Business Hours
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
                24/7 Support Available
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Support;