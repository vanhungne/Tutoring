import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import { EmojiEmotions, AttachFile, Image, Send, ThumbUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ChatInput = ({ messageInput, setMessageInput, handleSendMessage }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
                p: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
                borderRadius: '0 0 12px 12px'
            }}
        >
            <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                    { icon: EmojiEmotions, tooltip: 'Add emoji', color: '#F59E0B' },
                    { icon: AttachFile, tooltip: 'Attach file', color: '#10B981' },
                    { icon: Image, tooltip: 'Send image', color: '#3B82F6' }
                ].map(({ icon: Icon, tooltip, color }) => (
                    <Tooltip key={tooltip} title={tooltip}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <IconButton
                                size="medium"
                                sx={{
                                    color: 'white',
                                    backgroundColor: color,
                                    '&:hover': {
                                        backgroundColor: color,
                                        filter: 'brightness(110%)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Icon />
                            </IconButton>
                        </motion.div>
                    </Tooltip>
                ))}
            </Box>

            <TextField
                fullWidth
                size="medium"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        borderRadius: '24px',
                        '&:hover': {
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        },
                        '& fieldset': {
                            borderColor: '#E2E8F0',
                            transition: 'all 0.2s ease',
                        },
                        '&:hover fieldset': {
                            borderColor: '#6366f1'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: '2px'
                        },
                        padding: '12px 20px'
                    },
                    '& .MuiInputBase-input': {
                        fontSize: '0.9375rem',
                        lineHeight: 1.5,
                        '&::placeholder': {
                            color: '#94A3B8',
                            opacity: 1
                        }
                    }
                }}
            />

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <IconButton
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    sx={{
                        color: 'white',
                        backgroundColor: messageInput.trim() ? '#6366f1' : '#94A3B8',
                        width: 48,
                        height: 48,
                        '&:hover': {
                            backgroundColor: messageInput.trim() ? '#4F46E5' : '#94A3B8',
                            transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: messageInput.trim() ? '0 4px 6px rgba(99, 102, 241, 0.2)' : 'none'
                    }}
                >
                    {messageInput.trim() ? <Send /> : <ThumbUp />}
                </IconButton>
            </motion.div>
        </Box>
    );
};

export default ChatInput;