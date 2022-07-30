import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const aliasesSelector = (state: RootState) => state.aliases.aliases;
export const aliasesComputedSelector = createSelector(
  aliasesSelector,
  aliases => aliases.slice().sort((a, b) => a.aliasId.localeCompare(b.aliasId)), // copy the array before sorting it, because the array is frozen in strict mode
);

export const aliasSelectorById = createSelector(
  aliasesSelector,
  (state: RootState, id: string) => id,
  (aliases, id) => aliases.find(a => a.aliasId === id),
);

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

export const namespaceSelector = (state: RootState) =>
  state.aliases.aliasNamespaces;

export const namespaceNameSelector = createSelector(
  namespaceSelector,
  namespaces =>
    namespaces
      .map(namespace => namespace.name)
      .sort((a, b) => a.localeCompare(b)),
);

export const filterAliasesByNamespaceSelector = createSelector(
  [
    aliasesComputedSelector,
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

export const hasRandomAliasSelector = createSelector(
  aliasesComputedSelector,
  aliases => aliases.some(alias => alias.namespaceKey === undefined),
);
