import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import { registerOneTimeListener } from '../eventListenerMiddleware';
import { FileFetchedPayload } from '../fileFetchedMiddleware';
import { RootState } from '../store';
import { createNodeCalloutAsyncThunk } from '../util/nodeActions';
import { accountLogout } from './account';
import {
  folderIdByNameSelector,
  FolderName,
  getFolderIdByName,
} from './mailSelectors';

export type ToFrom = { address: string; name?: string };

export type MailMeta = { account_key: string; msg: string; _id: string };

export type EmailDraft = {
  _id?: string;
  attachments?: Array<any>;
  bcc?: Array<any>;
  cc?: Array<any>;
  date: string;
  from: Array<ToFrom>;
  headers?: Array<any>;
  html_body?: string;
  sender?: Array<any>;
  subject?: string;
  text_body?: string;
  to: Array<ToFrom>;
};

export type EmailContent = {
  _id: string;
  attachments: Array<any>;
  bcc: Array<any>;
  cc: Array<any>;
  date: string;
  from: Array<ToFrom>;
  headers: Array<any>;
  html_body: string;
  sender: Array<any>;
  subject: string;
  text_body: string;
  to: Array<ToFrom>;
};

export type Email = {
  content: EmailContent;
  header: string;
  key: string;
  savedToDB?: boolean;
  markedAsSynced?: boolean;
  _id?: string;
};

export type LocalEmail = {
  aliasId: string;
  attachments: string;
  bccJSON: string;
  bodyAsHtml: string;
  bodyAsText: string;
  ccJSON: string;
  createdAt: string;
  date: string;
  emailId: string;
  encHeader: string;
  encKey: string;
  folderId: string;
  fromJSON: string;
  id: string;
  path: string;
  size: string;
  subject: string;
  toJSON: string;
  unread: string;
  updatedAt: string;
  _id: string;
};

export type OutgoingEmail = {
  from: Array<ToFrom>;
  to: Array<ToFrom>;
  subject: string;
  date?: string; // needed??
  cc: Array<ToFrom>;
  bcc: Array<ToFrom>;
  bodyAsText: string;
  bodyAsHTML?: string; // needed?
  attachments?: Array<{
    filename: string;
    content: string;
    mimetype: string;
    size: number;
  }>;
};

export type Mailbox = {
  address: string;
  mailboxId: string;
  _id: string;
};

export type MailboxFolder = {
  count: number;
  createdAt: string;
  folderId: number;
  icon: string;
  mailboxId: string;
  name: string;
  seq: number;
  type: string;
  updatedAt: string;
  _id: string;
};

export interface MailState {
  mailMeta: { [id: string]: MailMeta };
  mail: { [id: string]: LocalEmail };
  mailIdsForFolder: { [folderId: string]: string[] };
  mailbox?: Mailbox; // assuming only one for now
  folders: Array<MailboxFolder>;

  loadingGetMailMeta?: boolean;
  loadingSendEmail?: boolean;
}

const initialState: MailState = {
  mail: {},
  mailMeta: {},
  mailIdsForFolder: {},
  folders: [],
};

export const getNewMailFlow = createAsyncThunk(
  'flow/getNewMail',
  async (_, thunkAPI): Promise<void> => {
    const newMailMetaResponse = await thunkAPI.dispatch(getNewMailMeta());
    if (newMailMetaResponse.type == getNewMailMeta.rejected.type) {
      throw new Error(JSON.stringify(newMailMetaResponse.payload));
    }
    const mailMeta = newMailMetaResponse.payload as GetNewMailMetaResponse;

    if (mailMeta.meta.length > 0) {
      // after calling getMessageBatch we async wait for messageHandler:newMessage event
      // non-blocking here, as each `messageHandler:newMessage` could take some time to arrive
      thunkAPI.dispatch(getMessageBatch(mailMeta));
    }

    // error handling is tricky here -
    // should we expect errors back from getMessageBatch?
    // what if it takes forever to get a message?
    // for now - don't re-throw any errors from getMessageBatch
  },
);

export type RegisterMailboxRequest = {
  account_key: string;
  addr: string;
};
export type RegisterMailboxResponse = void;
export const registerMailbox = createNodeCalloutAsyncThunk<
  RegisterMailboxRequest,
  RegisterMailboxResponse
>('mailbox:register');

export type SaveMailboxRequest = {
  address: string;
};
export type SaveMailboxResponse = {
  address: string;
  mailboxId: string;
  _id: string;
};
export const saveMailbox = createNodeCalloutAsyncThunk<
  SaveMailboxRequest,
  SaveMailboxResponse
>('mailbox:saveMailbox');

export type GetNewMailMetaRequest = void;
export type GetNewMailMetaResponse = {
  account: {
    accountId: string;
    createdAt: string;
    deviceId: string;
    deviceSigningPrivKey: string;
    deviceSigningPubKey: string;
    driveEncryptionKey: string;
    secretBoxPrivKey: string;
    secretBoxPubKey: string;
    serverSig: string;
    uid: string;
    updatedAt: string;
    _id: string;
  };
  meta: Array<{ account_key: string; msg: string; _id: string }>;
};
export const getNewMailMeta = createNodeCalloutAsyncThunk<
  GetNewMailMetaRequest,
  GetNewMailMetaResponse
