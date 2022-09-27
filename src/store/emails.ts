import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllMailByFolder,
  getMailboxes,
  getMailboxFolders,
  getMailByFolderRead,
  getMailByFolderUnread,
  getMessageById,
  getMessagesByAliasId,
  getReadMessagesByAliasId,
  getUnreadMessagesByAliasId,
  saveMailbox,
  saveMailToDB,
} from './thunks/email';
import { accountLogout } from './thunks/accountLogout';
import { emailAdapter } from './adapters/emails';
import { Email, Mailbox } from './types';
import { FilterType } from '../components/MailList/components/MailFilters';
import { FoldersId } from './types/enums/Folders';

interface EmailState {
  byFolderId: {
    [id: number]: {
      [key: string]: {
        ids: string[];
        entities: { [id: string]: Email };
      };
    };
  };
  mailbox: Mailbox | undefined;
}

const updateMailInState = (state: EmailState, mail: Email) => {
  if (mail.unread) {
    emailAdapter.setOne(state.byFolderId[mail.folderId].unread, mail);
    // emailAdapter.removeOne(state.byFolderId[mail.folderId].read, mail.emailId);
  }
  if (!mail.unread) {
    emailAdapter.setOne(state.byFolderId[mail.folderId].read, mail);
    // emailAdapter.removeOne(
    //   state.byFolderId[mail.folderId].unread,
    //   mail.emailId,
    // );
  }
  emailAdapter.setOne(state.byFolderId[mail.folderId].all, mail);
};

const emailInitialState = {
  byFolderId: {
    1: {
      all: { ids: [], entities: {} },
      read: { ids: [], entities: {} },
      unread: { ids: [], entities: {} },
    },
  },
  mailbox: undefined,
} as EmailState;

export const emailSlice = createSlice({
  name: 'email',
  initialState: emailInitialState,
  reducers: {
    resetMailsByFolder: (
      state,
      action: PayloadAction<{ folderId: number; filter: FilterType }>,
    ) => {
      emailAdapter.removeAll(
        state.byFolderId[action.payload.folderId][action.payload.filter],
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(saveMailToDB.fulfilled, (state, action) => {
      action.payload.msgArr.map(msg => updateMailInState(state, msg));
    });
    // builder.addCase(markAsUnread.fulfilled, (state, action) =>
    //   emailAdapter.setMany(state, action.payload),
    // );
    builder.addCase(getMailboxFolders.fulfilled, (state, action) => {
      const storedFolders = Object.keys(state.byFolderId);
      action.payload.map(folder => {
        if (!storedFolders.includes(folder.folderId.toString())) {
          state.byFolderId[folder.folderId] = emailInitialState.byFolderId[1];
        }
      });
    });

    builder.addCase(getMessageById.fulfilled, (state, action) =>
      updateMailInState(state, action.payload),
    );
    builder.addCase(getAllMailByFolder.fulfilled, (state, action) => {
      const folderIdToUpdate = action.payload[0]?.folderId;
      if (folderIdToUpdate) {
        emailAdapter.setMany(
          state.byFolderId[folderIdToUpdate].all,
          action.payload,
        );
      }
    });
    builder.addCase(getMailByFolderUnread.fulfilled, (state, action) => {
      const folderIdToUpdate = action.payload[0]?.folderId;
      if (folderIdToUpdate) {
        emailAdapter.setMany(
          state.byFolderId[folderIdToUpdate].unread,
          action.payload,
        );
      }
    });
    builder.addCase(getMailByFolderRead.fulfilled, (state, action) => {
      const folderIdToUpdate = action.payload[0]?.folderId;
      if (folderIdToUpdate) {
        emailAdapter.setMany(
          state.byFolderId[folderIdToUpdate].read,
          action.payload,
        );
      }
    });
    builder.addCase(getMessagesByAliasId.fulfilled, (state, action) => {
      const folderIdToUpdate = action.payload[0]?.folderId;
      if (folderIdToUpdate) {
        emailAdapter.setMany(
          state.byFolderId[folderIdToUpdate].all,
          action.payload,
        );
      }
    });
    builder.addCase(getUnreadMessagesByAliasId.fulfilled, (state, action) => {
      emailAdapter.setMany(
        state.byFolderId[FoldersId.aliases].unread,
        action.payload,
      );
    });
    builder.addCase(getReadMessagesByAliasId.fulfilled, (state, action) => {
      emailAdapter.setMany(
        state.byFolderId[FoldersId.aliases].read,
        action.payload,
      );
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

export const { resetMailsByFolder } = emailSlice.actions;

export const emailReducer = emailSlice.reducer;
