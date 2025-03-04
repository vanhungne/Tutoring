import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// call api get lesson by tutor
export const getLessonByTutorApi = createAsyncThunk(
  "lesson/getLessonByTutorApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await requests.get("/Lesson/get-lesson-by-tutor");
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

// call api add lesson
export const addLessonApi = createAsyncThunk(
  "lesson/addLessonApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/Lesson/add-lesson", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching upgrade requests:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

// call api delete lesson
export const deleteLessonApi = createAsyncThunk(
  "lesson/deleteLessonApi",
  async (id, { rejectWithValue }) => {
    try {
      const response = await requests.delete(`/Lesson/delete-lesson/${id}`);

      return id;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching upgrade requests:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

// call api update lesson
export const updateLessonApi = createAsyncThunk(
  "lesson/updateLessonApi",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await requests.put(`/Lesson/update-lesson/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Response Data:", response);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching upgrade requests:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);



const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    lessons: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLessonByTutorApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLessonByTutorApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.lessons = payload;
    });
    builder.addCase(getLessonByTutorApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(addLessonApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addLessonApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.lessons = [...state.lessons, payload];
    });
    builder.addCase(addLessonApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(deleteLessonApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteLessonApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.lessons = state.lessons.filter((lesson) => lesson.id !== payload);
    });
    builder.addCase(deleteLessonApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(updateLessonApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateLessonApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.lessons = state.lessons.map((lesson) =>
        lesson.id === payload.id ? payload : lesson
      );
    });
    builder.addCase(updateLessonApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export default lessonSlice.reducer;
