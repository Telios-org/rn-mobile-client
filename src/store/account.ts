import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAsyncStorageLastUsername,
  getAsyncStorageSavedUsernames,
  storeAsyncStorageLastUsername,
  storeAsyncStorageSavedUsername,
} from '../util/asyncStorage';
import { createNodeCalloutAsyncThunk } from '../util/nodeActions';
import {
  getMailboxes,
  GetMailboxesResponse,
  getMailboxFolders,
  GetMailboxFoldersResponse,
  getMailByFolder,
  getNewMailFlow,
  registerMailbox,
  saveMailbox,
  SaveMailboxResponse,
} from './mail';
import {
  getAliases,
  getNamespacesForMailbox,
  GetNamespacesForMailboxResponse,
} from './aliases';

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

interface AccountState {
  localUsernames: string[];
  lastUsername?: string;

  signupAccount?: SignupAccount;
  loginAccount?: LoginAccount;
}

const initialState: AccountState = {
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
    const mailboxData = saveMailboxResponse.payload as SaveMailboxResponse;
    const mailboxId = mailboxData.mailboxId;

    await storeAsyncStorageSavedUsername(data.email);
    await storeAsyncStorageLastUsername(data.email);

    if (mailboxId) {
      thunkAPI.dispatch(getFoldersNamespacesAliasesFlow({ mailboxId }));
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

    await storeAsyncStorageLastUsername(data.email);

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());

    const getMailboxesResponse = await thunkAPI.dispatch(getMailboxes());
    if (getMailboxesResponse.type === getMailboxes.fulfilled.type) {
      const mailboxes = getMailboxesResponse.payload as GetMailboxesResponse;
      const mailboxId = mailboxes[0]?._id;

      if (mailboxId) {
        thunkAPI.dispatch(getFoldersNamespacesAliasesFlow({ mailboxId }));
      }
    }
  },
);

export const getFoldersNamespacesAliasesFlow = createAsyncThunk(
  'flow/getFoldersNamespacesAliases',
  async (data: { mailboxId: string }, thunkAPI): Promise<void> => {
    const { mailboxId } = data;

    const getFoldersResponse = await thunkAPI.dispatch(
      getMailboxFolders({ id: mailboxId }),
    );
    if (getFoldersResponse.type === getMailboxFolders.fulfilled.type) {
      const folders = getFoldersResponse.payload as GetMailboxFoldersResponse;
      const inbox = folders.find(folder => folder.name === 'Inbox');
      if (!inbox) {
        throw new Error('inbox folder not found');
      }
      thunkAPI.dispatch(getMailByFolder({ id: inbox.folderId }));
    }

    const namespacesResponse = await thunkAPI.dispatch(
      getNamespacesForMailbox({ id: mailboxId }),
    );
    if (namespacesResponse.type === getNamespacesForMailbox.fulfilled.type) {
      const namespaces =
        namespacesResponse.payload as GetNamespacesForMailboxResponse;
      thunkAPI.dispatch(
        getAliases({
          namespaceKeys: namespaces?.map(namespace => namespace.name),
        }),
      );
    }
  },
);

export type RegisterAccountRequest = {
  password: string;
  email: string;
  recoveryEmail: string;
  vcode: string;
};
export type RegisterAccountResponse = SignupAccount;
export const registerNewAccount = createNodeCalloutAsyncThunk<
  RegisterAccountRequest,
  RegisterAccountResponse
>('account:create');

export type AccountLoginRequest = { email: string; password: string };
export type AccountLoginResponse = LoginAccount;
export const accountLogin = createNodeCalloutAsyncThunk<
  AccountLoginRequest,
  AccountLoginResponse
>('account:login');

export type AccountLogoutResponse = {}; // todo
export const accountLogout = createNodeCalloutAsyncThunk<
  void,
  AccountLogoutResponse
>('account:logout');

export const accountSlice = createSlice({
  name: 'account',
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
    builder.addCase(accountLogin.fulfilled, (state, action) => {
      state.loginAccount = action.payload;
    });

    builder.addCase(accountLogout.fulfilled, (state, action) => {
      const newState = { ...initialState };
      newState.localUsernames = state.localUsernames;
      newState.lastUsername = state.lastUsername;
      return newState;
    });
  },
});

export const accountReducer = accountSlice.reducer;
