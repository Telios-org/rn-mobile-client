import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';

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
