import { createSelector } from '@reduxjs/toolkit';
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

const mailAndFoldersSelector = (state: RootState) => ({
  mail: state.mail.mail,
  folders: state.mail.folders,
  mailIdsForFolder: state.mail.mailIdsForFolder,
});

export const inboxMailIdsSelector = createSelector(
  (state: RootState) => state.mail,
  mailState => {
    const inboxId = getFolderIdByName(mailState, FolderName.inbox);
    const mailIds = mailState.mailIdsForFolder[inboxId];
    return mailIds || [];
  },
);
export const draftsMailIdsSelector = createSelector(
  (state: RootState) => state.mail,
  mailState => {
    const inboxId = getFolderIdByName(mailState, FolderName.drafts);
    const mailIds = mailState.mailIdsForFolder[inboxId];
    return mailIds || [];
  },
);
export const sentMailIdsSelector = createSelector(
  (state: RootState) => state.mail,
  mailState => {
    const inboxId = getFolderIdByName(mailState, FolderName.sent);
    const mailIds = mailState.mailIdsForFolder[inboxId];
    return mailIds || [];
  },
);
export const trashMailIdsSelector = createSelector(
  (state: RootState) => state.mail,
  mailState => {
    const inboxId = getFolderIdByName(mailState, FolderName.trash);
    const mailIds = mailState.mailIdsForFolder[inboxId];
    return mailIds || [];
  },
);
