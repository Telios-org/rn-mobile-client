import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const aliasesSelector = (state: RootState) => state.main.aliases;
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
