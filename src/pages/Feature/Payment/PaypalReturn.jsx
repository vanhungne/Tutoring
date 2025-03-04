import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { CheckCircle, Error, ArrowForward } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaypalReturn = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [bookingId, setBookingId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePaypalReturn = async () => {
            try {
                // Parse query parameters from URL
                const queryParams = new URLSearchParams(location.search);
                const success = queryParams.get('success');
                const orderId = queryParams.get('order_id');
                const token = queryParams.get('token');
                const payerId = queryParams.get('PayerID');

                if (!orderId || !token) {
                    setStatus('error');
                    setMessage('Missing required payment information');
                    return;
                }

                // Extract booking ID from order_id (format: bookingId-timestamp)
                const extractedBookingId = orderId.split('-')[0];
                setBookingId(extractedBookingId);

                // Call your backend API to complete the payment
                const response = await axios.get(
                    `https://localhost:7184/api/payment/paypal_return?success=${success}&order_id=${orderId}&token=${token}&PayerID=${payerId}`
                );

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Payment completed successfully!');
                    toast.success('Payment completed successfully!');
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Payment processing failed');
                    toast.error('Payment processing failed');
                }
            } catch (error) {
                console.error('Error processing PayPal return:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred while processing your payment');
                toast.error('An error occurred while processing your payment');
            }
        };

        handlePaypalReturn();
    }, [location]);

    const goToBookings = () => {
        navigate('/order-history');
    };

    const goToPaymentSuccess = () => {
        if (bookingId) {
            navigate(`/payment-success/${bookingId}`);
        } else {
            navigate('/');
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
            <Paper elevation={3} sx={{ maxWidth: 500, width: '100%', p: 4, borderRadius: 2 }}>
                {status === 'loading' && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={60} sx={{ mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Processing Payment
                        </Typography>
                        <Typography color="text.secondary">
                            Please wait while we confirm your payment...
                        </Typography>
                    </Box>
                )}

                {status === 'success' && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Payment Successful!
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            {message}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={goToPaymentSuccess}
                                endIcon={<ArrowForward />}
                                sx={{
                                    bgcolor: '#fe7aac',
                                    color: 'black',
                                    '&:hover': {
                                        bgcolor: '#ff9fc3',
                                    },
                                }}
                            >
                                View Payment Details
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={goToBookings}
                            >
                                View All Bookings
                            </Button>
                        </Box>
                    </Box>
                )}

                {status === 'error' && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Payment Failed
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            {message}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={goToHome}
                            sx={{
                                bgcolor: '#fe7aac',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: '#ff9fc3',
                                },
                            }}
                        >
                            Return to Home
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PaypalReturn;