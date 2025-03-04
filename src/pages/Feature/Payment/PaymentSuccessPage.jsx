import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress, Divider, Avatar } from '@mui/material';
import { CheckCircle, ArrowBack, Receipt } from '@mui/icons-material';
import toast from 'react-hot-toast';
import requests from '../../../Utils/requests';

const PaymentSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId } = useParams();

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                setLoading(true);

                // Get the booking ID from URL params or state
                const bookingIdValue = bookingId || location.state?.bookingId;

                if (!bookingIdValue) {
                    toast.error('No booking information found');
                    navigate('/');
                    return;
                }

                const response = await requests.get(`/Payment/invoice?bookingId=${bookingIdValue}`);

                if (response.data && response.data.data) {
                    setPaymentDetails(response.data.data);
                    toast.success('Payment completed successfully!');
                } else {
                    toast.error('Failed to load payment details');
                }
            } catch (error) {
                console.error('Error fetching payment details:', error);
                toast.error('Failed to load payment details');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [bookingId, location.state, navigate]);

    const handleViewBookings = () => {
        navigate('/order-history');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                    <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Payment Successful!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        Your payment has been processed successfully. Your booking is now confirmed.
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {paymentDetails && (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Payment Details
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Booking ID:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                #{paymentDetails.bookingId}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Lesson:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {paymentDetails.lessonTitle}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Amount Paid:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                ${paymentDetails.totalAmount.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1">Start Time:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {new Date(paymentDetails.startTime).toLocaleString()}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="body1">End Time:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {new Date(paymentDetails.endTime).toLocaleString()}
                            </Typography>
                        </Box>

                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 4 }}>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                A confirmation email has been sent to your registered email address.
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBackToHome}
                    >
                        Back to Home
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Receipt />}
                        onClick={handleViewBookings}
                        sx={{
                            bgcolor: '#fe7aac',
                            color: 'black',
                            '&:hover': {
                                bgcolor: '#ff9fc3',
                            },
                        }}
                    >
                        View My Bookings
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentSuccessPage;