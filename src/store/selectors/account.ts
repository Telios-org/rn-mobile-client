import { RootState } from '../../store';

export const accountSelector = (state: RootState) => state.account;

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
