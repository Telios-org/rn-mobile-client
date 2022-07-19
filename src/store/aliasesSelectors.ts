import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const aliasesSelector = (state: RootState) => state.aliases.aliases;
export const aliasesComputedSelector = createSelector(
  aliasesSelector,
  aliases => aliases.slice().sort((a, b) => a.aliasId.localeCompare(b.aliasId)), // copy the array before sorting it, because the array is frozen in strict mode
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
  state.aliases.aliasNamespace;

export const namespaceComputedSelector = createSelector(
  namespaceSelector,
  aliasNamespace =>
    aliasNamespace.slice().sort((a, b) => a.name.localeCompare(b.name)),
);

export const filterAliasesByNamespaceSelector = createSelector(
  [
    aliasesComputedSelector,
    (state: RootState, namespaceKey: string) => namespaceKey,
  ],
  (aliases, namespaceKey) =>
    aliases.filter(alias => alias.namespaceKey === namespaceKey),
);
