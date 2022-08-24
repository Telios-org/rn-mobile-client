import { createSelector } from '@reduxjs/toolkit';
import { FilterOption } from '../../components/MailList';
import { RootState } from '../../store';
import { emailSelectors } from '../adapters/emails';
import { createDeepEqualSelector } from './utils';

const mailSelectorByFolderId = createDeepEqualSelector(
  (state: RootState) => state.mail.byFolderId,
  (state: RootState, folderId: number) => folderId,
  (mailByFolder, folderId) => mailByFolder[folderId],
);
export const selectMailsByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  mailState => {
    return emailSelectors.selectAll(mailState);
  },
);

export const selectMailByFolder = createSelector(
  (state: RootState, folderId: number) =>
    mailSelectorByFolderId(state, folderId),
  (state: RootState, folderId: number, id: string) => id,
  (mailState, id) => {
    return emailSelectors.selectById(mailState, id);
  },
);

export const selectMailsLoading = (state: RootState) =>
  state.mail.emailsLoading;

export const selectMailBoxAddress = (state: RootState) =>
  state.mail.mailbox?.address;

// TODO fix this, it recalculates every time new filter is selected. Hint: structuredSelector may help.
export const filteredInboxMailListSelector = createSelector(
  [
    (state: RootState, folderId: number) =>
      selectMailsByFolder(state, folderId),
    (_state: RootState, folderId: number, filterItem: FilterOption) =>
      filterItem,
  ],
  (inboxMails, readCondition) => {
    let filteredInboxMailList;

    switch (readCondition) {
      case FilterOption.Unread:
        filteredInboxMailList = [...inboxMails.filter(item => item.unread)];
        break;

      case FilterOption.Read:
        filteredInboxMailList = [...inboxMails.filter(item => !item.unread)];
        break;

      case FilterOption.All:
      default:
        filteredInboxMailList = [...inboxMails];
        break;
    }
    return filteredInboxMailList;
  },
);