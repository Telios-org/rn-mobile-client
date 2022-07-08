import { createSelector } from '@reduxjs/toolkit';
import { FilterOption } from '../components/MailList';
import { RootState } from '../store';
import { MailState } from '../store/mail';

export enum FolderName {
  inbox = 'inbox',
  drafts = 'drafts',
  sent = 'sent',
  trash = 'trash',
  aliases = 'aliases', // aliases as a whole user folderId: 5
}

export const getFolderIdByName = (
  mailState: MailState,
  folderName: FolderName,
) => {
  const folders = mailState.folders;
  const foundFolder = folders.find(
    folder => folder.name?.toLowerCase() === folderName,
  );
  return foundFolder?.folderId || undefined;
};

export const folderIdByNameSelector = (
  state: RootState,
  folderName: FolderName,
) => {
  return getFolderIdByName(state.mail, folderName);
};

const createSelectorMailIdsForFolder = (folderName: FolderName) =>
  createSelector(
    (state: RootState) => state.mail,
    mailState => {
      const inboxId = getFolderIdByName(mailState, folderName);
      const mailIds = mailState.mailIdsForFolder[inboxId];
      return mailIds || [];
    },
  );

export const inboxMailIdsSelector = createSelectorMailIdsForFolder(
  FolderName.inbox,
);
export const draftsMailIdsSelector = createSelectorMailIdsForFolder(
  FolderName.drafts,
);
export const sentMailIdsSelector = createSelectorMailIdsForFolder(
  FolderName.sent,
);
export const trashMailIdsSelector = createSelectorMailIdsForFolder(
  FolderName.trash,
);

const createSelectorMailListForFolder = (folderName: FolderName) =>
  createSelector(
    (state: RootState) => state.mail,
    createSelectorMailIdsForFolder(folderName),
    (mailState, mailIds) => {
      const mailList = mailIds.map(id => mailState.mail[id]);
      return mailList;
    },
  );
export const inboxMailListSelector = createSelectorMailListForFolder(
  FolderName.inbox,
);
export const draftsMailListSelector = createSelectorMailListForFolder(
  FolderName.drafts,
);
export const sentMailListSelector = createSelectorMailListForFolder(
  FolderName.sent,
);
export const trashMailListSelector = createSelectorMailListForFolder(
  FolderName.trash,
);

export const messageListFilters = (state: RootState) =>
  state.global.messageListFilters;

export const readFilter = createSelector(
  [messageListFilters],
  filters => filters.readStatus,
);

export const filteredInboxMailListSelector = createSelector(
  [inboxMailListSelector, readFilter],
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
