import { createEntityAdapter } from '@reduxjs/toolkit';
import { Email } from '../types';

export const searchAdapter = createEntityAdapter<Email>({
  selectId: search => search._id,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});
export const searchSelectors = searchAdapter.getSelectors();
