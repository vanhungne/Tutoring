import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Avatar,
    Chip,
    Card,
    CardContent,
    Tabs,
    Tab,
    Rating,
    Divider,
    Paper,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    PlayCircle,
    School,
    Verified,
    Language,
    AccessTime,
    Event,
    Message,
    Favorite,
    FavoriteBorder,
    Star,
    CalendarMonth,
    VerifiedUser,
    LocationOn,
    Person,
    Description,
    Check,
    ArrowBack,
    ArrowForward
} from '@mui/icons-material';
import { format, addDays, isSameDay } from 'date-fns';
import requests from '../../../Utils/requests';
import { useDispatch } from 'react-redux';
import { addFavoriteApi } from '../../../stores/slices/favoriteSlice';
import { createChatRoom } from '../../../stores/slices/chatSlice';
import toast from 'react-hot-toast';
import BookingModal from '../../../components/booking/BookingModal';

const TutorDetailsPage = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [certifications, setCertifications] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [bookingModalOpen, setBookingModalOpen] = useState(false);

    // Fetch tutor details
    useEffect(() => {
        const fetchTutorDetails = async () => {
            setLoading(true);
            try {
                // Fetch tutor profile
                const response = await requests.get(`/Home/${tutorId}`);
                if (response.data && response.data.data) {
                    setTutor(response.data.data);

                    // Check if tutor is in favorites
                    try {
                        const favResponse = await requests.get('/Favorite');
                        const favorites = favResponse.data?.$values || [];
                        setIsFavorite(favorites.some(fav => fav.userName === tutorId));
                    } catch (err) {
                        console.error('Error checking favorites:', err);
                    }
                }
            } catch (err) {
                setError('Failed to load tutor details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorDetails();
    }, [tutorId]);

    // Fetch certifications
    useEffect(() => {
        const fetchCertifications = async () => {
            if (!tutorId) return;

            try {
                const response = await requests.get(`/Certification/view-certificate-by/${tutorId}`);
                if (response && response.data) {
                    setCertifications(response.data.$values || []);
                }
            } catch (err) {
                console.error('Error fetching certifications:', err);
            }
        };

        if (tutor) {
            fetchCertifications();
        }
    }, [tutor, tutorId]);

    // Fetch lessons
    useEffect(() => {
        const fetchLessons = async () => {
            if (!tutorId) return;

            try {
                const response = await requests.get(`/Lesson/get-lesson-follow-tutor/${tutorId}`);
                if (response.data && response.data.data) {
                    setLessons(response.data.data.$values || []);
                }
            } catch (err) {
                console.error('Error fetching lessons:', err);
            }
        };

        if (tutor) {
            fetchLessons();
        }
    }, [tutor, tutorId]);

    // Fetch schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!tutorId) return;

            try {
                const response = await requests.get(`/TutorSchedule/schedules/instructor/${tutorId}`);
                if (response.data && response.data.data) {
                    setSchedule(response.data.data.$values || []);
                }
            } catch (err) {
                console.error('Error fetching schedule:', err);
            }
        };

        if (tutor) {
            fetchSchedule();
        }
    }, [tutor, tutorId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleToggleFavorite = async () => {
        try {
            if (isFavorite) {
                // Remove from favorites
                await requests.delete(`/Favorite?instructorId=${tutorId}`);
                setIsFavorite(false);
                toast.success('Removed from favorites');
            } else {
                // Add to favorites
                await dispatch(addFavoriteApi(tutorId));
                setIsFavorite(true);
                toast.success('Added to favorites');
            }
        } catch (err) {
            Navigate('/login')
            toast.error('Failed to update favorites');
            console.error(err);
        }
    };

    const handleSendMessage = async () => {
        try {
            await dispatch(createChatRoom({ instructorName: tutorId }));
            navigate('/chat/message');
        } catch (err) {
            toast.error('Failed to start conversation');
            console.error(err);
        }
    };

    const handleBookLesson = () => {
        setBookingModalOpen(true);
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(prev => addDays(prev, -7));
    };

    const handleNextWeek = () => {
        setCurrentWeek(prev => addDays(prev, 7));
    };

    const getWeekDays = () => {
        const days = [];
        const startOfWeek = currentWeek;

        for (let i = 0; i < 7; i++) {
            days.push(addDays(startOfWeek, i));
        }

        return days;
    };

    const getAvailableTimesForDay = (date) => {
        return schedule.filter(slot => {
            const slotDate = new Date(slot.startTime);
            return isSameDay(slotDate, date) && slot.status === 'Available';
        }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !tutor) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Typography variant="h6" color="error">
                    {error || 'Tutor not found'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Grid container spacing={4}>
                {/* Left Column - Tutor Info */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                        <Avatar
                            src={tutor.avatar}
                            alt={tutor.fullName}
                            sx={{ width: 120, height: 120, mr: 3, border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                        />
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h4" fontWeight="bold" sx={{ mr: 1 }}>
                                    {tutor.fullName}
                                </Typography>
                                {tutor.country && (
                                    <Chip
                                        icon={<LocationOn fontSize="small" />}
                                        label={tutor.country}
                                        size="small"
                                        sx={{ ml: 1, backgroundColor: '#f0f7ff' }}
                                    />
                                )}
                            </Box>

                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                                {tutor.education || 'Certified English Tutor'}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                                    <Rating value={tutor.averageRating || 5} readOnly precision={0.5} />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        ({tutor.totalFeedbacks || 1} reviews)
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                                    <Person fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {tutor.totalStudents || 10} students
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <School fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                        {tutor.totalLessons || 94} lessons
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    icon={<VerifiedUser fontSize="small" />}
                                    label="Professional Tutor"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mr: 1 }}
                                />
                                {tutor.languageName && (
                                    <Chip
                                        icon={<Language fontSize="small" />}
                                        label={`Teaches ${tutor.languageName}`}
                                        variant="outlined"
                                        sx={{ mr: 1 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }
                        }}
                    >
                        <Tab label="About" />
                        <Tab label="Lessons" />
                        <Tab label="Schedule" />
                        <Tab label="Reviews" />
                        <Tab label="Certifications" />
                    </Tabs>

                    <Box sx={{ mb: 4 }}>
                        {/* About Tab */}
                        {tabValue === 0 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    About me
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {tutor.teachingExperience ||
                                        `Hi everyone, my name is ${tutor.fullName}! I'm an English teacher currently living in ${tutor.country || 'Australia'}. 
                    I love meeting new people and I am passionate about helping individuals improve their English, 
                    whatever their reason: work, travel, study, conversation, or something else.`
                                    }
                                </Typography>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Teaching Experience
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {tutor.teachingExperience ||
                                        `I have been teaching English for over 5 years to students of all ages and levels. 
                    My teaching approach is communicative and student-centered, focusing on your specific needs and goals.
                    I create a comfortable learning environment where you can practice and improve your skills with confidence.`
                                    }
                                </Typography>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Education
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {tutor.education ||
                                        `I hold a degree in English Language Teaching and a CELTA certification. 
                    I continuously update my teaching methods and materials to provide the best learning experience for my students.`
                                    }
                                </Typography>
                            </Box>
                        )}

                        {/* Lessons Tab */}
                        {tabValue === 1 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Lessons offered
                                </Typography>

                                {lessons.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {lessons.map((lesson) => (
                                            <Grid item xs={12} key={lesson.lessonId}>
                                                <Card variant="outlined" sx={{ mb: 2 }}>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography variant="h6" fontWeight="bold">
                                                                    {lesson.title}
                                                                </Typography>
                                                                <Chip
                                                                    label={lesson.level}
                                                                    size="small"
                                                                    color={
                                                                        lesson.level === 'Basic' ? 'success' :
                                                                            lesson.level === 'Normal' ? 'primary' : 'error'
                                                                    }
                                                                    sx={{ mt: 1, mb: 1 }}
                                                                />
                                                                <Typography variant="body2" paragraph>
                                                                    {lesson.description}
                                                                </Typography>
                                                                <Typography variant="subtitle2" fontWeight="bold">
                                                                    Learning Objectives:
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {lesson.learningObjectives}
                                                                </Typography>
                                                            </Box>
                                                            {lesson.imageUrl && (
                                                                <Box sx={{ ml: 2, flexShrink: 0 }}>
                                                                    <img
                                                                        src={lesson.imageUrl}
                                                                        alt={lesson.title}
                                                                        style={{
                                                                            width: 120,
                                                                            height: 80,
                                                                            objectFit: 'cover',
                                                                            borderRadius: 8
                                                                        }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        No lessons available at the moment.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Schedule Tab */}
                        {tabValue === 2 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Availability
                                </Typography>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        backgroundColor: '#f0f7ff',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Event fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="body2">
                                            Choose the time for your first lesson. The timings are displayed in your local timezone.
                                        </Typography>
                                    </Box>
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <IconButton onClick={handlePreviousWeek}>
                                        <ArrowBack />
                                    </IconButton>

                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {format(getWeekDays()[0], 'MMM d')} - {format(getWeekDays()[6], 'MMM d, yyyy')}
                                    </Typography>

                                    <IconButton onClick={handleNextWeek}>
                                        <ArrowForward />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={1}>
                                    {getWeekDays().map((day, index) => (
                                        <Grid item xs={12} sm={12/7} key={index}>
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: index === 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight="medium">
                                                    {format(day, 'EEE')}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {format(day, 'd')}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mt: 1 }}>
                                                {getAvailableTimesForDay(day).map((slot) => (
                                                    <Button
                                                        key={slot.tutorAvailabilityId}
                                                        variant="outlined"
                                                        fullWidth
                                                        size="small"
                                                        sx={{
                                                            mb: 1,
                                                            justifyContent: 'center',
                                                            textTransform: 'none',
                                                            borderColor: 'rgba(25, 118, 210, 0.3)'
                                                        }}
                                                    >
                                                        {format(new Date(slot.startTime), 'HH:mm')}
                                                    </Button>
                                                ))}

                                                {getAvailableTimesForDay(day).length === 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: 'block',
                                                            textAlign: 'center',
                                                            py: 1
                                                        }}
                                                    >
                                                        No slots
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Button variant="outlined">
                                        View full schedule
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Reviews Tab */}
                        {tabValue === 3 && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                        Student Reviews
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="h4" fontWeight="bold" sx={{ mr: 1 }}>
                                            {tutor.averageRating || 5}
                                        </Typography>
                                        <Box>
                                            <Rating value={tutor.averageRating || 5} readOnly precision={0.5} />
                                            <Typography variant="body2" color="text.secondary">
                                                {tutor.totalFeedbacks || 1} reviews
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ width: 30 }}>5</Typography>
                                        <Box sx={{ flexGrow: 1, mx: 1, height: 8, bgcolor: '#eee', borderRadius: 4 }}>
                                            <Box sx={{ width: '100%', height: '100%', bgcolor: '#4caf50', borderRadius: 4 }} />
                                        </Box>
                                        <Typography variant="body2">{tutor.totalFeedbacks || 1}</Typography>
                                    </Box>

                                    {[4, 3, 2, 1].map(rating => (
                                        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" sx={{ width: 30 }}>{rating}</Typography>
                                            <Box sx={{ flexGrow: 1, mx: 1, height: 8, bgcolor: '#eee', borderRadius: 4 }}>
                                                <Box sx={{ width: '0%', height: '100%', bgcolor: '#4caf50', borderRadius: 4 }} />
                                            </Box>
                                            <Typography variant="body2">0</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Box>
                                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                        No reviews yet. Be the first to leave a review after your lesson.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Certifications Tab */}
                        {tabValue === 4 && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Certifications
                                </Typography>

                                {certifications.length > 0 ? (
                                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                                        {certifications.map((cert) => (
                                            <Card
                                                key={cert.certificationId}
                                                variant="outlined"
                                                sx={{
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    boxShadow: 2,
                                                    transition: "0.3s",
                                                    "&:hover": { boxShadow: 5 }
                                                }}
                                            >
                                                <CardContent>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemIcon>
                                                            <VerifiedUser sx={{ color: "green", fontSize: 30 }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="h6" fontWeight="bold">
                                                                    {cert.title || "Teaching Certification"}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {cert.description || "Professional teaching qualification"}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        No certifications available.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Right Column - Booking Panel */}
                <Grid item xs={12} md={4}>
                    <Card
                        elevation={3}
                        sx={{
                            position: 'sticky',
                            top: 24,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        {tutor.avatar && (
                            <Box sx={{ position: 'relative' }}>
                                <img
                                    src={tutor.avatar}
                                    alt={tutor.fullName}
                                    style={{
                                        width: '100%',
                                        height: 220,
                                        objectFit: 'cover'
                                    }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                                    }}
                                >
                                    <PlayCircle color="error" />
                                </IconButton>
                            </Box>
                        )}

                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Star sx={{ color: '#FFD700', mr: 0.5 }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            {tutor.averageRating || 5}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {tutor.totalFeedbacks || 1} review
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {tutor.totalLessons || 94}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        lessons
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        ${tutor.price || 20}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        50-min lesson
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Event />}
                                sx={{
                                    mb: 2,
                                    py: 1.5,
                                    backgroundColor: '#ff4081',
                                    '&:hover': { backgroundColor: '#f50057' },
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                                onClick={handleBookLesson}
                            >
                                Book trial lesson
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<Message />}
                                sx={{
                                    mb: 2,
                                    py: 1.5,
                                    fontWeight: 'medium',
                                    fontSize: '1rem'
                                }}
                                onClick={handleSendMessage}
                            >
                                Send message
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 'medium',
                                    fontSize: '1rem',
                                    borderColor: isFavorite ? '#f44336' : undefined,
                                    color: isFavorite ? '#f44336' : undefined
                                }}
                                onClick={handleToggleFavorite}
                            >
                                {isFavorite ? 'Saved to favorites' : 'Save to my list'}
                            </Button>

                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Verified sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography variant="body2" fontWeight="medium">
                                        Trials are 100% refundable
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    Try another tutor for free or get a refund
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarMonth sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography variant="body2" fontWeight="medium">
                                        Super popular
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                    57 new contacts and 8 lesson bookings in the last 48 hours
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
                                    <Typography variant="body2" fontWeight="medium">
                                        Usually responds in 1 hour
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Booking Modal */}
            <BookingModal
                open={bookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                tutorId={tutorId}
                tutorName={tutor.fullName}
                tutorAvatar={tutor.avatar}
            />
        </Box>
    );
};

export default TutorDetailsPage;