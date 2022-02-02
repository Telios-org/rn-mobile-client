import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AsyncThunk,
} from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import {
  registerOneTimeListener,
  removeListeners,
} from './eventListenerMiddleware';
import { RootState, store } from './store';
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

export type MailMeta = Array<{ account_key: string; msg: string; _id: string }>;

// TODO: reconcile this with getMailbox data type
export type RegisterMailbox = {
  email: string;
  isRegistered: boolean;
  isSaved: boolean;
  mailboxId?: string;
};

export type Email = {
  content: {
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
  registerMailbox?: RegisterMailbox;
  mailMeta?: MailMeta;
  mail: { [id: string]: LocalEmail };
  mailboxes: Array<Mailbox>;

  isAuthenticated: boolean;

  // loadingRegisterAccount?: boolean;
  // errorRegisterAccount?: Error;
  // loadingRegisterMailbox?: boolean;
  // errorRegisterMailbox?: Error;
  // loadingSaveMailbox?: boolean;
  // errorSaveMailbox?: Error;

  loadingGetMailMeta?: boolean;
}

// Define the initial state using that type
const initialState: MainState = {
  isAuthenticated: false,
  mail: {},
  mailboxes: [],
};

export const registerFlow = createAsyncThunk(
  'main/registerFlow',
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
      registerNewAccount(data),
    );
    if (registerAccountResponse.type === registerNewAccount.rejected.type) {
      throw new Error(JSON.stringify(registerAccountResponse.payload));
    }

    const account = registerAccountResponse.payload as RegisterAccountResponse;
    const registerMailboxResponse = await thunkAPI.dispatch(
      registerMailbox({
        accountKey: account.signedAcct.account_key,
        email: data.email,
      }),
    );
    if (registerMailboxResponse.type === registerMailbox.rejected.type) {
      throw new Error(JSON.stringify(registerMailboxResponse.payload));
    }

    const saveMailboxResponse = await thunkAPI.dispatch(
      saveMailbox({ email: data.email }),
    );
    if (saveMailboxResponse.type === saveMailbox.rejected.type) {
      throw new Error(JSON.stringify(saveMailboxResponse.payload));
    }

    // getNewMailMeta is non-blocking
    thunkAPI.dispatch(getNewMailMeta());
  },
);

export const loginFlow = createAsyncThunk(
  'main/loginFlow',
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

    // getNewMailMeta is non-blocking
    thunkAPI.dispatch(getNewMailMeta());

    const getMailboxesResponse = await thunkAPI.dispatch(getMailboxes());
    // if (getMailboxesResponse.type === getMailboxes.rejected.type) {
    //   throw new Error(JSON.stringify(getMailboxesResponse.payload));
    // }
    if (getMailboxesResponse.type === getMailboxes.fulfilled.type) {
      const mailboxes = getMailboxesResponse.payload as GetMailboxesResponse;
      const mailboxId = mailboxes[0]?._id;
      if (mailboxId) {
        thunkAPI.dispatch(getMailboxFolders({ id: mailboxId }));
      }
    }
  },
);

type RegisterAccountResponse = SignupAccount;
export const registerNewAccount = createAsyncThunk(
  'main/registerNewAccount',
  async (data: {
    masterPassword: string;
    email: string;
    recoveryEmail: string;
    code: string;
  }): Promise<RegisterAccountResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'account:create',
        payload: {
          email: data.email,
          password: data.masterPassword,
          vcode: data.code,
          recoveryEmail: data.recoveryEmail,
        },
      });

      registerOneTimeListener('account:create:callback', event => {
        if (event.error) {
          reject(event.error as Error);
        } else {
          resolve(event.data as RegisterAccountResponse);
        }
      });
    });
  },
);

type RegisterMailboxResponse = {};
export const registerMailbox = createAsyncThunk(
  'main/registerMailbox',
  async (data: {
    accountKey: string;
    email: string;
  }): Promise<RegisterMailboxResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'mailbox:register',
        payload: {
          account_key: data.accountKey,
          addr: data.email,
        },
      });

      registerOneTimeListener('mailbox:register:callback', event => {
        if (event.error) {
          reject(event.error as Error);
        } else {
          resolve(event.data as RegisterMailboxResponse);
        }
      });
    });
  },
);

type SaveMailboxResponse = {
  address: string;
  mailboxId: string;
  _id: string;
};
export const saveMailbox = createAsyncThunk(
  'main/saveMailbox',
  async (data: { email: string }): Promise<SaveMailboxResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'mailbox:saveMailbox',
        payload: {
          address: data.email,
        },
      });

      registerOneTimeListener('mailbox:saveMailbox:callback', event => {
        if (event.error) {
          reject(event.error as Error);
        } else {
          resolve(event.data as SaveMailboxResponse);
        }
      });
    });
  },
);

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
export const getNewMailMeta = createAsyncThunk(
  'main/getNewMailMeta',
  async (_, thunkAPI): Promise<GetNewMailMetaResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'mailbox:getNewMailMeta',
      });

      registerOneTimeListener('mailbox:getNewMailMeta:callback', event => {
        if (event.error) {
          reject(event.error as Error);
        } else {
          // todo remove this into separate flow
          if (event.data && event.data.meta && event.data.meta.length > 0) {
            thunkAPI.dispatch(getMessageBatch(event.data));
          }

          resolve(event.data as GetNewMailMetaResponse);
        }
      });
    });
  },
);

