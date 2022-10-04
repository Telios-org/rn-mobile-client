import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { searchSelectors } from '../adapters/search';
import { filter, groupBy } from 'lodash';
import { aliasesSelector } from './aliases';
import { foldersSelector } from './folders';

import { Folder } from '../types/index';

const FolderIcons = {
  inbox: 'mail-outline',
  pencil: 'create-outline',
  'send-o': 'send-outline',
  'trash-o': 'trash-outline',
};

const MAX_ITEM_COUNTS_OF_SEARCH_SECTION = 3;

export const searchSelector = (state: RootState) =>
  searchSelectors.selectAll(state.search);

export const searchLoadingSelector = (state: RootState) => state.search.loading;

export const searchedElementsGroupedByFolderSelector = createSelector(
  [searchSelector],
  searchedElements => {
    if (searchedElements.length === 0) {
      return [];
    }
    const elementsByFolder = groupBy(searchedElements, item => item.folderId);

    return elementsByFolder;
  },
);

export const searchedElementsGroupedByAliasIdSelector = createSelector(
  [searchSelector],
  searchedElements => {
    if (searchedElements.length === 0) {
      return [];
    }
    const elementsByAlias = groupBy(searchedElements, item => item.aliasId);

    return elementsByAlias;
  },
);

export const groupedSearchedElementsSelector = createSelector(
  [
    foldersSelector,
    aliasesSelector,
    searchedElementsGroupedByFolderSelector,
    searchedElementsGroupedByAliasIdSelector,
  ],
  (folders, aliases, elementsByFolder, elementsByAlias) => {
    const result: any[] = [];
    Object.keys(elementsByFolder).forEach((folderId: string) => {
      const folder = folders.find(
        (folderItem: Folder) => folderItem.folderId === parseInt(folderId, 10),
      );
      if (!folder) {
        return;
      }
      const folderName = folder.name;
      const folderElements = elementsByFolder[folderId];
      result.push({
        title: folderName,
        id: {
          folderId: folderId,
          aliasId: null,
        },
        data: folderElements.slice(0, MAX_ITEM_COUNTS_OF_SEARCH_SECTION),
        icon: FolderIcons[folder.icon],
        count: folderElements.length,
      });
    });

    Object.keys(elementsByAlias).forEach((aliasId: string) => {
      const alias = aliases.find(
        (aliasItem: any) => aliasItem.aliasId === aliasId,
      );
      if (!alias) {
        return;
      }
      const aliasName = alias.name;
      const aliasElements = elementsByAlias[aliasId];
      result.push({
        title: `#${aliasName}`,
        id: {
          aliasId: aliasId,
          folderId: null,
        },
        data: [],
        count: aliasElements.length,
      });
    });

    return result;
  },
);

export const searchedElementsByGroupId = createSelector(
  [
    searchSelector,
    (_state: RootState, searchId: { folderId?: string; aliasId?: string }) =>
      searchId,
  ],
  (searchedElements, id) => {
    if (searchedElements.length === 0 && !(id.folderId || id.aliasId)) {
      return [];
    }
    const searchIdType = id.folderId ? 'folderId' : 'aliasId';
    const searchId =
      searchIdType === 'folderId'
        ? parseInt(id[searchIdType], 10)
        : id[searchIdType];

    const elements = filter(
      searchedElements,
      item => item[searchIdType] === searchId,
    );

    return elements;
  },
);