>('mailbox:getNewMailMeta');

export type GetMessageBatchRequest = GetNewMailMetaResponse;
export type GetMessageBatchResponse = {};
export const getMessageBatch = createNodeCalloutAsyncThunk<
  GetMessageBatchRequest,
  GetMessageBatchResponse
>('messageHandler:newMessageBatch');

export type GetMessageRequest = GetNewMailMetaResponse;
export type GetMessageResponse = {};
export const getMessage = createNodeCalloutAsyncThunk<
  GetMessageBatchRequest,
  GetMessageBatchResponse
>('messageHandler:newMessage');

export type SaveDraftRequest = EmailDraft;
export const saveDraft = createAsyncThunk(
  'flow/saveDraft',
  async (data: SaveDraftRequest, thunkAPI) => {
    const response = await thunkAPI.dispatch(
      saveMailToDB({ messageType: 'Draft', messages: [data] }),
    );
    if (response.type === saveMailToDB.fulfilled.type) {
      return response.payload as SaveMailToDBResponse;
    } else {
      throw new Error('Unable to save draft');
    }
  },
);

export interface MailToMove extends EmailContent {
  folder: {
    toId: number;
    // fromId?: number;
    // name?: string;
  };
}
export type MoveMailToTrashRequest = {
  messages: MailToMove[];
};
export type MoveMailToTrashResponse = {
  //todo
};
export const moveMailToTrash = createNodeCalloutAsyncThunk<
  MoveMailToTrashRequest,
  MoveMailToTrashResponse
>('email:moveMessages');

export type DeleteMailRequest = {
  messageIds: string[];
};
export type DeleteMailResponse = {};
export const deleteMail = createNodeCalloutAsyncThunk<
  DeleteMailRequest,
  DeleteMailResponse
>('email:removeMessages');

// TODO: prevent duplicate emails from being added to DB
// no logic to prevent that today, and it could happen
// if there is any interruption between inserting into DB and 'mark as synced' call succeeding
export type SaveMailToDBRequest = {
  messageType: 'Incoming' | 'Draft';
  messages: Array<EmailDraft & { bodyAsText?: string; bodyAsHTML?: string }>;
};
export type SaveMailToDBResponse = {
  msgArr: Array<LocalEmail>;
  newAliases: Array<any>;
};
const SaveMailToDBEventName = 'email:saveMessageToDB';
export const saveMailToDB = createAsyncThunk(
  `local/${SaveMailToDBEventName}`,
  async (
    data: SaveMailToDBRequest,
    thunkAPI,
  ): Promise<SaveMailToDBResponse> => {
    return new Promise((resolve, reject) => {
      const firstEmailId = data.messages[0]?._id;
      const state: RootState = thunkAPI.getState();

      const inboxFolderId = folderIdByNameSelector(state, FolderName.inbox);
      const inboxMailIds = state?.mail?.mailIdsForFolder?.[inboxFolderId] || [];

      if (inboxMailIds.includes(firstEmailId)) {
        return;
      }
      nodejs.channel.send({
        event: SaveMailToDBEventName,
        payload: data,
      });

      if (firstEmailId) {
        // use a custom predicate for our listener
        // to match up specific request / responses
        // -- this is necessary because often when receiving emails, we get many concurrent running
        // requests to save to DB, and we need a way to match up each request/response pair.
        registerOneTimeListener(
          {
            eventName: `node/${SaveMailToDBEventName}:callback`,
            customPredicate: action => {
              return action.data.msgArr?.[0]?.emailId === firstEmailId;
            },
          },
          event => {
            if (event.error) {
              reject(event.error);
            } else {
              // TODO: break this part out into a separate flow
              // TODO: batch these up, rather than call for every single item inserted to DB.
              const emailIds: string[] = event.data.msgArr.map(
                item => item._id,
              );
              thunkAPI.dispatch(updateMailAsSynced({ msgArray: emailIds }));
              resolve(event.data);
            }
          },
        );
      } else {
        // if the email we're saving has no _id, we need to assume the next node callback is the match
        // -- this assumption could break if emails are rolling in concurrently as a user saves a Draft, for instance.
        registerOneTimeListener(
          {
            eventName: `node/${SaveMailToDBEventName}:callback`,
          },
          event => {
            if (event.error) {
              reject(event.error);
            } else {
              resolve(event.data);
            }
          },
        );
      }
    });
  },
);

export type UpdateMailAsSyncedRequest = { msgArray: string[] };
export type UpdateMailAsSyncedResponse = string[];
export const updateMailAsSynced = createNodeCalloutAsyncThunk<
  UpdateMailAsSyncedRequest,
  UpdateMailAsSyncedResponse
>('mailbox:markArrayAsSynced');

