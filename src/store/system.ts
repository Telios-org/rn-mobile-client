import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountLogout } from './account';

interface SystemState {}

const initialState: SystemState = {};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      const newState = { ...initialState };
      return newState;
    });
  },
});

export const systemReducer = systemSlice.reducer;
