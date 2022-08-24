import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);
