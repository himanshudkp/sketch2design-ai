import { configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./slices/userProfileSlice";

const devTools = process.env.NODE_ENV !== ("production" as const);

export const store = configureStore({
  reducer: {
    userProfile: userProfileSlice,
  },
  devTools,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
