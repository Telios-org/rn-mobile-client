import { folderAdapter } from './adapters/folders';
import { createSlice } from '@reduxjs/toolkit';
import { getMailboxFolders } from './thunks/email';
import { updateFolderCountFlow } from './thunks/folders';

const folderSlice = createSlice({
  name: 'folder',
  initialState: folderAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMailboxFolders.fulfilled, folderAdapter.setAll);
    builder.addCase(updateFolderCountFlow.fulfilled, (state, action) => {
      folderAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          count:
            (state.entities[action.payload.id]?.count || 0) +
            action.payload.amount,
        },
      });
    });
  },
});

export const foldersReducer = folderSlice.reducer;
