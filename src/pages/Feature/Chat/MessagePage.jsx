import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { signalRService } from '../../../Services/SignalRService.js';
import {
  getChatRooms,
  setCurrentRoom,
  addMessage,
  clearMessages,
  updateRoomUnreadStatus,
  getMessageHistory,
  getUnreadMessageCount,
  markMessagesAsRead,
  updateLastSeen
} from '../../../stores/slices/chatSlice.js';
import { jwtDecode } from 'jwt-decode';
import { videoCallService } from '../../../Services/VideoCallService.js';
import { setCallActive, setCallData, setIncomingCall } from '../../../stores/slices/videoCallSlice.js';

import ChatSidebar from './ChatSidebar.jsx';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import VideoCallModal from '../VideoCall/VideoCallModal.jsx';
import toast from 'react-hot-toast';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { rooms, currentRoom, messages, isLoading } = useSelector((state) => state.chat);
  const { isCallActive, isIncomingCall, callData } = useSelector((state) => state.videoCall);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    initializeChat();
    return () => cleanup();
  }, []);

  const initializeChat = async () => {
    try {
      await signalRService.startConnection(currentUser?.accessToken);
      await videoCallService.startConnection(currentUser?.accessToken);
      dispatch(getChatRooms());
      dispatch(getUnreadMessageCount());

      // Set up SignalR event handlers
      signalRService.connection.on("UpdateLastSeen", (roomId, username, lastSeen) => {
        dispatch(updateLastSeen({ roomId, username, lastSeen }));
      });

      signalRService.connection.on("UpdateUnreadCount", (roomId, hasUnread) => {
        dispatch(updateRoomUnreadStatus({ roomId, hasUnread }));
        dispatch(getUnreadMessageCount());
      });

      // Set up video call handlers
      videoCallService.onIncomingCall = (callData) => {
        dispatch(setCallData(callData));
        dispatch(setIncomingCall(true));
        dispatch(setCallActive(true));
      };

    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const cleanup = () => {
    signalRService.stopConnection();
    videoCallService.stopConnection();
    dispatch(clearMessages());
  };

  const handleRoomSelect = async (room) => {
    if (currentRoom?.id === room.id) return;
    try {
      if (currentRoom) {
        await signalRService.leaveRoom(currentRoom.id);
      }
      await signalRService.joinRoom(room.id);
      dispatch(setCurrentRoom(room));
      dispatch(clearMessages());
      await dispatch(getMessageHistory(room.id));

      if (room.hasUnreadMessages) {
        await dispatch(markMessagesAsRead(room.id));
        dispatch(updateRoomUnreadStatus({ roomId: room.id, hasUnread: false }));
      }

      const username = getCurrentUsername();
      if (username) {
        await signalRService.updateLastSeen(room.id);
      }
    } catch (error) {
      console.error('Failed to switch rooms:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentRoom) return;
    try {
      await signalRService.sendMessage(messageInput, currentRoom.id);
      setMessageInput("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getCurrentUsername = () => {
    if (currentUser?.accessToken) {
      try {
        const decodedToken = jwtDecode(currentUser.accessToken);
        return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const handleCallEnd = () => {
    dispatch(setCallActive(false));
    dispatch(setIncomingCall(false));
    dispatch(setCallData(null));
  };

  const handleCallAccepted = async () => {
    try {
      if (callData) {
        await videoCallService.acceptCall(callData.roomId, callData.callerUsername);
        dispatch(setIncomingCall(false));
      }
    } catch (error) {
      toast.error('Failed to accept call');
      handleCallEnd();
    }
  };

  const handleCallRejected = async () => {
    try {
      if (callData) {
        await videoCallService.rejectCall(callData.roomId, callData.callerUsername);
      }
      handleCallEnd();
    } catch (error) {
      console.error('Failed to reject call:', error);
      handleCallEnd();
    }
  };

  if (isLoading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
          <CircularProgress />
        </Box>
    );
  }

  const filteredRooms = rooms.filter(room =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>
        <Box
            sx={{
              height: 'calc(100vh - 64px)',
              display: 'flex',
              backgroundColor: '#f0f2f5',
              overflow: 'hidden',
              maxWidth: '1200px',
              margin: '0 auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}
        >
          <ChatSidebar
              rooms={filteredRooms}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleRoomSelect={handleRoomSelect}
              currentRoom={currentRoom}
          />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {currentRoom ? (
                <>
                  <ChatHeader currentRoom={currentRoom} />
                  <ChatMessages
                      messages={messages}
                      currentUsername={getCurrentUsername()}
                  />
                  <ChatInput
                      messageInput={messageInput}
                      setMessageInput={setMessageInput}
                      handleSendMessage={handleSendMessage}
                  />
                </>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    sx={{ backgroundColor: '#f0f2f5' }}
                >
                  <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        textAlign: 'center',
                        maxWidth: '80%'
                      }}
                  >
                    Select a conversation to start chatting
                  </Typography>
                </Box>
            )}
          </Box>
        </Box>

        <VideoCallModal
            open={isCallActive}
            onClose={handleCallEnd}
            isIncoming={isIncomingCall}
            callData={callData}
            onCallAccepted={handleCallAccepted}
            onCallRejected={handleCallRejected}
        />
      </>
  );
};

export default MessagesPage;