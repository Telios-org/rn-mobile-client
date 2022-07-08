import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterOption } from '../components/MailList';
import { accountLogout } from './account';

interface GlobalState {
  messageListFilters: MessageListFilters;
}

const initialState: GlobalState = {
  messageListFilters: {},
};

interface MessageListFilters {
  [filterType: string]: string | FilterOption;
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMessageListFilters(state, action: PayloadAction<MessageListFilters>) {
      state.messageListFilters = action.payload;
    },
  },
  extraReducers: builder => {
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      const newState = { ...initialState };
      return newState;
    });
  },
});

export const { setMessageListFilters } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;
