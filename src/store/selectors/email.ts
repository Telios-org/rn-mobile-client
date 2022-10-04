import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { emailSelectors } from '../adapters/emails';
import { createDeepEqualSelector } from './utils';
import { FoldersId } from '../types/enums/Folders';

const mailSelectorByFolderId = createDeepEqualSelector(
  (state: RootState) => state.mail.byFolderId,
  (state: RootState, folderId: number) => folderId,
  (mailByFolder, folderId) => mailByFolder[folderId],
);
export const selectAllMailsByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  mailState => {
    return emailSelectors.selectAll(mailState.all);
  },
);

export const selectUnreadMailsByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  mailState => emailSelectors.selectAll(mailState.unread),
);

export const selectReadMailsByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  mailState => {
    return emailSelectors.selectAll(mailState.read);
  },
);

export const selectMailByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  (state: RootState, folderId: number, id: string) => id,
  (mailState, id) => {
    return emailSelectors.selectById(mailState.all, id);
  },
);

export const selectMailBoxAddress = (state: RootState) =>
  state.mail.mailbox?.address;

export const selectMailsByAliasId = createSelector(
  (state: RootState) => mailSelectorByFolderId(state, FoldersId.aliases),
  (state: RootState, aliasId: string) => aliasId,
  (mailState, aliasId) =>
    emailSelectors
      .selectAll(mailState.all)
      .filter(mail => mail.aliasId === aliasId),
);

export const selectReadMailsByAliasId = createSelector(
  (state: RootState) => mailSelectorByFolderId(state, FoldersId.aliases),
  (state: RootState, aliasId: string) => aliasId,
  (mailState, aliasId) =>
    emailSelectors
      .selectAll(mailState.read)
      .filter(mail => mail.aliasId === aliasId),
);

export const selectUnreadMailsByAliasId = createSelector(
  (state: RootState) => mailSelectorByFolderId(state, FoldersId.aliases),
  (state: RootState, aliasId: string) => aliasId,
  (mailState, aliasId) =>
    emailSelectors
      .selectAll(mailState.unread)
      .filter(mail => mail.aliasId === aliasId),
);
