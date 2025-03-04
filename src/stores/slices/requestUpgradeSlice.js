import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

export const getInstructorSchedules = async () => {
    try {
        const response = await requests.get("/TutorSchedule/schedules/instructor");
        return response.data; // Adjust based on your API response structure
    } catch (error) {
        console.error("Error fetching instructor schedules:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const getUpgradeRequests = async () => {
    try {
        const response = await requests.get('/UpgradeRequest/pending');
        return response.data; // Adjust based on your API response structure
    } catch (error) {
        console.error("Error fetching upgrade requests:", error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const approveRequest = createAsyncThunk(
    'requests/approve',
    async (requestId) => {
        try {
            const response = await requests.post(`/UpgradeRequest/${requestId}/approve`);
            return response.data; // Adjust based on your API response structure
        } catch (error) {
            console.error("Error approving request:", error);
            throw error; // Rethrow the error for handling in the component
        }
    }
);

export const rejectRequest = createAsyncThunk(
    'requests/reject',
    async (requestId) => {
        try {
            const response = await requests.post(`/UpgradeRequest/${requestId}/reject`);
            return response.data; // Adjust based on your API response structure
        } catch (error) {
            console.error("Error rejecting request:", error);
            throw error; // Rethrow the error for handling in the component
        }
    }
);
