import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import { Alias, Email } from '../types';
import { aliasSelectors } from '../adapters/aliases';

type GetAliasesRequest = { namespaceKeys: string[] };
type GetAliasesResponse = Array<Alias>;
export const getAliases = createNodeCalloutAsyncThunk<
  GetAliasesRequest,
  GetAliasesResponse
>('alias:getMailboxAliases');
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
  const alias = aliasSelectors.selectById(thunkAPI.getState().aliases, aliasId);
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
  string | undefined,
  RemoveAliasRequest & { aliasId: string }
>('flow/alias:removeAlias', async (request, { rejectWithValue, dispatch }) => {
  try {
    const { aliasId, ...removeRequest } = request;
    await dispatch(removeAlias(removeRequest));
    return aliasId;
  } catch (e) {
    rejectWithValue(e);
  }
});

export type GetMessagesByAliasIdRequest = { id: Alias['aliasId'] };
export type GetMessagesByAliasIdResponse = Array<Email>;
export const getMessagesByAliasId = createNodeCalloutAsyncThunk<
  GetMessagesByAliasIdRequest,
  GetMessagesByAliasIdResponse
>('email:getMessagesByAliasId');
