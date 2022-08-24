import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import nodejs from 'nodejs-mobile-react-native';
import { registerOneTimeListener } from '../../eventListenerMiddleware';
import { Email, EmailContent, Folder, Mailbox } from '../types';

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
export type SaveDraftRequest = EmailContent;
export const saveDraft = createAsyncThunk<
  SaveMailToDBResponse,
  SaveDraftRequest,
  { state: RootState }
>('flow/saveDraft', async (data, thunkAPI) => {
  const response = await thunkAPI.dispatch(
    saveMailToDB({ type: 'Draft', messages: [data] }),
  );
  if (response.type === saveMailToDB.fulfilled.type) {
    return response.payload as SaveMailToDBResponse;
  } else {
    throw new Error('Unable to save draft');
  }
});

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
  type: 'Incoming' | 'Draft';
  messages: Array<EmailContent>;
};
export type SaveMailToDBResponse = {
  msgArr: Array<Email>;
  newAliases: Array<any>;
};
const SaveMailToDBEventName = 'email:saveMessageToDB';
export const saveMailToDB = createAsyncThunk<
  SaveMailToDBResponse,
  SaveMailToDBRequest,
  { state: RootState }
>(
  `local/${SaveMailToDBEventName}`,
  async (data, thunkAPI): Promise<SaveMailToDBResponse> => {
    return new Promise((resolve, reject) => {
      const firstEmailId = data.messages[0]?._id;
      // const state: RootState = thunkAPI.getState();
      // const inboxMailIds = state?.mail.byFolderId[FoldersId.inbox]?.ids;
      // if (firstEmailId && inboxMailIds.includes(firstEmailId)) {
      //   return;
      // }
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
                (item: Email) => item.emailId,
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
export type GetMailboxFoldersResponse = Array<Folder>;
export const getMailboxFolders = createNodeCalloutAsyncThunk<
  GetMailboxFoldersRequest,
  GetMailboxFoldersResponse
>('folder:getMailboxFolders');
export type GetMailByFolderRequest = { id: string | number };
export type GetMailByFolderResponse = Array<Email>;
export const getMailByFolder = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getMessagesByFolderId');
export type MarkAsUnreadRequest = { id: string | number };
export type MarkAsUnreadResponse = Array<Email>;
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
export type SendEmailRequest = { email: EmailContent };
export type SendEmailResponse = {}; // TODO;
export const sendEmail = createNodeCalloutAsyncThunk<
  SendEmailRequest,
  SendEmailResponse
>('email:sendEmail');