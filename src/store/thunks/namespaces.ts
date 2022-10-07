import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAliases } from './aliases';
import { AliasNamespace } from '../types';
import { getMailboxFolders, GetMailboxFoldersResponse } from './email';

type GetNamespacesForMailboxRequest = { id: string };
export type GetNamespacesForMailboxResponse = Array<AliasNamespace>;

export const getNamespacesForMailbox = createNodeCalloutAsyncThunk<
  GetNamespacesForMailboxRequest,
  GetNamespacesForMailboxResponse
>('alias:getMailboxNamespaces');
type RegisterNamespaceRequest = { mailboxId: string; namespace: string };
type RegisterNamespaceResponse = AliasNamespace;

export const registerNamespace = createNodeCalloutAsyncThunk<
  RegisterNamespaceRequest,
  RegisterNamespaceResponse
>('alias:registerAliasNamespace');

export const getFoldersNamespacesAliasesFlow = createAsyncThunk(
  'flow/getFoldersNamespacesAliases',
  async (data: { mailboxId: string }, thunkAPI): Promise<void> => {
    const { mailboxId } = data;

    const getFoldersResponse = await thunkAPI.dispatch(
      getMailboxFolders({ id: mailboxId }),
    );
    if (getFoldersResponse.type === getMailboxFolders.fulfilled.type) {
      const folders = getFoldersResponse.payload as GetMailboxFoldersResponse;
      const inbox = folders.find(folder => folder.name === 'Inbox');
      if (!inbox) {
        throw new Error('inbox folder not found');
      }
      // thunkAPI.dispatch(getMailByFolder({ id: inbox.folderId }));
    }

    await thunkAPI.dispatch(getNamespacesForMailbox({ id: mailboxId }));
    await thunkAPI.dispatch(getAliases({ namespaceKeys: null }));
  },
);
