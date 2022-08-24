import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAsyncStorageLastUsername,
  getAsyncStorageSavedUsernames,
  storeAsyncStorageLastUsername,
  storeAsyncStorageSavedUsername,
} from '../../util/asyncStorage';
import { getFoldersNamespacesAliasesFlow } from './namespaces';
import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { LoginAccount, SignupAccount } from '../account';
import {
  getMailboxes,
  GetMailboxesResponse,
  getNewMailFlow,
  registerMailbox,
  saveMailbox,
  SaveMailboxResponse,
} from './email';

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
    },
    thunkAPI,
  ): Promise<void> => {
    const registerAccountResponse = await thunkAPI.dispatch(
      registerNewAccount({
        password: data.masterPassword,
        email: data.email,
        recoveryEmail: data.recoveryEmail,
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
export const recoveryPassFlow = createAsyncThunk<void, RecoveryPasswordRequest>(
  'flow/recoveryPass',
  async (data, thunkAPI) => {
    try {
      await thunkAPI.dispatch(recoverAccountPass(data)).unwrap();
    } catch (e: any) {
      throw new Error(e.message);
    }
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

    // load mailboxes, then folders immediately after login.
    // these are needed in order to fetch mail.
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
export type RegisterAccountRequest = {
  password: string;
  email: string;
  recoveryEmail: string;
};
export type RegisterAccountResponse = SignupAccount;
export const registerNewAccount = createNodeCalloutAsyncThunk<
  RegisterAccountRequest,
  RegisterAccountResponse
>('account:create');
export type RecoveryPasswordRequest = {
  passphrase: string;
  email: string;
  newPass: string;
};
type RecoveryPasswordResponse = {};
export const recoverAccountPass = createNodeCalloutAsyncThunk<
  RecoveryPasswordRequest,
  RecoveryPasswordResponse
>('account:resetPassword');
export type AccountLoginRequest = { email: string; password: string };
export type AccountLoginResponse = LoginAccount;
export const accountLogin = createNodeCalloutAsyncThunk<
  AccountLoginRequest,
  AccountLoginResponse
>('account:login');
