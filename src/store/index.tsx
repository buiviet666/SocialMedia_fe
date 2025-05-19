import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/index";
import loadingReducer from "./loadingSlice/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
