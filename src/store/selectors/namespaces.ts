import { RootState } from '../../store';
import { namespaceSelectors } from '../adapters/namespaces';
import { createDeepEqualSelector } from './utils';

export const namespaceSelector = (state: RootState) => state.namespaces;

export const namespaceNameSelector = createDeepEqualSelector(
  (state: RootState) => namespaceSelectors.selectAll(state.namespaces),
  namespaces => namespaces.map(namespace => namespace.name),
);
