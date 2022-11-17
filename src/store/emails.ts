import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllMailByFolder,
  getMailboxes,
  getMailboxFolders,
  getMailByFolderRead,
  getMailByFolderUnread,
  getMessageById,
  markAsUnreadFlow,
  getMessagesByAliasId,
  getReadMessagesByAliasId,
  getUnreadMessagesByAliasId,
  saveMailbox,
  saveMailToDB,
  moveMailToTrash,
  deleteMailFromFolder,
  sendEmail,
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

const updateReadMailInState = (state: EmailState, mail: Email) => {
  // getMessageById marks mails as read on backend
  emailAdapter.setOne(state.byFolderId[mail.folderId].all, mail);
  emailAdapter.setOne(state.byFolderId[mail.folderId].read, mail);
  emailAdapter.removeOne(state.byFolderId[mail.folderId].unread, mail.emailId);
};

const updateUnreadMailInState = (state: EmailState, mail: Email) => {
  emailAdapter.setOne(state.byFolderId[mail.folderId].all, {
    ...mail,
    unread: true,
  });
  emailAdapter.setOne(state.byFolderId[mail.folderId].unread, {
    ...mail,
    unread: true,
  });
  emailAdapter.removeOne(state.byFolderId[mail.folderId].read, mail.emailId);
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
      action.payload.msgArr.map(msg => {
        emailAdapter.setOne(state.byFolderId[msg.folderId].unread, msg);
        emailAdapter.setOne(state.byFolderId[msg.folderId].all, msg);
      });
    });
    builder.addCase(markAsUnreadFlow.fulfilled, (state, action) => {
      updateUnreadMailInState(state, action.payload.email);
    });
    builder.addCase(getMailboxFolders.fulfilled, (state, action) => {
      const storedFolders = Object.keys(state.byFolderId);
      action.payload.map(folder => {
        if (!storedFolders.includes(folder.folderId.toString())) {
          state.byFolderId[folder.folderId] = emailInitialState.byFolderId[1];
        }
      });
    });

    builder.addCase(getMessageById.fulfilled, (state, action) => {
      updateReadMailInState(state, action.payload);
    });
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
      state.mailbox = mailboxes[0]; // initial implementation was with one mailbox
    });
    builder.addCase(saveMailbox.fulfilled, (state, action) => {
      state.mailbox = action.payload;
    });
    builder.addCase(moveMailToTrash.fulfilled, (state, action) => {
      if (action.payload) {
        emailAdapter.removeMany(
          state.byFolderId[action.payload.fromFolderId].all,
          action.payload.messageIds,
        );
        emailAdapter.removeMany(
          state.byFolderId[action.payload.fromFolderId].unread,
          action.payload.messageIds,
        );
        emailAdapter.removeMany(
          state.byFolderId[action.payload.fromFolderId].read,
          action.payload.messageIds,
        );
        emailAdapter.setMany(
          state.byFolderId[FoldersId.trash].all,
          action.payload.messages,
        );
      }
    });
    builder.addCase(sendEmail.fulfilled, (state, action) => {
      emailAdapter.setOne(state.byFolderId[FoldersId.sent].all, action.payload);
    });
    builder.addCase(deleteMailFromFolder.fulfilled, (state, action) => {
      emailAdapter.removeMany(
        state.byFolderId[action.payload.folderId].all,
        action.payload.messageIds,
      );
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return emailInitialState;
    });
  },
});

export const { resetMailsByFolder } = emailSlice.actions;

export const emailReducer = emailSlice.reducer;
