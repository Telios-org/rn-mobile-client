import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import { registerOneTimeListener } from './eventListenerMiddleware';
import { createNodeCalloutAsyncThunk } from './util/nodeActions';

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
  from: Array<{ address: string; name: string }>;
  headers: Array<any>;
  html_body: string;
  sender: Array<any>;
  subject: string;
  text_body: string;
  to: Array<{ address: string; name: string }>;
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

// Define a type for the slice state
interface MainState {
  signupAccount?: SignupAccount;
  loginAccount?: LoginAccount;
  mailMeta?: Array<MailMeta>;
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
}

const initialState: MainState = {
  mail: {},
  mailMeta: [],
};

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

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());

    // get mailboxes and folders
    // TODO: move this out
    const getMailboxesResponse = await thunkAPI.dispatch(getMailboxes());
    if (getMailboxesResponse.type === getMailboxes.fulfilled.type) {
      const mailboxes = getMailboxesResponse.payload as GetMailboxesResponse;
      const mailboxId = mailboxes[0]?._id;
      if (mailboxId) {
        thunkAPI.dispatch(getMailboxFolders({ id: mailboxId }));
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

    await thunkAPI.dispatch(getMessageBatch(mailMeta));
    // after calling getMessageBatch we async wait for file:fetched event

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
  async (data: SaveMailToDBRequest): Promise<SaveMailToDBResponse> => {
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
            resolve(event.data);
          }
        },
      );
    });
  },
);

type UpdateMailAsSyncedRequest = { msgArray: string[] };
type UpdateMailAsSyncedResponse = {}; // TODO
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

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: builder => {
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
      console.log('in get new mail meta reducer', action);
      console.log('setting mailMeta to', action.payload.meta);
      state.mailMeta = action.payload.meta;
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
  },
});

export const mainReducer = mainSlice.reducer;
