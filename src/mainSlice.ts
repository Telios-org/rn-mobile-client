import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import { registerOneTimeListener } from './eventListenerMiddleware';
import {
  getAsyncStorageLastUsername,
  getAsyncStorageSavedUsernames,
  storage,
  storeAsyncStorageLastUsername,
  storeAsyncStorageSavedUsername,
} from './util/asyncStorage';
import { createNodeCalloutAsyncThunk } from './util/nodeActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ToFrom = { address: string; name?: string };

export type SignupAccount = {
  deviceId: string;
  mnemonic: string;
  secretBoxKeypair: {
    publicKey: string;
    privateKey: string;
  };
  sig: string;
  signedAcct: {
    account_key: string;
    device_drive_key: string;
    device_id: string;
    device_signing_key: string;
    recovery_email: string;
  };
  signingKeypair: {
    mnemonic: string;
    privateKey: string;
    publicKey: string;
    seedKey: string;
  };
  uid: string;
};

export type LoginAccount = {
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

export type MailMeta = { account_key: string; msg: string; _id: string };

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

export type AliasNamespace = {
  disabled: boolean;
  domain: string;
  mailboxId: string;
  name: string;
  privateKey: string;
  publicKey: string;
  _id: string;
};

// Define a type for the slice state
interface MainState {
  localUsernames: string[];
  lastUsername?: string;

  signupAccount?: SignupAccount;
  loginAccount?: LoginAccount;
  mailMeta: { [id: string]: MailMeta };
  mail: { [id: string]: LocalEmail };
  mailbox?: Mailbox; // assuming only one for now
  folders?: Array<MailboxFolder>;

  // loadingRegisterAccount?: boolean;
  // errorRegisterAccount?: Error;
  // loadingRegisterMailbox?: boolean;
  // errorRegisterMailbox?: Error;
  // loadingSaveMailbox?: boolean;
  // errorSaveMailbox?: Error;

  loadingGetMailMeta?: boolean;
  loadingSendEmail?: boolean;

  aliasNamespace?: AliasNamespace;
}

const initialState: MainState = {
  mail: {},
  mailMeta: {},
  localUsernames: [],
};

export const getStoredUsernames = createAsyncThunk(
  'system/getStoredUsernames',
  async (): Promise<{ usernames: string[]; lastUsername?: string }> => {
    const usernames = await getAsyncStorageSavedUsernames();
    const lastUsername = await getAsyncStorageLastUsername();
    return { usernames, lastUsername };
  },
);

export const registerFlow = createAsyncThunk(
  'flow/registerAccount',
  async (
    data: {
      masterPassword: string;
      email: string;
      recoveryEmail: string;
      code: string;
    },
    thunkAPI,
  ): Promise<void> => {
    const registerAccountResponse = await thunkAPI.dispatch(
      registerNewAccount({
        password: data.masterPassword,
        email: data.email,
        recoveryEmail: data.recoveryEmail,
        vcode: data.code,
      }),
    );
    if (registerAccountResponse.type === registerNewAccount.rejected.type) {
      throw new Error(JSON.stringify(registerAccountResponse.payload));
    }

    const account = registerAccountResponse.payload as RegisterAccountResponse;
    const registerMailboxResponse = await thunkAPI.dispatch(
      registerMailbox({
        account_key: account.signedAcct.account_key,
        addr: data.email,
      }),
    );
    if (registerMailboxResponse.type === registerMailbox.rejected.type) {
      throw new Error(JSON.stringify(registerMailboxResponse.payload));
    }

    const saveMailboxResponse = await thunkAPI.dispatch(
      saveMailbox({ address: data.email }),
    );
    if (saveMailboxResponse.type === saveMailbox.rejected.type) {
      throw new Error(JSON.stringify(saveMailboxResponse.payload));
    }

    await storeAsyncStorageSavedUsername(data.email);
    await storeAsyncStorageLastUsername(data.email);

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());
  },
);

