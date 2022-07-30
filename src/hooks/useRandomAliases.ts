import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  hasRandomAliasSelector,
  namespaceNameSelector,
} from '../store/aliasesSelectors';
import { useAppSelector } from '../hooks';

export default () => {
  const hasRandomAliases = useAppSelector(hasRandomAliasSelector);
  const storedNamespaceName = useSelector(namespaceNameSelector);
  const [namespaceNames, setNamespaceNames] =
    useState<string[]>(storedNamespaceName);

  useEffect(() => {
    const names = [...storedNamespaceName];
    if (hasRandomAliases) {
      names.push('random');
    }
    setNamespaceNames(names);
  }, [hasRandomAliases, storedNamespaceName]);

  return {
    namespaceNames,
    originalNamespaceNames: storedNamespaceName,
    hasRandomAliases,
  };
};
