import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCallActive: false,
    isIncomingCall: false,
    callData: null,
};

const videoCallSlice = createSlice({
    name: 'videoCall',
    initialState,
    reducers: {
        setCallActive: (state, action) => {
            state.isCallActive = action.payload;
        },
        setIncomingCall: (state, action) => {
            state.isIncomingCall = action.payload;
        },
        setCallData: (state, action) => {
            state.callData = action.payload;
        },
        resetCallState: (state) => {
            state.isCallActive = false;
            state.isIncomingCall = false;
            state.callData = null;
        },
    },
});

export const {
    setCallActive,
    setIncomingCall,
    setCallData,
    resetCallState,
} = videoCallSlice.actions;

export default videoCallSlice.reducer;