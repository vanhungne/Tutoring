import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import requests from '../../Utils/requests';

export const fetchAllLanguages = createAsyncThunk(
    'language/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await requests.get('/Language/get_all_language');
            if (response.data && response.data.data && response.data.data.$values) {
                return response.data.data.$values;
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch languages');
        }
    }
);

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        languages: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLanguages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllLanguages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.languages = action.payload;
            })
            .addCase(fetchAllLanguages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default languageSlice.reducer;