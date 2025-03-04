import { useEffect, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Call, CallEnd, Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { videoCallService } from '../../../Services/VideoCallService.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VideoCallModal = ({
                            open,
                            onClose,
                            isIncoming = false,
                            callData = null,
                            onCallAccepted = null,
                            onCallRejected = null
                        }) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [callConnected, setCallConnected] = useState(false);

    useEffect(() => {
        if (open) {
            videoCallService.onLocalStreamUpdate = (stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            };

            videoCallService.onRemoteStreamUpdate = (stream) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = stream;
                    setCallConnected(true);
                }
            };

            videoCallService.onCallEnded = () => {
                toast.info("Call ended");
                handleClose();
            };

            videoCallService.onCallAccepted = () => {
                // Set state to show the call is being established
                toast.success("Call accepted");
                setCallConnected(true);
            };

            videoCallService.onCallRejected = () => {
                toast.info("Call rejected");
                handleClose();
            };
        }

        return () => {
            if (!open) {
                videoCallService.cleanup();
            }
        };
    }, [open]);

    const handleClose = () => {
        videoCallService.cleanup();
        setCallConnected(false);
        onClose();
    };

    const toggleAudio = () => {
        if (videoCallService.localStream) {
            const audioTrack = videoCallService.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (videoCallService.localStream) {
            const videoTrack = videoCallService.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const handleAcceptCall = async () => {
        try {
            await videoCallService.acceptCall(callData.roomId, callData.callerUsername);

            if (onCallAccepted) {
                onCallAccepted();
            }
        } catch (error) {
            toast.error("Failed to accept call");
            console.error("Error accepting call:", error);
        }
    };

    const handleRejectCall = async () => {
        try {
            await videoCallService.rejectCall(callData.roomId, callData.callerUsername);

            if (onCallRejected) {
                onCallRejected();
            }
            handleClose();
        } catch (error) {
            toast.error("Failed to reject call");
            console.error("Error rejecting call:", error);
        }
    };

    const handleEndCall = async () => {
        try {
            if (callData && callData.roomId) {
                await videoCallService.endCall(callData.roomId);
            }
            handleClose();
        } catch (error) {
            toast.error("Failed to end call");
            console.error("Error ending call:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: '#1a1a1a',
                    borderRadius: '12px',
                }
            }}
        >
            <DialogTitle sx={{ color: '#fff', textAlign: 'center' }}>
                {isIncoming ? 'Incoming Call' : 'Video Call'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center'
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ flex: 1, maxWidth: '45%' }}
                        >
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: '8px',
                                    backgroundColor: '#2a2a2a',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            style={{ flex: 1, maxWidth: '45%' }}
                        >
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: '8px',
                                    backgroundColor: '#2a2a2a',
                                    objectFit: 'cover'
                                }}
                            />
                        </motion.div>
                    </Box>

                    {isIncoming && !callConnected && (
                        <Box sx={{ textAlign: 'center', my: 2 }}>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                {callData?.callerDisplayName} is calling...
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleAcceptCall}
                                    startIcon={<Call />}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleRejectCall}
                                    startIcon={<CallEnd />}
                                >
                                    Reject
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {!isIncoming && !callConnected && (
                        <Box sx={{ textAlign: 'center', my: 2 }}>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                Calling...
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleEndCall}
                                    startIcon={<CallEnd />}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {callConnected && (
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            mt: 2
                        }}>
                            <IconButton
                                onClick={toggleAudio}
                                sx={{
                                    backgroundColor: isAudioEnabled ? 'primary.main' : 'error.main',
                                    '&:hover': {
                                        backgroundColor: isAudioEnabled ? 'primary.dark' : 'error.dark',
                                    },
                                    color: 'white'
                                }}
                            >
                                {isAudioEnabled ? <Mic /> : <MicOff />}
                            </IconButton>
                            <IconButton
                                onClick={toggleVideo}
                                sx={{
                                    backgroundColor: isVideoEnabled ? 'primary.main' : 'error.main',
                                    '&:hover': {
                                        backgroundColor: isVideoEnabled ? 'primary.dark' : 'error.dark',
                                    },
                                    color: 'white'
                                }}
                            >
                                {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                            </IconButton>
                            <IconButton
                                onClick={handleEndCall}
                                sx={{
                                    backgroundColor: 'error.main',
                                    '&:hover': {
                                        backgroundColor: 'error.dark',
                                    },
                                    color: 'white'
                                }}
                            >
                                <CallEnd />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default VideoCallModal;