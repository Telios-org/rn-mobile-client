import { createSlice } from '@reduxjs/toolkit';
import { createNodeCalloutAsyncThunk } from '../util/nodeActions';
import { accountLogout } from './account';

export type AliasNamespace = {
  disabled: boolean;
  domain: string;
  mailboxId: string;
  name: string;
  privateKey: string;
  publicKey: string;
  _id: string;
};

export type Alias = {
  aliasId: string;
  count: number;
  createdAt: string;
  description: string;
  disabled: boolean;
  fwdAddresses: string[];
  name: string;
  namespaceKey: string;
  updatedAt: string;
  whitelisted: number;
  _id: string;
};

interface AliasesState {
  aliasNamespace?: AliasNamespace;
  aliases: { [id: string]: Alias };
}

const initialState: AliasesState = {
  aliases: {},
};

type GetNamespacesForMailboxRequest = { id: string };
export type GetNamespacesForMailboxResponse = Array<AliasNamespace>;
export const getNamespacesForMailbox = createNodeCalloutAsyncThunk<
  GetNamespacesForMailboxRequest,
  GetNamespacesForMailboxResponse
>('alias:getMailboxNamespaces');

type GetAliasesRequest = { namespaceKeys: string[] };
type GetAliasesResponse = Array<Alias>;
export const getAliases = createNodeCalloutAsyncThunk<
  GetAliasesRequest,
  GetAliasesResponse
>('alias:getMailboxAliases');

type RegisterNamespaceRequest = { mailboxId: string; namespace: string };
type RegisterNamespaceResponse = AliasNamespace;
export const registerNamespace = createNodeCalloutAsyncThunk<
  RegisterNamespaceRequest,
  RegisterNamespaceResponse
>('alias:registerAliasNamespace');

type RegisterAliasRequest = {
  namespaceName: string;
  domain: string;
  address: string;
  description?: string;
  fwdAddresses: string[];
  disabled: boolean;
  count?: number;
  createdAt?: string;
  updatedAt?: string;
};
type RegisterAliasResponse = {
  aliasId: string;
  count: number;
  createdAt: string;
  description: string;
  disabled: boolean;
  fwdAddresses: string[];
  name: string;
  namespaceKey: string;
  updatedAt: string;
  whitelisted: number;
  _id: string;
};
export const registerAlias = createNodeCalloutAsyncThunk<
  RegisterAliasRequest,
  RegisterAliasResponse
>('alias:registerAliasAddress');

type UpdateAliasRequest = {
  namespaceName: string;
  domain: string;
  address: string;
  description?: string;
  fwdAddresses: string[];
  disabled: boolean;
  updatedAt: string;
};

type UpdateAliasResponse = {};
export const updateAlias = createNodeCalloutAsyncThunk<
  UpdateAliasRequest,
  UpdateAliasResponse
>('alias:updateAliasAddress');

export const aliasesSlice = createSlice({
  name: 'aliases',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(registerNamespace.fulfilled, (state, action) => {
      state.aliasNamespace = action.payload;
    });
    builder.addCase(getNamespacesForMailbox.fulfilled, (state, action) => {
      state.aliasNamespace = action.payload[0];
    });
    builder.addCase(getAliases.fulfilled, (state, action) => {
      const aliases = action.payload;
      for (const alias of aliases) {
        state.aliases[alias.aliasId] = alias;
      }
    });
    builder.addCase(registerAlias.fulfilled, (state, action) => {
      state.aliases[action.payload.aliasId] = action.payload;
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      const newState = { ...initialState };
      return newState;
    });
  },
});

export const aliasesReducer = aliasesSlice.reducer;
