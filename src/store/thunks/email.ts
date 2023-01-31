import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import { AppDispatch, RootState } from '../../store';
import {
  Alias,
  Attachment,
  Email,
  EmailContent,
  Folder,
  Mailbox,
} from '../types';
import { incrementFolderCounter } from './folders';
import { FoldersId } from '../types/enums/Folders';
import { SAVE_MESSAGE_TO_DB } from '../types/events';

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
  void,
  SaveDraftRequest,
  { state: RootState; dispatch: AppDispatch }
>('flow/saveDraft', data => {
  try {
    nodejs.channel.send({
      event: SAVE_MESSAGE_TO_DB,
      payload: { type: 'Draft', messages: [data] },
    });
  } catch (e) {
    throw new Error('Unable to save draft');
  }
});

export interface MailToMove extends Email {
  folder: {
    toId: number;
  };
}

export type MoveMailToTrashRequest = {
  messages: MailToMove[];
};
export type MoveMailToTrashResponse = {
  //todo
};
export const moveMessages = createNodeCalloutAsyncThunk<
  MoveMailToTrashRequest,
  MoveMailToTrashResponse
>('email:moveMessages');
export type DeleteMailRequest = {
  messageIds: string[];
};

export type MoveMailToFolderRequest = {
  messages: Email[];
};

export type MoveMailToFolderResponse = {
  messageIds: Email['emailId'][];
  messages: Email[];
  fromFolderId: number;
};

export const moveMailToTrash = createAsyncThunk<
  MoveMailToFolderResponse | undefined,
  MoveMailToFolderRequest
>('flow/moveMailToTrash', async (arg, thunkAPI) => {
  const messageIds: Email['emailId'][] = [];
  if (arg.messages.length > 0) {
    const fromFolderId = arg.messages[0]?.folderId; // assume all messages are from same folder
    const messages = arg.messages.map(msg => {
      messageIds.push(msg.emailId);
      return {
        ...msg,
        folder: {
          toId: FoldersId.trash,
        },
      };
    });
    await thunkAPI.dispatch(moveMessages({ messages }));
    return {
      messageIds,
      messages,
      fromFolderId,
    };
  }
});

export type DeleteMailResponse = {};
export const removeMessages = createNodeCalloutAsyncThunk<
  DeleteMailRequest,
  DeleteMailResponse
>('email:removeMessages');

export const deleteMailFromTrash = createAsyncThunk<
  DeleteMailRequest,
  DeleteMailRequest
>('flow/deleteMail', (arg, thunkAPI) => {
  thunkAPI.dispatch(removeMessages(arg));
  return arg;
});

export const deleteMailFromFolder = createAsyncThunk<
  DeleteMailRequest & { folderId: number },
  DeleteMailRequest & { folderId: number }
>('flow/deleteMail', (arg, thunkAPI) => {
  const { folderId, ...restArg } = arg;
  thunkAPI.dispatch(removeMessages(restArg));
  return arg;
});

// TODO: prevent duplicate emails from being added to DB
// no logic to prevent that today, and it could happen
// if there is any interruption between inserting into DB and 'mark as synced' call succeeding
export type SaveMailToDBRequest = {
  type: 'Incoming' | 'Draft';
  data: { msgArr: Array<Email>; newAliases?: Array<any> };
};
export type SaveMailToDBResponse = {
  msgArr: Array<Email>;
  newAliases?: Array<any>;
};

export const saveMailToDB = createAsyncThunk<
  SaveMailToDBResponse,
  SaveMailToDBRequest,
  { state: RootState; dispatch: AppDispatch; rejectValue: any }
>(`local/${SAVE_MESSAGE_TO_DB}`, async (arg, thunkAPI) => {
  try {
    if (arg.type === 'Incoming') {
      const emailIds: string[] = arg.data.msgArr.map(item => item._id);
      await thunkAPI.dispatch(updateMailAsSynced({ msgArray: emailIds }));
    }
    if (arg.type === 'Draft' || arg.type === 'Incoming') {
      arg.data.msgArr.forEach((email: Email) => {
        thunkAPI.dispatch(incrementFolderCounter({ email }));
      });
    }
    return { msgArr: arg.data.msgArr, newAliases: arg.data.newAliases };
  } catch (e) {
    return thunkAPI.rejectWithValue(e);
  }
});
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
export type GetMailByFolderRequest = {
  id: string | number;
  offset: number;
  limit: number;
  unread?: boolean;
};
export type GetMailByFolderResponse = Array<Email>;
export const getMailByFolder = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getMessagesByFolderId');

