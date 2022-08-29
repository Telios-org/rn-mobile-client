import { createNodeCalloutAsyncThunk } from '../../util/nodeActions';
import { Email } from '../types';

export type SearchMailboxRequest = { searchQuery: string };
export type SearchMailboxResponse = Array<Email>;
export const searchMailbox = createNodeCalloutAsyncThunk<
  SearchMailboxRequest,
  SearchMailboxResponse
>('email:searchMailbox');
