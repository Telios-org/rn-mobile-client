import { createEntityAdapter } from '@reduxjs/toolkit';
import { AliasNamespace } from '../types';

export const namespaceAdapter = createEntityAdapter<AliasNamespace>({
  selectId: namespace => namespace._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const namespaceSelectors = namespaceAdapter.getSelectors();
