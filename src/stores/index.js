import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import listInstructorSlice from "./slices/listInstructorSlice";
import favoriteSlice from "./slices/favoriteSlice";
import scheduleSlice from "./slices/scheduleSlice";
import chatSlice from "./slices/chatSlice.js";
import videoCallSlice from "./slices/videoCallSlice";
import lessonSlice from "./slices/lessonSlice.js";
import languageSlice from "./slices/languageSlice";
import orderHistorySlice from "./slices/orderHistorySlice.js";

// create store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    instructor: listInstructorSlice,
    favorite: favoriteSlice,
    schedule: scheduleSlice,
    chat: chatSlice,
    videoCall: videoCallSlice,
    language: languageSlice,
    lessons: lessonSlice,
    orderHistory: orderHistorySlice,
  },
});

export default store;