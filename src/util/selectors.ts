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

const mailAndFoldersSelector = (state: RootState) => ({
  mail: state.main.mail,
  folders: state.main.folders,
  mailIdsForFolder: state.main.mailIdsForFolder,
});
export const inboxMailIdsSelector = createSelector(
  mailAndFoldersSelector,
  ({ mail, folders, mailIdsForFolder }) => {
    const inboxFolder = folders.find(
      folder => folder.name?.toLowerCase() === 'inbox',
    );
    if (!inboxFolder) {
      return [];
    }
    const mailIds = mailIdsForFolder[inboxFolder._id];
    return mailIds || [];
  },
);
export const draftsMailIdsSelector = createSelector(
  mailAndFoldersSelector,
  ({ mail, folders, mailIdsForFolder }) => {
    const draftsFolder = folders.find(
      folder => folder.name?.toLowerCase() === 'drafts',
    );
    if (!draftsFolder) {
      return [];
    }
    const mailIds = mailIdsForFolder[draftsFolder._id];
    return mailIds || [];
  },
);
