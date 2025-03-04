import { Box, Typography, Avatar } from '@mui/material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const ChatMessages = ({ messages, currentUsername }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const isCurrentUser = (messageUsername) => messageUsername === currentUsername;

    const scrollToBottom = () => {
        if (containerRef.current) {
            const { scrollHeight, clientHeight } = containerRef.current;
            containerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <Box
            ref={containerRef}
            sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bcc0c4',
                    borderRadius: '3px',
                }
            }}
        >
            <Box sx={{ flexGrow: 1 }} />

            {messages.map((message, index) => {
                const isSender = isCurrentUser(message.username);
                const showAvatar = !isSender && (!messages[index - 1] || messages[index - 1].username !== message.username);
                const isLastInGroup = !messages[index + 1] || messages[index + 1].username !== message.username;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            justifyContent: isSender ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end',
                            marginBottom: isLastInGroup ? '8px' : '2px',
                            width: '100%'
                        }}
                    >
                        {!isSender && (
                            <Box
                                sx={{
                                    width: 40,
                                    minWidth: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'
                                }}
                            >
                                {showAvatar && (
                                    <Avatar
                                        src={message.avatar}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            border: '1px solid #f0f2f5'
                                        }}
                                    />
                                )}
                            </Box>
                        )}

                        <Box sx={{ maxWidth: '60%' }}>
                            <Box
                                sx={{
                                    p: 1.8,
                                    backgroundColor: isSender ? '#0084ff' : '#f0f2f5',
                                    color: isSender ? 'white' : '#1a1a1a',
                                    borderRadius: '18px',
                                    wordBreak: 'break-word',
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.4,
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.4
                                    }}
                                >
                                    {message.content}
                                </Typography>
                            </Box>

                            {isLastInGroup && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        textAlign: isSender ? 'right' : 'left',
                                        mt: 0.5,
                                        color: '#65676B',
                                        fontSize: '0.6875rem'
                                    }}
                                >
                                    {format(new Date(message.dateSent), 'HH:mm')}
                                </Typography>
                            )}
                        </Box>
                    </motion.div>
                );
            })}

            <div ref={messagesEndRef} />
        </Box>
    );
};

export default ChatMessages;