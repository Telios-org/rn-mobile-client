import { createSlice } from '@reduxjs/toolkit';
import {
  accountLogin,
  accountRetrieveStats,
  accountUpdate,
  getStoredUsernames,
  registerNewAccount,
  updateIsSignedIn,
} from './thunks/account';
import { accountLogout } from './thunks/accountLogout';
import { LoginAccount, SignupAccount, Stats } from './types';

interface AccountState {
  localUsernames: string[];
  lastUsername?: string;
  isSignedIn: boolean;
  signupAccount?: SignupAccount;
  loginAccount?: LoginAccount;
  isProfileUpdating?: boolean;
  stats?: Stats;
}

const initialState: AccountState = {
  localUsernames: [],
  isSignedIn: false,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(updateIsSignedIn, (state, action) => {
      state.isSignedIn = action.payload;
    });
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
