import { createEntityAdapter } from '@reduxjs/toolkit';
import { Alias } from '../types';

export const aliasAdapter = createEntityAdapter<Alias>({
  selectId: alias => alias._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const aliasSelectors = aliasAdapter.getSelectors();
