import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAsyncStorageBiometricUseStatus,
  getAsyncStorageLastUsername,
  getAsyncStorageSavedUsernames,
  storeAsyncStorageBiometricUseStatus,
  storeAsyncStorageLastUsername,
  storeAsyncStorageSavedUsername,
} from '../../util/asyncStorage';
import { getFoldersNamespacesAliasesFlow } from './namespaces';
import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import {
  getMailboxes,
  GetMailboxesResponse,
  getNewMailFlow,
  registerMailbox,
  saveMailbox,
  SaveMailboxResponse,
} from './email';
import { LoginAccount, SignupAccount, Stats } from '../types';
import {
  ACCOUNT_CREATE_SYNC_INFO,
  ACCOUNT_SYNC_GET_INFO,
  INIT_MESSAGE_LISTENER,
  SEND_RECOVERY_CODE,
} from '../types/events';
import nodejs from 'nodejs-mobile-react-native';
import { SignInStatus } from '../types/enums/SignInStatus';
import { StoredAuthenticationValues } from '../../screens/LoginScreen';
import {
  ACCOUNT_AUTHENTICATION_KEY,
  setStoreData,
} from '../../util/secureStore';

export const getStoredUsernames = createAsyncThunk(
  'system/getStoredUsernames',
  async (): Promise<{
    usernames: string[];
    lastUsername?: string;
    biometricUseStatus: { [key: string]: boolean };
  }> => {
    const usernames = await getAsyncStorageSavedUsernames();
    const lastUsername = await getAsyncStorageLastUsername();
    const biometricUseStatus = await getAsyncStorageBiometricUseStatus();
    return { usernames, lastUsername, biometricUseStatus };
  },
);

const initMessageListener = () => {
  nodejs.channel.send({
    event: INIT_MESSAGE_LISTENER,
  });
};

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
    await storeAsyncStorageBiometricUseStatus(data.email, false);

    thunkAPI.dispatch(getStoredUsernames()); // that is needed to update redux latestAccount and localUsernames, needs refactor.
    // Hint: use redux persistent slice

    initMessageListener();

    if (mailboxId) {
      thunkAPI.dispatch(getFoldersNamespacesAliasesFlow({ mailboxId }));
    }

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());

    const authenticationData: StoredAuthenticationValues = {
      [data.email]: {
        email: data.email,
        password: data.masterPassword,
      },
    };
    setStoreData(ACCOUNT_AUTHENTICATION_KEY, authenticationData);
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
    thunkAPI.dispatch(updateSignInStatus(SignInStatus.SIGNED_IN));

    initMessageListener();

    await storeAsyncStorageSavedUsername(data.email);
    await storeAsyncStorageLastUsername(data.email);

    thunkAPI.dispatch(getStoredUsernames()); // that is needed to update redux latestAccount and localUsernames, needs refactor.
    // Hint: use redux persistent slice

    // getNewMailFlow is non-blocking
    thunkAPI.dispatch(getNewMailFlow());

    // accountRetrieveStats is non-blocking
    thunkAPI.dispatch(accountRetrieveStats());

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

export type SendRecoveryCodeRequest = {
  email: string;
  recoveryEmail: string;
};
export const sendRecoveryCode = createNodeCalloutAsyncThunk<
  SendRecoveryCodeRequest,
  void
>(SEND_RECOVERY_CODE);
export type AccountUpdateRequest = {
  accountId: string;
  displayName: string;
  avatar: string;
};
export type AccountUpdateResponse = {};
export const accountUpdate = createNodeCalloutAsyncThunk<
  AccountUpdateRequest,
  AccountUpdateResponse
>('account:update');

export type AccountRetrieveStatsResponse = Stats;
export const accountRetrieveStats = createNodeCalloutAsyncThunk<
  void,
  AccountRetrieveStatsResponse
>('account:retrieveStats');

type GetAccountSyncRequest = {
  code: string;
};
export type GetAccountSyncResponse = {
  drive_key: string;
  email: string;
};
export type CreateAccountSyncInfoResponse = {
  code: string;
  drive_key: string;
  email: string;
};

export const updateSignInStatus = createAction<SignInStatus>(
  'local/account:updateSignInStatus',
);

export const getAccountSyncInfo = createNodeCalloutAsyncThunk<
  GetAccountSyncRequest,
  GetAccountSyncResponse
>(ACCOUNT_SYNC_GET_INFO);
export const createAccountSyncInfo = createNodeCalloutAsyncThunk<
  void,
  CreateAccountSyncInfoResponse
>(ACCOUNT_CREATE_SYNC_INFO);
