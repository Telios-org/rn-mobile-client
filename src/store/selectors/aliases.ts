import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { aliasSelectors } from '../adapters/aliases';

export const aliasesSelector = (state: RootState) =>
  aliasSelectors.selectAll(state.aliases);

export const aliasesForwardAddressesSelector = createSelector(
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

export const filterAliasesByNamespaceSelector = createSelector(
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

export const hasRandomAliasSelector = createSelector(aliasesSelector, aliases =>
  aliases.some(alias => alias.namespaceKey === undefined),
);
