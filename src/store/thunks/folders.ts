import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import { FoldersId } from '../types/enums/Folders';
import { updateAliasCountFlow } from './aliases';
import { Email } from '../types';

type UpdateFolderRequest = {
  id: string;
  amount: number;
};

type UpdateFolderResponse = void;

export const updateFolderCount = createNodeCalloutAsyncThunk<
  UpdateFolderRequest,
  UpdateFolderResponse
>('folder:updateFolderCount');

export const updateFolderCountFlow = createAsyncThunk<
  UpdateFolderRequest,
  UpdateFolderRequest,
  { state: RootState; dispatch: AppDispatch }
>('flow/updateFolderCount', async (arg, thunkApi) => {
  await thunkApi.dispatch(updateFolderCount(arg));
  return arg;
});

export const decrementFolderCounter = createAsyncThunk<
  void,
  { email: Email },
  { state: RootState; dispatch: AppDispatch }
>('flow/decrementFolderCounter', async (arg, thunkAPI) => {
  await thunkAPI.dispatch(
    updateFolderCountFlow({
      id: arg.email.folderId.toString(),
      amount: -1,
    }),
  );
  if (arg.email.folderId === FoldersId.aliases && arg.email.aliasId) {
    thunkAPI.dispatch(
      updateAliasCountFlow({ id: arg.email.aliasId, amount: -1 }),
    );
  }
});

export const incrementFolderCounter = createAsyncThunk<
  void,
  { email: Email },
  { state: RootState; dispatch: AppDispatch }
>('flow/incrementFolderCounter', async (arg, thunkAPI) => {
  await thunkAPI.dispatch(
    updateFolderCountFlow({ id: arg.email.folderId.toString(), amount: 1 }),
  );
  if (arg.email.folderId === FoldersId.aliases && arg.email.aliasId) {
    thunkAPI.dispatch(
      await updateAliasCountFlow({ id: arg.email.aliasId, amount: 1 }),
    );
  }
});
