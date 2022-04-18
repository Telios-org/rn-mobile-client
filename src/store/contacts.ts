import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountLogout } from './account';

interface ContactsState {}

const initialState: ContactsState = {};

export const contactsSlice = createSlice({
  name: 'contacts',
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

export const contactsReducer = contactsSlice.reducer;