export const getReadMessagesByFolderId = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getReadMessagesByFolderId');

export const getUnreadMessagesByFolderId = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getUnreadMessagesByFolderId');

// this is needed to write in redux in "all" slice
export const getAllMailByFolder = createAsyncThunk<
  GetMailByFolderResponse,
  GetMailByFolderRequest
>('flow/getAllMailByFolder', async (arg, thunkAPI) => {
  return await thunkAPI.dispatch(getMailByFolder({ ...arg })).unwrap();
});

// this is needed to write in redux in read slice
export const getMailByFolderRead = createAsyncThunk<
  GetMailByFolderResponse,
  GetMailByFolderRequest
>('flow/getMailsByFolderRead', async (arg, thunkAPI) => {
  return await thunkAPI
    .dispatch(getReadMessagesByFolderId({ ...arg }))
    .unwrap();
});

// this is needed to write in redux in unread slice
export const getMailByFolderUnread = createAsyncThunk<
  GetMailByFolderResponse,
  GetMailByFolderRequest
>('flow/getMailsByFolderUnread', async (arg, thunkAPI) => {
  return await thunkAPI
    .dispatch(getUnreadMessagesByFolderId({ ...arg }))
    .unwrap();
});
export type MarkAsUnreadRequest = { id: string | number };
export type MarkAsUnreadResponse = Array<Email>;
export const markAsUnread = createNodeCalloutAsyncThunk<
  MarkAsUnreadRequest,
  MarkAsUnreadResponse
>('email:markAsUnread');

export const markAsUnreadFlow = createAsyncThunk<
  { email: Email; amount: number },
  { email: Email },
  { state: RootState; dispatch: AppDispatch }
>('flow/markAsUnread', async (arg, thunkAPI) => {
  await thunkAPI.dispatch(markAsUnread({ id: arg.email.emailId }));
  await thunkAPI.dispatch(incrementFolderCounter({ email: arg.email }));
  return { ...arg, amount: 1 };
});

export type GetMessageByIdRequest = { id: string | number };
export type GetMessageByIdResponse = any; //Array<LocalEmail>;
export const getMessageById = createNodeCalloutAsyncThunk<
  GetMessageByIdRequest,
  GetMessageByIdResponse
>('email:getMessageById');

export type SendEmailRequest = { email: EmailContent };
export type SendEmailResponse = Email;
export const sendEmail = createNodeCalloutAsyncThunk<
  SendEmailRequest,
  SendEmailResponse
>('email:sendEmail');

export type GetMessagesByAliasIdRequest = {
  id: Alias['aliasId'];
  offset: number;
  limit: number;
  unread?: boolean;
};

export type GetMessagesByAliasIdResponse = Array<Email>;
export const getMessagesByAliasId = createNodeCalloutAsyncThunk<
  GetMessagesByAliasIdRequest,
  GetMessagesByAliasIdResponse
>('email:getMessagesByAliasId');

export const getReadMessagesByAliasId = createNodeCalloutAsyncThunk<
  GetMessagesByAliasIdRequest,
  GetMessagesByAliasIdResponse
>('email:getReadMessagesByAliasId');

export const getUnreadMessagesByAliasId = createNodeCalloutAsyncThunk<
  GetMessagesByAliasIdRequest,
  GetMessagesByAliasIdResponse
>('email:getUnreadMessagesByAliasId');

type SaveFileRequest = {
  filepath: string;
  attachments: Attachment[];
  recursive?: boolean;
};

export const saveFile = createNodeCalloutAsyncThunk<
  SaveFileRequest,
  SaveFileRequest
>('email:saveFiles');
