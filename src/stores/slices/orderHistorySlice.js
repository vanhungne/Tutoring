import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// Get user's booking history
export const getBookingHistory = createAsyncThunk(
    "orderHistory/getBookingHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await requests.get("/Booking/get-all-of-user");
            return response.data?.data?.$values || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch booking history");
        }
    }
);

// Get booking details by ID
export const getBookingDetails = createAsyncThunk(
    "orderHistory/getBookingDetails",
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await requests.get(`/Booking/${bookingId}`);
            return response.data?.data || null;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch booking details");
        }
    }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk(
    "orderHistory/cancelBooking",
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await requests.put(`/Booking/cancel/${bookingId}`);
            return { bookingId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to cancel booking");
        }
    }
);

const orderHistorySlice = createSlice({
    name: "orderHistory",
    initialState: {
        bookings: [],
        selectedBooking: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearSelectedBooking: (state) => {
            state.selectedBooking = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Booking History
            .addCase(getBookingHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBookingHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload;
            })
            .addCase(getBookingHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Booking Details
            .addCase(getBookingDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBookingDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedBooking = action.payload;
            })
            .addCase(getBookingDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Cancel Booking
            .addCase(cancelBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update the status of the cancelled booking
                const index = state.bookings.findIndex(
                    (booking) => booking.bookingId === action.payload.bookingId
                );
                if (index !== -1) {
                    state.bookings[index].status = "Cancelled";
                }
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelectedBooking } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;