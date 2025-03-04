import { Avatar, Box, IconButton, Typography, Badge } from '@mui/material';
import { Phone, VideoCall, Info } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setCallActive, setCallData } from '../../../stores/slices/videoCallSlice';
import { videoCallService } from '../../../Services/VideoCallService.js';
import toast from 'react-hot-toast';

const ChatHeader = ({ currentRoom }) => {
    const dispatch = useDispatch();

    if (!currentRoom) return null;

    const handleVideoCall = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('currentUser'))?.accessToken;
            if (!token) {
                toast.error('Please login to make a call');
                return;
            }

            await videoCallService.startConnection(token);
            await videoCallService.initiateCall(currentRoom.id, currentRoom.name);

            dispatch(setCallData({
                roomId: currentRoom.id,
                targetUsername: currentRoom.name
            }));
            dispatch(setCallActive(true));
        } catch (error) {
            console.error('Failed to start video call:', error);
            toast.error('Failed to start video call');
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1.5px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f8fafa',
                boxShadow: '0 5px 12px rgba(0, 0, 0, 0.12)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: '#44b700',
                            color: '#44b700',
                            boxShadow: '0 0 0 2px #fff',
                            '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: 'ripple 1.2s infinite ease-in-out',
                                border: '1px solid currentColor',
                                content: '""',
                            },
                        },
                        '@keyframes ripple': {
                            '0%': {
                                transform: 'scale(.8)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(2.4)',
                                opacity: 0,
                            },
                        },
                    }}
                >
                    <Avatar
                        src={currentRoom.avatar}
                        sx={{
                            width: 44,
                            height: 44,
                            border: '2px solid #fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                </Badge>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: '1.1rem',
                            lineHeight: 1.2
                        }}
                    >
                        {currentRoom.name}
                    </Typography>
                    {/*<Typography*/}
                    {/*    variant="body2"*/}
                    {/*    sx={{*/}
                    {/*        color: '#44b700',*/}
                    {/*        fontSize: '0.875rem',*/}
                    {/*        display: 'flex',*/}
                    {/*        alignItems: 'center',*/}
                    {/*        gap: 0.5*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <span*/}
                    {/*        style={{*/}
                    {/*            width: 8,*/}
                    {/*            height: 8,*/}
                    {/*            borderRadius: '50%',*/}
                    {/*            backgroundColor: '#44b700',*/}
                    {/*            display: 'inline-block'*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*    Active now*/}
                    {/*</Typography>*/}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                    { icon: Phone, action: () => console.log('Voice call') },
                    { icon: VideoCall, action: handleVideoCall },
                    { icon: Info, action: () => console.log('Info') }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <IconButton
                            onClick={item.action}
                            size="medium"
                            sx={{
                                color: 'text.secondary',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    color: 'primary.main'
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <item.icon />
                        </IconButton>
                    </motion.div>
                ))}
            </Box>
        </Box>
    );
};

export default ChatHeader;