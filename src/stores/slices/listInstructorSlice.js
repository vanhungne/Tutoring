import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// call api get List Instructor
export const getListInstructorApi = createAsyncThunk(
  "instructor/getListInstructorApi",
  async ({ pageNumber = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await requests.get(
        `/Home?PageNumber=${pageNumber}&PageSize=${pageSize}`
      );
      return response.data.data.$values;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching upgrade requests:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

const listInstructorSlice = createSlice({
  name: "instructor",
  initialState: {
    listInstructor: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListInstructorApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getListInstructorApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.listInstructor = Array.isArray(payload) ? payload : []; 
    });
    
    builder.addCase(getListInstructorApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export default listInstructorSlice.reducer;
