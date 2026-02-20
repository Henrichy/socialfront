import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PaymentContinuation from '../components/PaymentContinuation';

const ContinuePayment = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  const handlePaymentComplete = (orderDetails) => {
    setModalOpen(false);
    navigate('/order-success', {
      state: { orderDetails }
    });
  };

  const handleClose = () => {
    setModalOpen(false);
    navigate('/cart');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#7c3aed', fontWeight: 'bold' }}>
              Continue Your Payment
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Enter your payment code to continue with your bank payment.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setModalOpen(true)}
              sx={{
                backgroundColor: '#25D366',
                '&:hover': { backgroundColor: '#1da851' },
                px: 4,
                py: 1.5
              }}
            >
              Continue Payment
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <PaymentContinuation
        open={modalOpen}
        onClose={handleClose}
        onPaymentComplete={handlePaymentComplete}
      />
    </Container>
  );
};

export default ContinuePayment;