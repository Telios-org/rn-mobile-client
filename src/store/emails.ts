import { createSlice } from '@reduxjs/toolkit';
import {
  getMailboxes,
  getMailboxFolders,
  getMailByFolder,
  getMessageById,
  saveMailbox,
  saveMailToDB,
} from './thunks/email';
import { accountLogout } from './thunks/accountLogout';
import { emailAdapter } from './adapters/emails';
import { Email, Mailbox } from './types';

interface EmailState {
  byFolderId: {
    [id: number]: { ids: string[]; entities: { [id: string]: Email } };
  };
  emailsLoading: boolean;
  mailbox: Mailbox | undefined;
}
const emailInitialState = {
  byFolderId: { 1: { ids: [], entities: {} } },
  emailsLoading: false,
  mailbox: undefined,
} as EmailState;

export const emailSlice = createSlice({
  name: 'email',
  initialState: emailInitialState,
  reducers: {
    // fileFetched: (state, action: PayloadAction<FileFetchedPayload>) => {
    //   const email = action.payload;
    //   // TODO: update state with new email
    // },
  },
  extraReducers: builder => {
    builder.addCase(saveMailToDB.fulfilled, (state, action) => {
      action.payload.msgArr.map(msg =>
        emailAdapter.setOne(state.byFolderId[msg.folderId], msg),
      );
    });
    // builder.addCase(markAsUnread.fulfilled, (state, action) =>
    //   emailAdapter.setMany(state, action.payload),
    // );
    builder.addCase(getMailboxFolders.fulfilled, (state, action) => {
      const storedFolders = Object.keys(state.byFolderId);
      action.payload.map(folder => {
        if (!storedFolders.includes(folder.folderId.toString())) {
          state.byFolderId[folder.folderId] = { ids: [], entities: {} };
        }
      });
    });

    builder.addCase(getMessageById.fulfilled, (state, action) => {
      emailAdapter.setOne(
        state.byFolderId[action.payload.folderId],
        action.payload,
      );
    });
    builder.addCase(getMailByFolder.pending, state => {
      state.emailsLoading = true;
    });
    builder.addCase(getMailByFolder.fulfilled, (state, action) => {
      const folderIdToUpdate = action.payload[0].folderId;
      emailAdapter.setAll(state.byFolderId[folderIdToUpdate], action.payload);
      state.emailsLoading = false;
    });
    builder.addCase(getMailByFolder.rejected, state => {
      state.emailsLoading = false;
    });
    builder.addCase(getMailboxes.fulfilled, (state, action) => {
      const mailboxes = action.payload;
      state.mailbox = mailboxes[0]; // TODO initial implementation was with one mailbox, need to fix it
    });
    builder.addCase(saveMailbox.fulfilled, (state, action) => {
      state.mailbox = action.payload;
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return emailInitialState;
    });
  },
});

export const emailReducer = emailSlice.reducer;
