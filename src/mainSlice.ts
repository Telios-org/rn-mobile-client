import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import nodejs from 'nodejs-mobile-react-native';
import {
  registerOneTimeListener,
  removeListeners,
} from './eventListenerMiddleware';
import { RootState, store } from './store';

type RegisterAccountResponse = {
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

// Define a type for the slice state
interface MainState {
  loadingRegisterAccount?: boolean;
  errorRegisterAccount?: Error;
  value: number;
  account?: RegisterAccountResponse;
}

// Define the initial state using that type
const initialState: MainState = {
  value: 0,
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
  ): Promise<{}> => {
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
      return {};
    } catch (e) {}
  },
);

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

      registerOneTimeListener('account:create:success', event => {
        removeListeners('account:create:error');
        const response = event.payload as RegisterAccountResponse;
        resolve(response);
      });
      registerOneTimeListener('account:create:error', event => {
        removeListeners('account:create:success');
        reject(event.error);
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

      registerOneTimeListener('mailbox:register:success', event => {
        removeListeners('mailbox:register:error');
        const response = event.payload;
        resolve(response);
      });
      registerOneTimeListener('mailbox:register:error', event => {
        removeListeners('mailbox:register:success');
        reject(event.error);
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

      registerOneTimeListener('mailbox:saveMailbox:success', event => {
        removeListeners('mailbox:saveMailbox:error');
        const response = event.payload as SaveMailboxResponse;
        resolve(response);
      });
      registerOneTimeListener('mailbox:saveMailbox:error', event => {
        removeListeners('mailbox:saveMailbox:success');
        reject(event.error);
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

      registerOneTimeListener('mailbox:getNewMailMeta:success', event => {
        removeListeners('mailbox:getNewMailMeta:error');
        const response = event.payload as GetNewMailMetaResponse;

        // todo remove this into separate flow
        if (response.meta && response.meta.length > 0) {
          thunkAPI.dispatch(getMessageBatch(response));
        }

        resolve(response);
      });
      registerOneTimeListener('mailbox:getNewMailMeta:error', event => {
        removeListeners('mailbox:getNewMailMeta:success');
        reject(event.error);
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
        'messageHandler:newMessageBatch:success',
        event => {
          removeListeners('messageHandler:newMessageBatch:error');
          const response = event.payload as GetNewMailMetaResponse;
          resolve(response);
        },
      );
      registerOneTimeListener('messageHandler:newMessageBatch:error', event => {
        removeListeners('messageHandler:newMessageBatch:success');
        reject(event.error);
      });
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

      registerOneTimeListener('account:login:success', event => {
        removeListeners('account:login:error');
        const response = event.payload as AccountLoginResponse;
        resolve(response);
      });
      registerOneTimeListener('account:login:error', event => {
        removeListeners('account:login:success');
        reject(event.error);
      });
    });
  },
);

export const mainSlice = createSlice({
  name: 'account',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(registerNewAccount.pending, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
    });
    builder.addCase(registerNewAccount.fulfilled, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
      state.account = action.payload as RegisterAccountResponse;
    });
    builder.addCase(registerNewAccount.rejected, (state, action) => {
      state.loadingRegisterAccount = true;
      state.errorRegisterAccount = undefined;
    });
  },
});

export const { increment, decrement, incrementByAmount } = mainSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.main.value;

export const mainReducer = mainSlice.reducer;
