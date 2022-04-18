import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const aliasesSelector = (state: RootState) => state.aliases.aliases;
export const aliasesComputedSelector = createSelector(
  aliasesSelector,
  aliases => {
    const aliasKeys = Object.keys(aliases).sort();
    return {
      aliases,
      aliasKeys,
    };
  },
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
