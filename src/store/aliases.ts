import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createNodeCalloutAsyncThunk } from '../util/nodeActions';
import { accountLogout } from './account';
import { aliasSelectorById } from './aliasesSelectors';
import { AppDispatch, RootState } from '../store';

export type AliasNamespace = {
  disabled?: boolean;
  domain: string;
  mailboxId: string;
  name: string;
  privateKey: string;
  publicKey: string;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};

export type Alias = {
  aliasId: string;
  name: string;
  publicKey?: string;
  privateKey?: string;
  description?: string | undefined;
  namespaceKey: string | undefined;
  fwdAddresses?: string[];
  count: number;
  disabled?: boolean | undefined;
  whitelisted?: boolean | undefined;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};

interface AliasesState {
  latestNamespace: AliasNamespace | undefined;
  aliasNamespaces: AliasNamespace[];
  aliases: Alias[];
}

const initialState: AliasesState = {
  latestNamespace: undefined,
  aliases: [],
  aliasNamespaces: [],
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
  namespaceName?: string;
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
  whitelisted?: boolean | undefined;
  _id: string;
};
export const registerAlias = createNodeCalloutAsyncThunk<
  RegisterAliasRequest,
  RegisterAliasResponse
>('alias:registerAliasAddress');

type UpdateAliasRequest = {
  namespaceName: string | undefined;
  domain: string;
  address: string;
  description?: string;
  fwdAddresses: string[];
  disabled: boolean;
  updatedAt?: string;
};

type UpdateAliasResponse = {};
export const updateAlias = createNodeCalloutAsyncThunk<
  UpdateAliasRequest,
  UpdateAliasResponse
>('alias:updateAliasAddress');

interface UpdateAliasFlowRequest extends Partial<UpdateAliasRequest> {
  aliasId: Alias['aliasId'];
  domain: UpdateAliasRequest['domain'];
}
export const updateAliasFlow = createAsyncThunk<
  void,
  UpdateAliasFlowRequest,
  { state: RootState; dispatch: AppDispatch }
>('flow/updateAlias', async (request, thunkAPI) => {
  const { aliasId, ...requestData } = request;
  const alias = aliasSelectorById(thunkAPI.getState(), aliasId);
  const namespace = request.namespaceName || alias?.namespaceKey;

  if (alias) {
    await thunkAPI.dispatch(
      updateAlias({
        namespaceName: alias.namespaceKey,
        address: alias.name,
        description: alias.description,
        fwdAddresses: alias.fwdAddresses || [],
        disabled: alias.disabled || false,
        ...requestData,
      }),
    );
    await thunkAPI.dispatch(
      getAliases({ namespaceKeys: namespace ? [namespace] : [] }),
    );
  }
});

type RemoveAliasRequest = {
  namespaceName?: string;
  address: string;
  domain: string;
};

type RemoveAliasResponse = {};
export const removeAlias = createNodeCalloutAsyncThunk<
  RemoveAliasRequest,
  RemoveAliasResponse
>('alias:removeAliasAddress');

export const removeAliasFlow = createAsyncThunk<
  void,
  RemoveAliasRequest & { aliasId: string }
>('flow/alias:removeAlias', async (request, { rejectWithValue, dispatch }) => {
  try {
    const { aliasId, ...removeRequest } = request;
    await dispatch(removeAlias(removeRequest));
    dispatch(aliasesSlice.actions.deleteAlias({ aliasId }));
  } catch (e) {
    rejectWithValue(e);
  }
});

export const aliasesSlice = createSlice({
  name: 'aliases',
  initialState,
  reducers: {
    deleteAlias: (state, action: PayloadAction<{ aliasId: string }>) => {
      state.aliases = state.aliases.filter(
        alias => alias.aliasId !== action.payload.aliasId,
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(registerNamespace.fulfilled, (state, action) => {
      state.aliasNamespaces.push(action.payload);
      state.latestNamespace = action.payload;
    });
    builder.addCase(getNamespacesForMailbox.fulfilled, (state, action) => {
      state.aliasNamespaces = action.payload;
    });
    builder.addCase(getAliases.fulfilled, (state, action) => {
      // TODO getAliases has a bug, it returns all aliases doesn't matter what namespaceKey was given.
      //  When that will be fixed, update redux
      state.aliases = action.payload;
    });
    builder.addCase(registerAlias.fulfilled, (state, action) => {
      state.aliases.push(action.payload);
    });

    // clear state on logout
    builder.addCase(accountLogout.fulfilled, () => {
      return { ...initialState };
    });
  },
});

export const aliasesReducer = aliasesSlice.reducer;