export type GetMailboxesRequest = void;
export type GetMailboxesResponse = Array<Mailbox>;
export const getMailboxes = createNodeCalloutAsyncThunk<
  GetMailboxesRequest,
  GetMailboxesResponse
>('mailbox:getMailboxes');

export type GetMailboxFoldersRequest = { id: string };
export type GetMailboxFoldersResponse = Array<MailboxFolder>;
export const getMailboxFolders = createNodeCalloutAsyncThunk<
  GetMailboxFoldersRequest,
  GetMailboxFoldersResponse
>('folder:getMailboxFolders');

export type GetMailByFolderRequest = { id: string | number };
export type GetMailByFolderResponse = Array<LocalEmail>;
export const getMailByFolder = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getMessagesByFolderId');

export type MarkAsUnreadRequest = { id: string | number };
export type MarkAsUnreadResponse = any; //Array<LocalEmail>;
export const markAsUnread = createNodeCalloutAsyncThunk<
  MarkAsUnreadRequest,
  MarkAsUnreadResponse
>('email:markAsUnread');

export type GetMessageByIdRequest = { id: string | number };
export type GetMessageByIdResponse = any; //Array<LocalEmail>;
export const getMessageById = createNodeCalloutAsyncThunk<
  GetMessageByIdRequest,
  GetMessageByIdResponse
>('email:getMessageById');

export type SendEmailRequest = { email: OutgoingEmail };
export type SendEmailResponse = {}; // TODO;
export const sendEmail = createNodeCalloutAsyncThunk<
  SendEmailRequest,
  SendEmailResponse
>('email:sendEmail');

export const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    fileFetched: (state, action: PayloadAction<FileFetchedPayload>) => {
      const email = action.payload;
      // const email = {
      //   ...action.payload.email.content,
      //   _id: action.payload._id,
      //   bodyAsText: action.payload.email.content.text_body,
      //   bodyAsHTML: action.payload.email.content.html_body,
      // };
      // TODO: update state with new email
    },
  },
  extraReducers: builder => {
    builder.addCase(saveMailbox.fulfilled, (state, action) => {
      state.mailbox = action.payload;
    });
    builder.addCase(getNewMailMeta.pending, (state, action) => {
      state.loadingGetMailMeta = true;
    });
    builder.addCase(getNewMailMeta.fulfilled, (state, action) => {
      state.loadingGetMailMeta = false;
      for (const emailMeta of action.payload.meta) {
        state.mailMeta[emailMeta._id] = emailMeta;
      }
    });
    builder.addCase(getNewMailMeta.rejected, (state, action) => {
      state.loadingGetMailMeta = false;
    });

    builder.addCase(saveMailToDB.fulfilled, (state, action) => {
      const emails = action.payload.msgArr;
      const emailIds = [];
      for (const email of emails) {
        state.mail[email.emailId] = email;
        emailIds.push(email.emailId);
      }
      if (action.meta.arg.messageType === 'Draft') {
        const draftsFolderId = getFolderIdByName(state, FolderName.drafts);
        if (draftsFolderId) {
          // todo: ordering?
          state.mailIdsForFolder[draftsFolderId] = [
            ...emailIds,
            ...state.mailIdsForFolder[draftsFolderId],
          ];
        }
      } else if (action.meta.arg.messageType === 'Incoming') {
        for (const message of action.payload.msgArr) {
          const folderId = message.folderId;
          state.mailIdsForFolder[folderId] = [
            message.emailId,
            ...state.mailIdsForFolder[folderId],
          ];
        }
      }
    });
    builder.addCase(getMailboxes.fulfilled, (state, action) => {
      const mailboxes = action.payload;
      state.mailbox = mailboxes[0];
    });
    builder.addCase(getMailboxFolders.fulfilled, (state, action) => {
      const folders = action.payload;
      state.folders = folders;
    });
    builder.addCase(getMailByFolder.fulfilled, (state, action) => {
      const emails = action.payload;
      const folderId = action.meta.arg.id;
      const mailIds = Object.values(emails).map(email => email.emailId);
      for (const email of emails) {
        state.mail[email.emailId] = email;
      }
      state.mailIdsForFolder[folderId] = mailIds;
    });
    builder.addCase(updateMailAsSynced.fulfilled, (state, action) => {
      for (const id of action.payload) {
        delete state.mailMeta[id];
      }
    });
    builder.addCase(sendEmail.pending, (state, action) => {
      state.loadingSendEmail = true;
    });
    builder.addCase(sendEmail.fulfilled, (state, action) => {
      state.loadingSendEmail = false;
    });
    builder.addCase(sendEmail.rejected, (state, action) => {
      state.loadingSendEmail = false;
    });

    builder.addCase(getMessageById.fulfilled, (state, action) => {
      const emailId = action.meta.arg.id;
      state.mail[emailId] = { ...state.mail[emailId], unread: false };
    });
    builder.addCase(getMessageById.rejected, (state, action) => {
      // TODO: set failure message
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      const newState = { ...initialState };
      return newState;
    });
  },
});

export const mailReducer = mailSlice.reducer;
