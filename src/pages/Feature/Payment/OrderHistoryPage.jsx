import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Receipt,
    CheckCircle,
    Cancel,
    Schedule,
    Info,
    ArrowBack,
    Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import requests from '../../../Utils/requests';
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // This is a placeholder - you'll need to implement the actual API endpoint
            const response = await requests.get('/Booking/get-all-of-user');

            if (response.data && response.data.data && response.data.data.$values) {
                setOrders(response.data.data.$values);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load your booking history');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Accepted':
                return <Chip icon={<CheckCircle />} label="Accepted" color="success" size="small" />;
            case 'Pending':
                return <Chip icon={<Schedule />} label="Pending" color="warning" size="small" />;
            case 'Cancelled':
                return <Chip icon={<Cancel />} label="Cancelled" color="error" size="small" />;
            case 'Completed':
                return <Chip icon={<CheckCircle />} label="Completed" color="primary" size="small" />;
            default:
                return <Chip icon={<Info />} label={status} size="small" />;
        }
    };

    const handleViewDetails = (bookingId) => {
        navigate(`/payment-success/${bookingId}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const filteredOrders = tabValue === 0
        ? orders
        : orders.filter(order => {
            if (tabValue === 1) return order.status === 'Pending';
            if (tabValue === 2) return order.status === 'Accepted';
            if (tabValue === 3) return order.status === 'Completed';
            if (tabValue === 4) return order.status === 'Cancelled';
            return true;
        });

    // Mock data for development - remove in production
    const mockOrders = [
        {
            bookingId: 1,
            lessonTitle: "Introduction to English Grammar",
            tutorName: "John Smith",
            startTime: "2025-03-01T10:00:00",
            endTime: "2025-03-01T11:00:00",
            price: 25.00,
            status: "Completed"
        },
        {
            bookingId: 2,
            lessonTitle: "Conversational Spanish",
            tutorName: "Maria Garcia",
            startTime: "2025-03-05T15:30:00",
            endTime: "2025-03-05T16:30:00",
            price: 30.00,
            status: "Accepted"
        },
        {
            bookingId: 3,
            lessonTitle: "Business French",
            tutorName: "Pierre Dubois",
            startTime: "2025-03-10T09:00:00",
            endTime: "2025-03-10T10:00:00",
            price: 35.00,
            status: "Pending"
        },
        {
            bookingId: 4,
            lessonTitle: "Japanese for Beginners",
            tutorName: "Yuki Tanaka",
            startTime: "2025-03-15T18:00:00",
            endTime: "2025-03-15T19:00:00",
            price: 28.00,
            status: "Cancelled"
        }
    ];

    // Use mock data if no real data is available
    const displayOrders = orders.length > 0 ? filteredOrders : mockOrders;

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    My Booking History
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBackToHome}
                >
                    Back to Home
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem'
                        }
                    }}
                >
                    <Tab label="All Bookings" />
                    <Tab label="Pending" />
                    <Tab label="Accepted" />
                    <Tab label="Completed" />
                    <Tab label="Cancelled" />
                </Tabs>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                        <CircularProgress />
                    </Box>
                ) : displayOrders.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" py={8}>
                        <Receipt sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No bookings found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            You haven't made any bookings yet. Start exploring tutors to book your first lesson!
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 3,
                                bgcolor: '#fe7aac',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: '#ff9fc3',
                                }
                            }}
                            onClick={() => navigate('/findTutor')}
                        >
                            Find Tutors
                        </Button>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography fontWeight="bold">Booking ID</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Lesson</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Tutor</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Date & Time</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Price</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayOrders.map((order) => (
                                    <TableRow key={order.bookingId} hover>
                                        <TableCell>#{order.bookingId}</TableCell>
                                        <TableCell>{order.lessonTitle}</TableCell>
                                        <TableCell>{order.tutorName}</TableCell>
                                        <TableCell>
                                            {new Date(order.startTime).toLocaleDateString()} <br />
                                            {new Date(order.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(order.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>${order.price.toFixed(2)}</TableCell>
                                        <TableCell>{getStatusChip(order.status)}</TableCell>
                                        <TableCell>
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleViewDetails(order.bookingId)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default OrderHistoryPage;