export const loginFlow = createAsyncThunk(
  'flow/login',
  async (
    data: { email: string; password: string },
    thunkAPI,
  ): Promise<void> => {
    const loginResponse = await thunkAPI.dispatch(
      accountLogin({ email: data.email, password: data.password }),
    );
    if (loginResponse.type === accountLogin.rejected.type) {
      throw new Error(JSON.stringify(loginResponse.payload));
    }

    await storeAsyncStorageLastUsername(data.email);

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());

    // get mailboxes and folders and namespaces
    // TODO: move this out
    const getMailboxesResponse = await thunkAPI.dispatch(getMailboxes());
    if (getMailboxesResponse.type === getMailboxes.fulfilled.type) {
      const mailboxes = getMailboxesResponse.payload as GetMailboxesResponse;
      const mailboxId = mailboxes[0]?._id;
      if (mailboxId) {
        thunkAPI.dispatch(getNamespacesForMailbox({ id: mailboxId }));

        const getFoldersResponse = await thunkAPI.dispatch(
          getMailboxFolders({ id: mailboxId }),
        );
        if (getFoldersResponse.type === getMailboxFolders.fulfilled.type) {
          const folders =
            getFoldersResponse.payload as GetMailboxFoldersResponse;
          const inbox = folders.find(folder => folder.name === 'Inbox');
          if (!inbox) {
            throw new Error('inbox folder not found');
          }
          thunkAPI.dispatch(getMailByFolder({ id: inbox.folderId }));
        }
      }
    }
  },
);

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

type RegisterAccountRequest = {
  password: string;
  email: string;
  recoveryEmail: string;
  vcode: string;
};
type RegisterAccountResponse = SignupAccount;
export const registerNewAccount = createNodeCalloutAsyncThunk<
  RegisterAccountRequest,
  RegisterAccountResponse
>('account:create');

type RegisterMailboxRequest = {
  account_key: string;
  addr: string;
};
type RegisterMailboxResponse = void;
export const registerMailbox = createNodeCalloutAsyncThunk<
  RegisterMailboxRequest,
  RegisterMailboxResponse
>('mailbox:register');

type SaveMailboxRequest = {
  address: string;
};
type SaveMailboxResponse = {
  address: string;
  mailboxId: string;
  _id: string;
};
export const saveMailbox = createNodeCalloutAsyncThunk<
  SaveMailboxRequest,
  SaveMailboxResponse
>('mailbox:saveMailbox');

type GetNewMailMetaRequest = void;
type GetNewMailMetaResponse = {
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

type GetMessageBatchRequest = GetNewMailMetaResponse;
type GetMessageBatchResponse = {};
export const getMessageBatch = createNodeCalloutAsyncThunk<
  GetMessageBatchRequest,
  GetMessageBatchResponse
>('messageHandler:newMessageBatch');

type AccountLoginRequest = { email: string; password: string };
type AccountLoginResponse = LoginAccount;
export const accountLogin = createNodeCalloutAsyncThunk<
  AccountLoginRequest,
  AccountLoginResponse
>('account:login');

type AccountLogoutResponse = {}; // todo
export const accountLogout = createNodeCalloutAsyncThunk<
  void,
  AccountLogoutResponse
>('account:logout');

// TODO: prevent duplicate emails from being added to DB
// no logic to prevent that today, and it could happen
// if there is any interruption between inserting into DB and 'mark as synced' call succeeding
type SaveMailToDBRequest = {
  messageType: 'Incoming' | 'Draft';
  messages: Array<EmailContent & { bodyAsText: string; bodyAsHTML: string }>;
};
type SaveMailToDBResponse = {
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
      nodejs.channel.send({
        event: SaveMailToDBEventName,
        payload: data,
      });

      // use a custom predicate for our listener
      // to match up specific request / responses
      registerOneTimeListener(
        {
          eventName: `node/${SaveMailToDBEventName}:callback`,
          customPredicate: action => {
            return action.data.msgArr?.[0]?.id === firstEmailId;
          },
        },
        event => {
          if (event.error) {
            reject(event.error);
          } else {
            // TODO: break this part out into a separate flow
            // TODO: batch these up, rather than call for every single item inserted to DB.
            const emailIds: string[] = event.data.msgArr.map(item => item.id);
            thunkAPI.dispatch(updateMailAsSynced({ msgArray: emailIds }));
            resolve(event.data);
          }
        },
      );
    });
  },
);

