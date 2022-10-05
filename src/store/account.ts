import { createSlice } from '@reduxjs/toolkit';
import {
  accountLogin,
  accountRetrieveStats,
  accountUpdate,
  getStoredUsernames,
  registerNewAccount,
} from './thunks/account';
import { accountLogout } from './thunks/accountLogout';
import { Stats } from './types';

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
  avatar?: any;
  createdAt: string;
  deviceId: string;
  deviceSigningPrivKey: string;
  deviceSigningPubKey: string;
  displayName?: string;
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
  isProfileUpdating?: boolean;
  stats: Stats;
}

const initialState: AccountState = {
  localUsernames: [],
};

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

    builder.addCase(accountUpdate.pending, state => {
      state.isProfileUpdating = true;
    });
    builder.addCase(accountUpdate.fulfilled, (state, action) => {
      state.loginAccount = {
        ...state.loginAccount,
        avatar: action?.meta?.arg?.avatar,
        displayName: action?.meta?.arg?.displayName,
      };
      state.isProfileUpdating = false;
    });
    builder.addCase(accountUpdate.rejected, (state, action) => {
      state.isProfileUpdating = false;
    });
    builder.addCase(accountRetrieveStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const accountReducer = accountSlice.reducer;
