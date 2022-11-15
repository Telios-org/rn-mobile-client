import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { aliasSelectors } from '../adapters/aliases';
import { createDeepEqualSelector } from './utils';
import { namespaceNameSelector } from './namespaces';
import { Alias } from '../types';

export const aliasesSelector = (state: RootState) =>
  aliasSelectors.selectAll(state.aliases);

export const aliasesForwardAddressesSelector = createDeepEqualSelector(
  aliasesSelector,
  aliases => {
    const addresses: { [address: string]: string } = {};
    for (const alias of Object.values(aliases)) {
      if (alias.fwdAddresses) {
        alias.fwdAddresses.forEach(address => {
          addresses[address] = address;
        });
      }
    }
    return Object.keys(addresses).sort();
  },
);

export const aliasIdsSelector = createSelector(aliasesSelector, aliases =>
  aliases.map(alias => alias.aliasId),
);

export const filterAliasesByNamespaceSelector = createDeepEqualSelector(
  [
    aliasesSelector,
    (state: RootState, namespaceKey: string) => {
      if (namespaceKey === 'random') {
        return undefined;
      }
      return namespaceKey;
    },
  ],
  (aliases, namespaceKey) =>
    aliases.filter(alias => alias.namespaceKey === namespaceKey),
);

export const filterAliasesByNamespace = createSelector(
  aliasesSelector,
  namespaceNameSelector,
  (aliases, namespaceNames) => {
    const aliasesByNamespace: { [key: string]: Alias[] } = {};
    namespaceNames.forEach(namespaceName => {
      aliasesByNamespace[namespaceName] = [];
    });
    aliasesByNamespace.random = [];
    aliases.forEach(alias => {
      const ns = alias.namespaceKey || 'random';
      aliasesByNamespace[ns] = [...aliasesByNamespace[ns], alias];
    });
    return aliasesByNamespace;
  },
);

export const hasRandomAliasSelector = createSelector(aliasesSelector, aliases =>
  aliases.some(alias => alias.namespaceKey === undefined),
);