type UpdateMailAsSyncedRequest = { msgArray: string[] };
type UpdateMailAsSyncedResponse = string[];
export const updateMailAsSynced = createNodeCalloutAsyncThunk<
  UpdateMailAsSyncedRequest,
  UpdateMailAsSyncedResponse
>('mailbox:markArrayAsSynced');

type GetMailboxesRequest = void;
type GetMailboxesResponse = Array<Mailbox>;
export const getMailboxes = createNodeCalloutAsyncThunk<
  GetMailboxesRequest,
  GetMailboxesResponse
>('mailbox:getMailboxes');

type GetMailboxFoldersRequest = { id: string };
type GetMailboxFoldersResponse = Array<MailboxFolder>;
export const getMailboxFolders = createNodeCalloutAsyncThunk<
  GetMailboxFoldersRequest,
  GetMailboxFoldersResponse
>('folder:getMailboxFolders');

type GetMailByFolderRequest = { id: string | number };
type GetMailByFolderResponse = Array<LocalEmail>;
export const getMailByFolder = createNodeCalloutAsyncThunk<
  GetMailByFolderRequest,
  GetMailByFolderResponse
>('email:getMessagesByFolderId');

type SendEmailRequest = { email: OutgoingEmail };
type SendEmailResponse = {}; // TODO;
export const sendEmail = createNodeCalloutAsyncThunk<
  SendEmailRequest,
  SendEmailResponse
>('email:sendEmail');

type GetNamespacesForMailboxRequest = { id: string };
type GetNamespacesForMailboxResponse = Array<AliasNamespace>;
export const getNamespacesForMailbox = createNodeCalloutAsyncThunk<
  GetNamespacesForMailboxRequest,
  GetNamespacesForMailboxResponse
>('alias:getMailboxNamespaces');

type GetAliasesRequest = { namespaceKeys: string[] };
type GetAliasesResponse = {}; // TODO;
export const getAliases = createNodeCalloutAsyncThunk<
  GetAliasesRequest,
  GetAliasesResponse
>('alias:getMailboxAliases');

type RegisterNamespaceRequest = { mailboxId: string; namespace: string };
type RegisterNamespaceResponse = AliasNamespace;
export const registerNamespace = createNodeCalloutAsyncThunk<
  RegisterNamespaceRequest,
  RegisterNamespaceResponse
>('alias:registerAliasNamespace');

type UpdateAliasRequest = {
  namespaceName: string;
  domain: string;
  address: string;
  description?: string;
  fwdAddresses: string[];
  disabled: boolean;
  updatedAt: string;
};

type UpdateAliasResponse = {};
export const updateAlias = createNodeCalloutAsyncThunk<
  UpdateAliasRequest,
  UpdateAliasResponse
>('alias:updateAliasAddress');

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getStoredUsernames.fulfilled, (state, action) => {
      state.localUsernames = action.payload.usernames;
      state.lastUsername = action.payload.lastUsername;
    });
    builder.addCase(registerNewAccount.fulfilled, (state, action) => {
      state.signupAccount = action.payload;
    });
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
    builder.addCase(accountLogin.fulfilled, (state, action) => {
      state.loginAccount = action.payload;
    });
    builder.addCase(saveMailToDB.fulfilled, (state, action) => {
      const emails = action.payload.msgArr;
      for (const email of emails) {
        state.mail[email.id] = email;
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
      for (const email of emails) {
        state.mail[email.emailId] = email;
      }
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
    builder.addCase(registerNamespace.fulfilled, (state, action) => {
      state.aliasNamespace = action.payload;
    });
    builder.addCase(getNamespacesForMailbox.fulfilled, (state, action) => {
      state.aliasNamespace = action.payload[0];
    });

    builder.addCase(accountLogout.fulfilled, (state, action) => {
      const newState = { ...initialState };
      newState.localUsernames = state.localUsernames;
      newState.lastUsername = state.lastUsername;
      return newState;
    });
  },
});

export const mainReducer = mainSlice.reducer;
