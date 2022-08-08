import { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import { namespaceSelectors } from '../adapters/namespaces';

export const namespaceSelector = (state: RootState) => state.namespaces;

export const namespaceNameSelector = createSelector(
  (state: RootState) => namespaceSelectors.selectAll(state.namespaces),
  namespaces => namespaces.map(namespace => namespace.name),
);
