import { folderAdapter } from './adapters/folders';
import { createSlice } from '@reduxjs/toolkit';
import { getMailboxFolders } from './thunks/email';

const folderSlice = createSlice({
  name: 'folder',
  initialState: folderAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMailboxFolders.fulfilled, folderAdapter.setAll);
  },
});

export const foldersReducer = folderSlice.reducer;
