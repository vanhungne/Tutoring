import { Box, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Avatar, Badge } from '@mui/material';
import { Search } from '@mui/icons-material';

const ChatSidebar = ({ rooms, searchTerm, setSearchTerm, handleRoomSelect, currentRoom }) => {
    const totalUnread = rooms.reduce((count, room) =>
        count + (room.hasUnreadMessages && currentRoom?.id !== room.id ? 1 : 0), 0
    );

    return (
        <Box
            sx={{
                width: 320,
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
                borderRadius: '12px 0 0 12px'
            }}
        >
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="700" sx={{
                        color: '#1E293B',
                        flex: 1,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Messages
                    </Typography>
                    {totalUnread > 0 && (
                        <Badge
                            badgeContent={totalUnread}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: '#EF4444',
                                    fontSize: '0.75rem',
                                    minWidth: '20px',
                                    height: '20px',
                                    borderRadius: '10px'
                                }
                            }}
                        />
                    )}
                </Box>
                <TextField
                    fullWidth
                    size="medium"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ color: '#94A3B8', mr: 1 }} />,
                        sx: {
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            '& fieldset': {
                                border: '1px solid #E2E8F0',
                                transition: 'all 0.2s ease'
                            },
                            '&:hover fieldset': {
                                borderColor: '#6366f1'
                            },
                            '& input': {
                                padding: '12px 16px',
                                '&::placeholder': {
                                    color: '#94A3B8',
                                    opacity: 1
                                }
                            }
                        }
                    }}
                />
            </Box>

            <List sx={{
                flex: 1,
                overflow: 'auto',
                px: 2,
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#CBD5E1',
                    borderRadius: '3px',
                    '&:hover': {
                        backgroundColor: '#94A3B8'
                    }
                }
            }}>
                {rooms.map((room) => (
                    <ListItem
                        key={room.id}
                        button
                        selected={currentRoom?.id === room.id}
                        onClick={() => handleRoomSelect(room)}
                        sx={{
                            mb: 1,
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            backgroundColor: room.hasUnreadMessages && currentRoom?.id !== room.id
                                ? 'rgba(99, 102, 241, 0.1)'
                                : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                transform: 'translateY(-1px)'
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.25)'
                                }
                            }
                        }}
                    >
                        <ListItemAvatar>
                            <Badge
                                color="success"
                                variant="dot"
                                invisible={!room.hasUnreadMessages || currentRoom?.id === room.id}
                                sx={{
                                    '& .MuiBadge-dot': {
                                        backgroundColor: '#10B981',
                                        boxShadow: '0 0 0 2px #fff'
                                    }
                                }}
                            >
                                <Avatar
                                    src={room.avatar}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: room.hasUnreadMessages && currentRoom?.id !== room.id ? 600 : 500,
                                        color: '#1E293B',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {room.name}
                                </Typography>
                            }
                            secondary={
                                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{
                                            color: room.hasUnreadMessages && currentRoom?.id !== room.id ? '#1E293B' : '#64748B',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontWeight: room.hasUnreadMessages && currentRoom?.id !== room.id ? 500 : 400,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {room.lastMessage}
                                    </Typography>
                                    {room.lastSeen && (
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            sx={{
                                                color: '#94A3B8',
                                                fontSize: '0.75rem',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            Last seen: {new Date(room.lastSeen).toLocaleString()}
                                        </Typography>
                                    )}
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChatSidebar;