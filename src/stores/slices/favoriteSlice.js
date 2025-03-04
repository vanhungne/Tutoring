import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// call api get favorite
export const getFavoriteApi = createAsyncThunk(
  "favorite/getFavoriteApi",
  async ({ pageNumber = 1, pageSize = 5 }, { rejectWithValue }) => {
    if (pageNumber < 1) {
      return [];
    }
    try {
      const response = await requests.get(
        `/Favorite?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      console.log("Danh sách yêu thích từ API:", response.data);

      // Lấy danh sách từ $values, nếu không có thì trả về []
      return response.data?.$values || [];
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching favorite requests:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


// call api delete favorite
export const deleteFavoriteApi = createAsyncThunk(
  "favorite/ deleteFavoriteApi",
  async (userName, { rejectWithValue }) => {
    try {
      const response = await requests.delete(
        `/Favorite?instructorId=${userName}`
      );
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

//call api add favorite
export const addFavoriteApi = createAsyncThunk(
  "favorite/addFavoriteApi",
  async (userName, { getState, rejectWithValue }) => {
    if (!userName) {
      return rejectWithValue("User Name is missing");
    }

    // Kiểm tra nếu instructor đã tồn tại
    const { favoriteInstructor } = getState().favorite;
    const isAlreadyFavorite = favoriteInstructor.some(
      (tutor) => tutor.userName === userName
    );

    if (isAlreadyFavorite) {
      return rejectWithValue("Instructor already added to favorites.");
    }

    try {
      const response = await requests.post(
        `/Favorite?instructorId=${userName}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error adding favorite:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favoriteInstructor: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFavoriteApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFavoriteApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.favoriteInstructor = payload || [];
    });
    builder.addCase(getFavoriteApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      state.favoriteInstructor = [];
    });
    builder.addCase(deleteFavoriteApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteFavoriteApi.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteFavoriteApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = { payload };
    });
    builder.addCase(addFavoriteApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addFavoriteApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.favoriteInstructor = [...state.favoriteInstructor, payload];
    });
    builder.addCase(addFavoriteApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
  },
});

export default favoriteSlice.reducer;
