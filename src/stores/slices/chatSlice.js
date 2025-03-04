import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// Get chat rooms
export const getChatRooms = createAsyncThunk(
    "chat/getRooms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await requests.get("/chat/get-room");
            return response.data?.$values || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to get chat rooms");
        }
    }
);

export const getUnreadMessageCount = createAsyncThunk(
    "chat/getUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await requests.get("/chat/unread-message-count");
            return response.data?.data || 0;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to get unread message count");
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    "chat/markAsRead",
    async (roomId, { rejectWithValue }) => {
        try {
            await requests.put(`/chat/rooms/${roomId}/mark-messages-read`);
            return roomId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to mark messages as read");
        }
    }
);

// Create chat room
export const createChatRoom = createAsyncThunk(
    "chat/createRoom",
    async ({ instructorName }, { rejectWithValue }) => {
        try {
            const response = await requests.post("/chat/create-room", {
                instructorName
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create chat room");
        }
    }
);

export const getMessageHistory = createAsyncThunk(
    "chat/getMessageHistory",
    async (roomId, { rejectWithValue }) => {
        try {
            const response = await requests.get(`/chat/get-message-history/${roomId}`);
            return response.data?.$values || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to get message history");
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        rooms: [],
        currentRoom: null,
        messages: [],
        isLoading: false,
        isLoadingMessages: false,
        totalUnreadCount: 0,
        error: null
    },
    reducers: {
        setCurrentRoom: (state, action) => {
            state.currentRoom = action.payload;
            // When setting current room, mark its messages as read
            const room = state.rooms.find(r => r.id === action.payload.id);
            if (room) {
                room.hasUnreadMessages = false;
                // Update total unread count
                state.totalUnreadCount = state.rooms.reduce(
                    (count, r) => count + (r.hasUnreadMessages ? 1 : 0),
                    0
                );
            }
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            // If message is not from current room, mark that room as having unread messages
            if (action.payload.roomId !== state.currentRoom?.id) {
                const room = state.rooms.find(r => r.id === action.payload.roomId);
                if (room && !room.hasUnreadMessages) {
                    room.hasUnreadMessages = true;
                    state.totalUnreadCount += 1;
                }
            }
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        updateRoomUnreadStatus: (state, action) => {
            const { roomId, hasUnread } = action.payload;
            const room = state.rooms.find(r => r.id === roomId);
            if (room) {
                const wasUnread = room.hasUnreadMessages;
                room.hasUnreadMessages = hasUnread;
                // Update total unread count
                if (wasUnread && !hasUnread) {
                    state.totalUnreadCount = Math.max(0, state.totalUnreadCount - 1);
                } else if (!wasUnread && hasUnread) {
                    state.totalUnreadCount += 1;
                }
            }
        },
        updateLastSeen: (state, action) => {
            const { roomId, username, lastSeen } = action.payload;
            const room = state.rooms.find(r => r.id === roomId);
            if (room) {
                room.lastSeen = lastSeen;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Rooms
            .addCase(getChatRooms.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getChatRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rooms = action.payload;
                // Calculate initial unread count
                state.totalUnreadCount = action.payload.reduce(
                    (count, room) => count + (room.hasUnreadMessages ? 1 : 0),
                    0
                );
            })
            .addCase(getChatRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.rooms = [];
            })
            // Create Room
            .addCase(createChatRoom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createChatRoom.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    const exists = state.rooms.some(room => room.id === action.payload.id);
                    if (!exists) {
                        state.rooms.push(action.payload);
                    }
                    state.currentRoom = action.payload;
                }
            })
            .addCase(createChatRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getMessageHistory.pending, (state) => {
                state.isLoadingMessages = true;
                state.error = null;
            })
            .addCase(getMessageHistory.fulfilled, (state, action) => {
                state.isLoadingMessages = false;
                state.messages = action.payload;
            })
            .addCase(getMessageHistory.rejected, (state, action) => {
                state.isLoadingMessages = false;
                state.error = action.payload;
                state.messages = [];
            })
            .addCase(getUnreadMessageCount.fulfilled, (state, action) => {
                state.totalUnreadCount = action.payload;
            })
            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                const roomId = action.payload;
                const room = state.rooms.find(r => r.id === roomId);
                if (room && room.hasUnreadMessages) {
                    room.hasUnreadMessages = false;
                    state.totalUnreadCount = Math.max(0, state.totalUnreadCount - 1);
                }
            });
    }
});

export const {
    setCurrentRoom,
    addMessage,
    clearMessages,
    updateRoomUnreadStatus,
    updateLastSeen
} = chatSlice.actions;

export default chatSlice.reducer;