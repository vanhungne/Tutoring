import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    Close,
    Send,
    MoreVert,
    Phone,
    VideoCall,
    Info,
    EmojiEmotions,
    AttachFile,
    Image,
    ThumbUp
} from '@mui/icons-material';
import { signalRService } from '../../../Services/SignalRService.js';
import {
    getChatRooms,
    setCurrentRoom,
    addMessage,
    clearMessages,
    updateRoomUnreadStatus,
    getMessageHistory
} from '../../../stores/slices/chatSlice.js';
import { format } from 'date-fns';

const ChatPopup = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { rooms, currentRoom, messages, isLoading } = useSelector((state) => state.chat);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (open) {
            dispatch(getChatRooms());
        }
    }, [open, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleRoomSelect = async (room) => {
        try {
            if (currentRoom) {
                await signalRService.leaveRoom(currentRoom.id);
            }
            await signalRService.joinRoom(room.id);
            dispatch(setCurrentRoom(room));
            dispatch(clearMessages());
            await dispatch(getMessageHistory(room.id));
            dispatch(updateRoomUnreadStatus({ roomId: room.id, hasUnread: false }));
        } catch (error) {
            console.error('Failed to switch rooms:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentRoom) return;
        try {
            await signalRService.sendMessage(messageInput, currentRoom.id);
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 320,
                    height: '100%',
                    bgcolor: '#fff'
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Messages</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                {/* Chat List */}
                <List sx={{ flex: 1, overflow: 'auto' }}>
                    {rooms.map((room) => (
                        <ListItem
                            key={room.id}
                            button
                            selected={currentRoom?.id === room.id}
                            onClick={() => handleRoomSelect(room)}
                        >
                            <ListItemAvatar>
                                <Badge
                                    color="primary"
                                    variant="dot"
                                    invisible={!room.hasUnreadMessages || currentRoom?.id === room.id}
                                >
                                    <Avatar src={room.avatar} />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={room.name}
                                secondary={room.lastMessage}
                                primaryTypographyProps={{
                                    fontWeight: room.hasUnreadMessages ? 'bold' : 'normal'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>

                {/* Chat Window */}
                {currentRoom && (
                    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={currentRoom.avatar} sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1">{currentRoom.name}</Typography>
                                </Box>
                                <Box>
                                    <IconButton size="small">
                                        <Phone />
                                    </IconButton>
                                    <IconButton size="small">
                                        <VideoCall />
                                    </IconButton>
                                    <IconButton size="small">
                                        <Info />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>

                        {/* Messages */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f0f2f5' }}>
                            {isLoading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress />
                                </Box>
                            ) : (
                                messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: message.username === currentUser.email ? 'flex-end' : 'flex-start',
                                            mb: 1
                                        }}
                                    >
                                        {message.username !== currentUser.email && (
                                            <Avatar src={message.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                                        )}
                                        <Box
                                            sx={{
                                                maxWidth: '70%',
                                                p: 1,
                                                bgcolor: message.username === currentUser.email ? '#0084ff' : '#e4e6eb',
                                                color: message.username === currentUser.email ? 'white' : 'black',
                                                borderRadius: 2,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            <Typography variant="body2">{message.content}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                                                {format(new Date(message.dateSent), 'HH:mm')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input Area */}
                        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: '#f5f5f5' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton size="small">
                                    <EmojiEmotions />
                                </IconButton>
                                <IconButton size="small">
                                    <AttachFile />
                                </IconButton>
                                <IconButton size="small">
                                    <Image />
                                </IconButton>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Aa"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{ bgcolor: '#fff' }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                >
                                    {messageInput.trim() ? <Send /> : <ThumbUp />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default ChatPopup;