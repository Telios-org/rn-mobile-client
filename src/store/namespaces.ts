import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getNamespacesForMailbox,
  registerNamespace,
} from './thunks/namespaces';
import { AliasNamespace } from './types';
import { namespaceAdapter } from './adapters/namespaces';
import { accountLogout } from './thunks/accountLogout';

export const namespacesSlice = createSlice({
  name: 'namespaces',
  initialState: namespaceAdapter.getInitialState({
    latestNamespace: undefined,
  } as { latestNamespace: AliasNamespace | undefined }),
  reducers: {
    addAlias: namespaceAdapter.setOne,
    deleteAlias: namespaceAdapter.removeOne,
    updateLatestNamespace: (state, action: PayloadAction<AliasNamespace>) => {
      state.latestNamespace = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(registerNamespace.fulfilled, (state, action) => {
      namespaceAdapter.addOne(state, action.payload);
      state.latestNamespace = action.payload;
    });
    builder.addCase(getNamespacesForMailbox.fulfilled, namespaceAdapter.setAll);
    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return namespaceAdapter.getInitialState({
        latestNamespace: undefined,
      });
    });
  },
});

export const namespacesReducer = namespacesSlice.reducer;
export const { updateLatestNamespace } = namespacesSlice.actions;
