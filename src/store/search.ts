import { createSlice } from '@reduxjs/toolkit';
import { searchMailbox } from './thunks/search';
import { searchAdapter } from './adapters/search';
import { accountLogout } from './thunks/accountLogout';

const initialState = searchAdapter.getInitialState({
  loading: false,
});

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch: searchAdapter.removeAll,
  },
  extraReducers: builder => {
    builder.addCase(searchMailbox.pending, state => {
      state.loading = true;
    });
    builder.addCase(searchMailbox.fulfilled, (state, action) => {
      state.loading = false;
      searchAdapter.setAll(state, action.payload);
    });
    builder.addCase(searchMailbox.rejected, state => {
      state.loading = false;
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => initialState);
  },
});

export const searchReducer = searchSlice.reducer;

export const { resetSearch } = searchSlice.actions;
