import { getUserProfile } from "@/actions/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../../generated/prisma/client";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    const result = await getUserProfile();

    if ("error" in result) return rejectWithValue(result.error);

    return result.data as User;
  }
);

interface UserState {
  loading: boolean;
  data: User | null;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  data: null,
  error: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;
