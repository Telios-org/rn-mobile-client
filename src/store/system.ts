import { createSlice } from '@reduxjs/toolkit';
import { accountLogout } from './thunks/accountLogout';

interface SystemState {}

const initialState: SystemState = {};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return { ...initialState };
    });
  },
});

export const systemReducer = systemSlice.reducer;
