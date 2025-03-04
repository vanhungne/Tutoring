import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    IconButton,
    Tabs,
    Tab,
    Divider,
    Paper
} from '@mui/material';
import { Close, CalendarMonth, School, ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import requests from '../../Utils/requests';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ open, onClose, tutorId, tutorName, tutorAvatar }) => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [tabValue, setTabValue] = useState(0);
    // const [duration, setDuration] = useState('50');

    // Fetch lessons and schedules when modal opens
    useEffect(() => {
        if (open && tutorId) {
            fetchLessons();
            fetchSchedules();
        }
    }, [open, tutorId]);

    const fetchLessons = async () => {
        setIsLoading(true);
        try {
            const response = await requests.get(`/Lesson/get-lesson-follow-tutor/${tutorId}`);
            if (response.data && response.data.data && response.data.data.$values) {
                setLessons(response.data.data.$values);
            } else {
                setLessons([]);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            toast.error('Failed to load lessons');
            setLessons([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSchedules = async () => {
        setIsLoading(true);
        try {
            const response = await requests.get(`/TutorSchedule/schedules/instructor/${tutorId}`);
            if (response.data && response.data.data && response.data.data.$values) {
                // Filter only available schedules
                const availableSchedules = response.data.data.$values.filter(
                    schedule => schedule.status === 'Available'
                );
                setSchedules(availableSchedules);
            } else {
                setSchedules([]);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            toast.error('Failed to load schedules');
            setSchedules([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLessonSelect = (lesson) => {
        setSelectedLesson(lesson);
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleNextStep = () => {
        if (currentStep === 0 && !selectedLesson) {
            toast.error('Please select a lesson');
            return;
        }
        if (currentStep === 1 && !selectedSchedule) {
            toast.error('Please select a time slot');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // const handleDurationChange = (newDuration) => {
    //     setDuration(newDuration);
    // };

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
        return schedules.filter(slot => {
            const slotDate = new Date(slot.startTime);
            return isSameDay(slotDate, date);
        }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    };

    const handleBookLesson = async () => {
        if (!selectedLesson || !selectedSchedule) {
            toast.error('Please select both a lesson and a time slot');
            return;
        }

        setIsSubmitting(true);
        try {
            // Get current user from token
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.accessToken) {
                toast.error('You must be logged in to book a lesson');
                return;
            }

            const decodedToken = jwtDecode(currentUser.accessToken);
            const customer = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

            if (!customer) {
                toast.error('Unable to identify user. Please log in again.');
                return;
            }

            const bookingData = {
                customer,
                lessonId: selectedLesson.lessonId,
                availabilityId: selectedSchedule.tutorAvailabilityId
            };

            const response = await requests.post('/Booking/create', bookingData);

            if (response.status === 200 || response.status === 201) {
                toast.success('Lesson booked successfully!');

                // Navigate to payment page with booking ID
                const bookingId = response.data.data.bookingId;
                navigate(`/payment/${bookingId}`, {
                    state: {
                        tutor: {
                            fullName: tutorName,
                            avatar: tutorAvatar,
                            averageRating: 5,
                            totalFeedbacks: 0
                        }
                    }
                });

                onClose();
            } else {
                toast.error('Failed to book lesson');
            }
        } catch (error) {
            console.error('Error booking lesson:', error);
            toast.error(error.response?.data?.message || 'Failed to book lesson');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Select a Lesson
                        </Typography>

                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                            <Tab label="All Lessons" />
                            <Tab label="Basic" />
                            <Tab label="Normal" />
                            <Tab label="High" />
                        </Tabs>

                        {isLoading ? (
                            <Box display="flex" justifyContent="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : lessons.length === 0 ? (
                            <Typography color="text.secondary" align="center" my={4}>
                                No lessons available for this tutor
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {lessons
                                    .filter(lesson => {
                                        if (tabValue === 0) return true;
                                        if (tabValue === 1) return lesson.level === 'Basic';
                                        if (tabValue === 2) return lesson.level === 'Normal';
                                        if (tabValue === 3) return lesson.level === 'High';
                                        return true;
                                    })
                                    .map((lesson) => (
                                        <Grid item xs={12} key={lesson.lessonId}>
                                            <Paper
                                                elevation={selectedLesson?.lessonId === lesson.lessonId ? 3 : 1}
                                                sx={{
                                                    p: 2,
                                                    cursor: 'pointer',
                                                    border: selectedLesson?.lessonId === lesson.lessonId ? '2px solid #fe7aac' : '1px solid #e0e0e0',
                                                    '&:hover': { borderColor: '#fe7aac' }
                                                }}
                                                onClick={() => handleLessonSelect(lesson)}
                                            >
                                                <Box display="flex" justifyContent="space-between">
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {lesson.title}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" mt={1} mb={1}>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    bgcolor: lesson.level === 'Basic' ? '#4caf50' : lesson.level === 'Normal' ? '#2196f3' : '#f44336',
                                                                    color: 'white',
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                {lesson.level}
                                                            </Typography>
                                                            {/*<Typography variant="body2" sx={{ ml: 2 }}>*/}
                                                            {/*    Duration: {lesson.duration} minutes*/}
                                                            {/*</Typography>*/}
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {lesson.description}
                                                        </Typography>
                                                    </Box>
                                                    {lesson.imageUrl && (
                                                        <Box sx={{ ml: 2, flexShrink: 0 }}>
                                                            <img
                                                                src={lesson.imageUrl}
                                                                alt={lesson.title}
                                                                style={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 8
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                    {selectedLesson?.lessonId === lesson.lessonId && (
                                                        <CheckCircle color="success" sx={{ position: 'absolute', top: 8, right: 8 }} />
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                            </Grid>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Select a Time Slot
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CalendarMonth />}
                                    sx={{ mr: 1 }}
                                >
                                    {format(currentWeek, 'MMMM yyyy')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handlePreviousWeek}
                                    sx={{ minWidth: 40, p: 1 }}
                                >
                                    <ArrowBack fontSize="small" />
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleNextWeek}
                                    sx={{ minWidth: 40, p: 1 }}
                                >
                                    <ArrowForward fontSize="small" />
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {format(getWeekDays()[0], 'MMM d')} - {format(getWeekDays()[6], 'MMM d, yyyy')}
                                </Typography>

                                {/*<Box>*/}
                                {/*    <Button*/}
                                {/*        variant={duration === '25' ? 'contained' : 'outlined'}*/}
                                {/*        onClick={() => handleDurationChange('25')}*/}
                                {/*        sx={{*/}
                                {/*            mr: 1,*/}
                                {/*            bgcolor: duration === '25' ? '#fe7aac' : 'transparent',*/}
                                {/*            color: duration === '25' ? 'black' : 'inherit',*/}
                                {/*            '&:hover': {*/}
                                {/*                bgcolor: duration === '25' ? '#ff9fc3' : 'rgba(0, 0, 0, 0.04)'*/}
                                {/*            }*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        25 mins*/}
                                {/*    </Button>*/}
                                {/*    <Button*/}
                                {/*        variant={duration === '50' ? 'contained' : 'outlined'}*/}
                                {/*        onClick={() => handleDurationChange('50')}*/}
                                {/*        sx={{*/}
                                {/*            bgcolor: duration === '50' ? '#fe7aac' : 'transparent',*/}
                                {/*            color: duration === '50' ? 'black' : 'inherit',*/}
                                {/*            '&:hover': {*/}
                                {/*                bgcolor: duration === '50' ? '#ff9fc3' : 'rgba(0, 0, 0, 0.04)'*/}
                                {/*            }*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        50 mins*/}
                                {/*    </Button>*/}
                                {/*</Box>*/}
                            </Box>
                        </Box>

                        {isLoading ? (
                            <Box display="flex" justifyContent="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : schedules.length === 0 ? (
                            <Typography color="text.secondary" align="center" my={4}>
                                No available time slots for this tutor
                            </Typography>
                        ) : (
                            <Grid container spacing={1}>
                                {getWeekDays().map((day, index) => (
                                    <Grid item xs={12/7} key={index}>
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: isSameDay(day, new Date()) ? 'rgba(254, 122, 172, 0.1)' : 'transparent',
                                                border: isSameDay(day, new Date()) ? '1px solid #fe7aac' : 'none'
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight="medium">
                                                {format(day, 'EEE')}
                                            </Typography>
                                            <Typography variant="body2">
                                                {format(day, 'd')}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 1, height: 300, overflowY: 'auto' }}>
                                            {getAvailableTimesForDay(day).map((slot) => (
                                                <Button
                                                    key={slot.tutorAvailabilityId}
                                                    variant={selectedSchedule?.tutorAvailabilityId === slot.tutorAvailabilityId ? 'contained' : 'outlined'}
                                                    fullWidth
                                                    size="small"
                                                    sx={{
                                                        mb: 1,
                                                        justifyContent: 'center',
                                                        textTransform: 'none',
                                                        bgcolor: selectedSchedule?.tutorAvailabilityId === slot.tutorAvailabilityId ? '#fe7aac' : 'transparent',
                                                        color: selectedSchedule?.tutorAvailabilityId === slot.tutorAvailabilityId ? 'black' : 'inherit',
                                                        '&:hover': {
                                                            bgcolor: selectedSchedule?.tutorAvailabilityId === slot.tutorAvailabilityId ? '#ff9fc3' : 'rgba(0, 0, 0, 0.04)'
                                                        }
                                                    }}
                                                    onClick={() => handleScheduleSelect(slot)}
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
                        )}
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Confirm Booking
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box
                                    component="img"
                                    src={tutorAvatar}
                                    alt={tutorName}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        mr: 2,
                                        objectFit: 'cover'
                                    }}
                                />
                                <Box>
                                    <Typography variant="h6">{tutorName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Professional Tutor
                                    </Typography>
                                </Box>
                            </Box>

                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(254, 122, 172, 0.05)' }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Lesson Details
                                </Typography>
                                <Box sx={{ pl: 4 }}>
                                    <Typography variant="body1">{selectedLesson?.title}</Typography>
                                    {/*<Typography variant="body2" color="text.secondary">*/}
                                    {/*    Level: {selectedLesson?.level} • Duration: {duration} mins*/}
                                    {/*</Typography>*/}
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(254, 122, 172, 0.05)' }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Schedule Details
                                </Typography>
                                <Box sx={{ pl: 4 }}>
                                    <Typography variant="body1">
                                        {selectedSchedule && format(new Date(selectedSchedule.startTime), 'EEEE, MMMM d, yyyy')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedSchedule && format(new Date(selectedSchedule.startTime), 'h:mm a')}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>

                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                            <Typography variant="body2" align="center">
                                By confirming this booking, you agree to the tutor's cancellation policy and Tutoring Connect's terms of service.
                            </Typography>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                    {currentStep === 0 && "Book a Trial Lesson"}
                    {currentStep === 1 && "Select Available Time"}
                    {currentStep === 2 && "Confirm Your Booking"}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 3 }}>
                {renderStepContent()}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
                {currentStep > 0 ? (
                    <Button
                        onClick={handlePreviousStep}
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        disabled={isSubmitting}
                    >
                        Back
                    </Button>
                ) : (
                    <Box /> // Empty box for spacing
                )}

                {currentStep < 2 ? (
                    <Button
                        onClick={handleNextStep}
                        variant="contained"
                        endIcon={<ArrowForward />}
                        disabled={isLoading}
                        sx={{
                            bgcolor: '#fe7aac',
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#ff9fc3'
                            }
                        }}
                    >
                        Continue
                    </Button>
                ) : (
                    <Button
                        onClick={handleBookLesson}
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: '#fe7aac',
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#ff9fc3'
                            }
                        }}
                    >
                        {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BookingModal;