import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';

/* Keep this thunk in separated file as it's used in most of the reducers to reset state on Logout
 * Cannot use global state reset as we need account reducer after logout */

export type AccountLogoutResponse = {}; // todo
export const accountLogout = createNodeCalloutAsyncThunk<
  void,
  AccountLogoutResponse
>('account:logout');
