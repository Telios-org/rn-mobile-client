import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  accountLogin,
  accountRetrieveStats,
  accountUpdate,
  getStoredUsernames,
  registerNewAccount,
  updateSignInStatus,
} from './thunks/account';
import { accountLogout } from './thunks/accountLogout';
import { LoginAccount, SignupAccount, Stats } from './types';
import { SignInStatus } from './types/enums/SignInStatus';

interface AccountState {
  localUsernames: string[];
  biometricUseStatus: { [key: string]: boolean };
  lastUsername?: string;
  signInStatus: SignInStatus;
  signupAccount?: SignupAccount;
  loginAccount?: LoginAccount;
  isProfileUpdating?: boolean;
  stats?: Stats;
}

const initialState: AccountState = {
  signInStatus: SignInStatus.INITIAL,
  localUsernames: [],
  biometricUseStatus: {},
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateBiometricUseStatus: (
      state,
      action: PayloadAction<{ [key: string]: boolean }>,
    ) => {
      state.biometricUseStatus = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(updateSignInStatus, (state, action) => {
      state.signInStatus = action.payload;
    });
    builder.addCase(getStoredUsernames.fulfilled, (state, action) => {
      state.localUsernames = action.payload.usernames;
      state.lastUsername = action.payload.lastUsername;
      state.biometricUseStatus = action.payload.biometricUseStatus;
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
      newState.biometricUseStatus = state.biometricUseStatus;
      newState.signInStatus = SignInStatus.SIGNED_OUT;
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
export const { updateBiometricUseStatus } = accountSlice.actions;