type GetMessageBatchResponse = {};
export const getMessageBatch = createAsyncThunk(
  'main/getMessageBatch',
  async (data: GetNewMailMetaResponse): Promise<GetMessageBatchResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'messageHandler:newMessageBatch',
        payload: { meta: data.meta, account: data.account },
      });

      registerOneTimeListener(
        'messageHandler:newMessageBatch:callback',
        event => {
          if (event.error) {
            resolve(event.error as Error);
          } else {
            resolve(event.data as GetMessageBatchResponse);
          }
        },
      );
    });
  },
);

type AccountLoginResponse = LoginAccount;
export const accountLogin = createAsyncThunk(
  'main/accountLogin',
  async (data: {
    email: string;
    password: string;
  }): Promise<AccountLoginResponse> => {
    return new Promise((resolve, reject) => {
      nodejs.channel.send({
        event: 'account:login',
        payload: {
          email: data.email,
          password: data.password,
        },
      });

      registerOneTimeListener('account:login:callback', event => {
        console.log('login callback event', event);
        if (event.error) {
          console.log('rejectig login');
          reject(event.error);
        } else {
          resolve(event.data as AccountLoginResponse);
        }
      });
    });
  },
);

type SaveMailToDBResponse = {
  msgArr: Array<LocalEmail>;
  newAliases: Array<any>;
};
export const saveMailToDB = createAsyncThunk(
  'main/saveMessageToDB',
  async (data: {
    messageType: 'Incoming' | 'Draft';
    messages: Array<Email>;
  }): Promise<SaveMailToDBResponse> => {
    return new Promise((resolve, reject) => {
      // any other transformations needed?
      const payload = {
        type: data.messageType,
        messages: data.messages.map(item => ({
          ...item.content,
          bodyAsText: item.content.text_body,
          bodyAsHTML: item.content.html_body,
        })),
      };
      console.log('sending saveMailToDB', payload);
      nodejs.channel.send({
        event: 'email:saveMessageToDB',
        payload,
      });
      registerOneTimeListener('email:saveMessageToDB:callback', event => {
        console.log('saveMailToDB callback event', event);
        if (event.error) {
          reject(event.error);
        } else {
          resolve(event.data);
        }
      });
    });
  },
);

type UpdateMailAsSyncedResponse = {};
export const updateMailAsSynced = createAsyncThunk(
  'main/updateMailAsSynced',
  async (data: {
    mail: Array<LocalEmail>;
  }): Promise<UpdateMailAsSyncedResponse> => {
    return new Promise((resolve, reject) => {
      const payload = {
        msgArray: [data.mail.map(email => email._id)],
      };
      console.log('sending updateMailAsSynced', payload);
      nodejs.channel.send({
        event: 'mailbox:markArrayAsSynced',
        payload,
      });
      registerOneTimeListener('mailbox:markArrayAsSynced:callback', event => {
        console.log('updateMailAsSynced callback event', event);
        if (event.error) {
          reject(event.error);
        } else {
          resolve(event.data);
        }
      });
    });
  },
);

type GetMailboxesRequest = void;
type GetMailboxesResponse = Array<Mailbox>;
export const getMailboxes = createNodeCalloutAsyncThunk<
  GetMailboxesRequest,
  GetMailboxesResponse
>('mailbox:getMailboxes');

type GetMailboxFoldersRequest = { id: string };
type GetMailboxFoldersResponse = {};
export const getMailboxFolders = createNodeCalloutAsyncThunk<
  GetMailboxFoldersRequest,
  GetMailboxFoldersResponse
>('folder:getMailboxFolders');

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // builder.addCase('messageHandler:fileFetched', (state, action) => {
    //   const email = action.data?.email as Email;
    //   if (email) {
    //     state.mail = [...state.mail, email];
    //   }
    // });
    builder.addCase(registerNewAccount.fulfilled, (state, action) => {
      state.signupAccount = action.payload;
    });
    builder.addCase(registerMailbox.fulfilled, (state, action) => {
      // TODO: reconcile this with getMailbox data type
      state.registerMailbox = {
        email: action.meta.arg.email,
        isRegistered: true,
        isSaved: false,
      };
    });
    builder.addCase(saveMailbox.fulfilled, (state, action) => {
      // TODO: reconcile this with getMailbox data type
      state.registerMailbox = {
        email: action.payload.address,
        isRegistered: true,
        isSaved: true,
        mailboxId: action.payload.mailboxId,
      };
    });
    builder.addCase(getNewMailMeta.pending, (state, action) => {
      state.loadingGetMailMeta = true;
    });
    builder.addCase(getNewMailMeta.fulfilled, (state, action) => {
      state.loadingGetMailMeta = false;
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
      state.mailboxes = mailboxes;
    });
  },
});

export const mainReducer = mainSlice.reducer;
