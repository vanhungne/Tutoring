import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../Utils/requests";

// Define the initial state
const initialState = {
  upgradeRequests: [], // Ensure this is an array
  isLoading: false,
  error: null,
};

// call api register
export const registerApi = createAsyncThunk(
  "auth/registerApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/Authen/register/student", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error details:", error.response.data.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

// call api forgetPassWord
export const forgetPassWordApi = createAsyncThunk(
  "auth/forgetPassWordApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/User/forgot-password", data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error details:", error.response.data.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

// call api otp
export const verifyCodeApi = createAsyncThunk(
  "auth/verifyCodeApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/User/verify-code", data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error details:", error.response.data.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

// call api resetPassword
export const resetPasswordApi = createAsyncThunk(
  "auth/resetPasswordApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/User/reset-password", data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error details:", error.response.data.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

// Call API to submit application
export const applyTutorApi = createAsyncThunk(
  "auth/applyTutorApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.post("/UpgradeRequest", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error details:", error.response.data.errors);
      return rejectWithValue(errorMessage);
    }
  }
);
export const getUpgradeRequestsApi = createAsyncThunk(
  "auth/getUpgradeRequestsApi",
  async (_, { getState, rejectWithValue }) => {
    try {
      let accessToken = getState().auth.currentUser?.accessToken;

      if (!accessToken) {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        accessToken = storedUser?.accessToken;
      }

      if (!accessToken) throw new Error("No authentication token found");

      const response = await requests.get("/UpgradeRequest/pending", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error fetching upgrade requests:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


//
// API call to update user profile
export const updateUserProfileApi = createAsyncThunk(
  "auth/updateUserProfileApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.put("/User/update_profile", data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error updating profile:", error.response?.data?.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

// API call to update user avatar
export const updateUserAvatarApi = createAsyncThunk(
  "auth/updateUserAvatarApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requests.put("/User/update_profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || "Unknown error occurred";
      console.error("Error updating avatar:", error.response?.data?.errors);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState, // Use the initialState defined above
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload; // Set the current user
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerApi.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.currentUser = payload;
    });
    builder.addCase(registerApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(forgetPassWordApi.pending, (state) => {
      state.isLoading = true;
    });
    builder
      .addCase(forgetPassWordApi.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgetPassWordApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
    builder.addCase(verifyCodeApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyCodeApi.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(verifyCodeApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder.addCase(resetPasswordApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPasswordApi.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(resetPasswordApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    });
    builder
      .addCase(applyTutorApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyTutorApi.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(applyTutorApi.rejected, (state, { payload }) => {
        state.error = payload;
      });
    builder
      .addCase(getUpgradeRequestsApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUpgradeRequestsApi.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.upgradeRequests = payload.data?.$values || []; // Safely access the array
        console.log(payload);
      })
      .addCase(getUpgradeRequestsApi.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { setCurrentUser } = authSlice.actions; // Export the action
export default authSlice.reducer;