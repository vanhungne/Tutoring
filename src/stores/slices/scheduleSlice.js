import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// get view schedule manager
export const getScheduleApi = createAsyncThunk(
  "schedule/getScheduleApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requests.get(
        "/TutorSchedule/schedules/instructor"
      );
      if (response.data && response.data.data && response.data.data.$values) {
        return response.data.data.$values;
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lịch trình không tìm thấy."
      );
    }
  }
);

// Fetch schedules by instructor username
export const getScheduleByUsernameApi = createAsyncThunk(
  "schedule/getScheduleByUsernameApi",
  async (userName, { rejectWithValue }) => {
    try {
      const response = await requests.get(`/TutorSchedule/schedules/instructor/${userName}`);
      return response.data.data.$values;
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
      return rejectWithValue(errorMessage);
    }
  }
);
// add schedule instructor
export const addScheduleApi = createAsyncThunk(
  "schedule/addScheduleApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/TutorSchedule/schedules", data);
      console.log("Thêm lịch trình từ API:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Lỗi không xác định";
      return rejectWithValue(errorMessage);
    }
  }
);
// Fetch schedule by ID
export const getScheduleByIdApi = createAsyncThunk(
  "schedule/getScheduleByIdApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await requests.get(`/TutorSchedule/schedules/${id}`);
      return response.data.data; 
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
      return rejectWithValue(errorMessage);
    }
  }
);
// Delete schedule by ID
export const deleteScheduleApi = createAsyncThunk(
  "schedule/deleteScheduleApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await requests.delete(`/TutorSchedule/schedules/${id}`);
      return id; // Return the ID of the deleted schedule
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
      return rejectWithValue(errorMessage);
    }
  }
);
// Update schedule by ID
export const updateScheduleApi = createAsyncThunk(
  "schedule/updateScheduleApi",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await requests.put(`/TutorSchedule/schedules/${id}`, data);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      const errorMessage = error.response?.data || error.message || "Lỗi không xác định";
      return rejectWithValue(errorMessage);
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    schedule: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getScheduleApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getScheduleApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.schedule = payload.length > 0 ? payload : [];
        state.error = payload.length === 0 ? "Không có lịch trình nào." : null;
      })
      .addCase(getScheduleApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.schedule = [];
      })
      .addCase(getScheduleByUsernameApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getScheduleByUsernameApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.schedule = payload;
        state.error = null;
      })
      .addCase(getScheduleByUsernameApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(addScheduleApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addScheduleApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.schedule = [...state.schedule, payload];
        state.error = null;
      })
      .addCase(addScheduleApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(deleteScheduleApi.fulfilled, (state, { payload }) => {
        state.schedule = state.schedule.filter(schedule => schedule.tutorAvailabilityId !== payload);
        state.error = state.schedule.length === 0 ? "Không có lịch trình nào." : null;
      })
      .addCase(deleteScheduleApi.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(updateScheduleApi.fulfilled, (state, { payload }) => {
        state.schedule = state.schedule.map(schedule =>
          schedule.tutorAvailabilityId === payload.tutorAvailabilityId ? payload : schedule
        );
        state.error = null;
      })
      .addCase(updateScheduleApi.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export default scheduleSlice.reducer;
