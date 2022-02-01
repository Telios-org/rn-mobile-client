import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import {
  registerOneTimeListener,
  removeListeners,
} from './eventListenerMiddleware';
import { RootState, store } from './store';

export type Account = {
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

export type Mailbox = {
  email: string;
  isRegistered: boolean;
  isSaved: boolean;
  mailboxId?: string;
};

// Define a type for the slice state
interface MainState {
  account?: Account;
  mailbox?: Mailbox;

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
    try {
      const registerAccountResponse = await thunkAPI.dispatch(
        registerNewAccount(data),
      );
      const account =
        registerAccountResponse.payload as RegisterAccountResponse;
      const registerMailboxResponse = await thunkAPI.dispatch(
        registerMailbox({
          accountKey: account.signedAcct.account_key,
          email: data.email,
        }),
      );
      const saveMailboxResponse = await thunkAPI.dispatch(
        saveMailbox({ email: data.email }),
      );
      const getNewMailResponse = await thunkAPI.dispatch(getNewMailMeta());
    } catch (e) {}
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
      throw new Error('error logging in');
    }
    const getNewMailResponse = await thunkAPI.dispatch(getNewMailMeta());
  },
);

type RegisterAccountResponse = Account;
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

type AccountLoginResponse = {};
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

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(registerNewAccount.fulfilled, (state, action) => {
      state.account = action.payload;
    });
    builder.addCase(registerMailbox.fulfilled, (state, action) => {
      state.mailbox = {
        email: action.meta.arg.email,
        isRegistered: true,
        isSaved: false,
      };
    });
    builder.addCase(saveMailbox.fulfilled, (state, action) => {
      state.mailbox = {
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
      // todo handle meta
    });
    builder.addCase(getNewMailMeta.rejected, (state, action) => {
      state.loadingGetMailMeta = false;
    });
  },
});

export const mainReducer = mainSlice.reducer;
