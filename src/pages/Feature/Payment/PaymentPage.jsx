import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Divider,
    TextField,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Paper,
    Grid,
    Avatar
} from '@mui/material';
import { CreditCard, PaymentOutlined, CheckCircle } from '@mui/icons-material';
import requests from '../../../Utils/requests';
import toast from 'react-hot-toast';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [tutor, setTutor] = useState(null);
    const [savePaypalInfo, setSavePaypalInfo] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paypal');

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                setLoading(true);

                // Extract the numeric value if bookingId is an object or string with non-numeric characters
                let bookingIdValue = bookingId;
                if (typeof bookingId === 'object') {
                    bookingIdValue = bookingId.id || bookingId.toString();
                } else if (typeof bookingId === 'string') {
                    // Remove any non-numeric characters if bookingId is a string
                    bookingIdValue = bookingId.replace(/\D/g, '');
                }

                const response = await requests.get(`/Payment/invoice?bookingId=${bookingIdValue}`);
                if (response.data && response.data.data) {
                    setInvoice(response.data.data);

                    // If we have tutor info from location state, use it
                    if (location.state?.tutor) {
                        setTutor(location.state.tutor);
                    }
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
                toast.error('Failed to load payment details');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchInvoiceDetails();
        }
    }, [bookingId, location.state]);

    const handlePayment = async () => {
        try {
            if (!bookingId) {
                toast.error('Invalid booking ID');
                return;
            }

            setPaymentLoading(true);

            // Extract the numeric value if bookingId is an object or string with non-numeric characters
            let bookingIdValue = bookingId;
            if (typeof bookingId === 'object') {
                bookingIdValue = bookingId.id || bookingId.toString();
            } else if (typeof bookingId === 'string') {
                // Remove any non-numeric characters if bookingId is a string
                bookingIdValue = bookingId.replace(/\D/g, '');
            }

            const response = await requests.post(`/Payment/pay?bookingId=${bookingIdValue}`);

            if (response && response.data && response.data.data) {
                // Redirect to PayPal checkout URL from the response
                window.location.href = response.data.data;
            } else {
                toast.error('Invalid payment response');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }

        // This would typically call an API to validate the promo code
        toast.error('Invalid promo code or promo code expired');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Choose how to pay
            </Typography>

            <Grid container spacing={4}>
                {/* Left side - Payment options */}
                <Grid item xs={12} md={8}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Payment Methods
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Button
                                    variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                                    startIcon={<CreditCard />}
                                    onClick={() => setPaymentMethod('card')}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderColor: '#e0e0e0',
                                        color: paymentMethod === 'card' ? 'white' : 'inherit'
                                    }}
                                    disabled
                                >
                                    Card
                                </Button>

                                <Button
                                    variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
                                    startIcon={<img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" width="20" />}
                                    onClick={() => setPaymentMethod('paypal')}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderColor: '#e0e0e0',
                                        backgroundColor: paymentMethod === 'paypal' ? '#0070ba' : 'transparent',
                                        color: paymentMethod === 'paypal' ? 'white' : 'inherit',
                                        '&:hover': {
                                            backgroundColor: paymentMethod === 'paypal' ? '#005ea6' : 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                >
                                    PayPal
                                </Button>
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Press the PayPal button to continue
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={savePaypalInfo}
                                        onChange={(e) => setSavePaypalInfo(e.target.checked)}
                                    />
                                }
                                label="Save my PayPal email for future payments"
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    backgroundColor: '#ffc439',
                                    color: '#003087',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#f7bb38'
                                    }
                                }}
                            >
                                {paymentLoading ? <CircularProgress size={24} /> : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                                            alt="PayPal"
                                            style={{ height: 20, marginRight: 8 }}
                                        />
                                        Pay with PayPal
                                    </Box>
                                )}
                            </Button>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.8rem' }}>
                                By pressing the "PayPal" button, you agree to Tutoring Connect's Refund and Payment Policy
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                It's safe to pay on Tutoring Connect. All transactions are protected by SSL encryption.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Promo Code
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    size="small"
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleApplyPromo}
                                    sx={{ minWidth: 100 }}
                                >
                                    Apply
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right side - Order summary */}
                <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Your trial lesson
                            </Typography>

                            {tutor && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={tutor.avatar}
                                        alt={tutor.fullName}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {tutor.fullName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                ★ {tutor.averageRating || 5}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                ({tutor.totalFeedbacks || 0} reviews)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {invoice?.lessonTitle || 'Trial Lesson'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {invoice?.userName || "unknow"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {invoice?.lessonTitle || "unknow"}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        {invoice?.startTime ? new Date(invoice.startTime).toLocaleString() : 'Scheduled time not available'}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        {invoice?.endTime ? new Date(invoice.endTime).toLocaleString() : 'Scheduled time not available'}
                                    </Typography>
                                </Box>
                            </Paper>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">
                                        ${invoice?.totalAmount || 20.00}
                                    </Typography>
                                </Box>

                                {/*<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>*/}
                                {/*    <Typography variant="body1">*/}
                                {/*        Processing fee*/}
                                {/*    </Typography>*/}
                                {/*    <Typography variant="body1">*/}
                                {/*        ${invoice?.processingFee || 0.30}*/}
                                {/*    </Typography>*/}
                                {/*</Box>*/}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Total
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    ${invoice ? (invoice.totalAmount).toFixed(2) : '20.30'}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <CheckCircle sx={{ color: 'success.main', mr: 1, mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Free replacement or refund
                                        </Typography>
                                        <Typography variant="body2">
                                            Try another tutor for free or get a refund
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PaymentPage;