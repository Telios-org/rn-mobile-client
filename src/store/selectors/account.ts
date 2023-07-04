import { RootState } from '../../store';
import { SignInStatus } from '../types/enums/SignInStatus';

export const accountSelector = (state: RootState) => state.account;

export const selectIsSignedIn = (state: RootState) =>
  state.account.signInStatus === SignInStatus.SIGNED_IN ||
  state.account.signInStatus === SignInStatus.FIRST_SIGNED_IN;

export const selectIsFirstSignIn = (state: RootState) =>
  state.account.signInStatus === SignInStatus.FIRST_SIGNED_IN;

export const selectSignInStatus = (state: RootState) =>
  state.account.signInStatus;

export const loginAccountSelector = (state: RootState) =>
  state.account.loginAccount;

export const selectAccountStats = (state: RootState) => state.account?.stats;

export const selectUserPlan = (state: RootState) => state.account?.stats?.plan;

export const selectAccountDisplayName = (state: RootState) =>
  state.account?.loginAccount?.displayName;

export const selectAccountAvatar = (state: RootState) =>
  state.account?.loginAccount?.avatar;

export const selectAccountId = (state: RootState) =>
  state.account?.loginAccount?.accountId;

export const selectLastLoggedUsername = (state: RootState) =>
  state.account?.lastUsername;

export const selectBiometricUseStatus = (state: RootState) =>
  state.account?.biometricUseStatus;
