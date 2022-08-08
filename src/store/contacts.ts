import { createSlice } from '@reduxjs/toolkit';
import { accountLogout } from './thunks/accountLogout';

interface ContactsState {}

const initialState: ContactsState = {};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return { ...initialState };
    });
  },
});

export const contactsReducer = contactsSlice.reducer;
