import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../../navigators/Navigator';
import { MailListHeader } from '../../components/MailListHeader';
import { FoldersId } from '../../store/types/enums/Folders';
import MailWithFiltersContainer from '../../components/MailWithFiltersContainer';
import {
  selectAllMailsByFolder,
  selectMailBoxAddress,
  selectReadMailsByFolder,
  selectUnreadMailsByFolder,
} from '../../store/selectors/email';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getAllMailByFolder,
  getMailByFolderRead,
  getMailByFolderUnread,
} from '../../store/thunks/email';
import ComposeButton from '../../components/ComposeButton/ComposeButton';
import useFirstLogin from '../../hooks/useFirstLogin';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = () => {
  const mailboxAddress = useAppSelector(selectMailBoxAddress);
  const dispatch = useAppDispatch();
  const folderId = FoldersId.inbox;
  useFirstLogin();

  return (
    <>
      <MailWithFiltersContainer
        folderId={folderId}
        renderTitle={<MailListHeader title="Inbox" subtitle={mailboxAddress} />}
        allMailSelector={state => selectAllMailsByFolder(state, folderId)}
        readMailSelector={state => selectReadMailsByFolder(state, folderId)}
        unreadMailSelector={state => selectUnreadMailsByFolder(state, folderId)}
        getAllMails={async (offset, perPage) => {
          return await dispatch(
            getAllMailByFolder({ id: folderId, offset, limit: perPage }),
          ).unwrap();
        }}
        getUnreadMails={async (offset, perPage) => {
          return await dispatch(
            getMailByFolderUnread({ id: folderId, offset, limit: perPage }),
          ).unwrap();
        }}
        getReadMails={async (offset, perPage) => {
          return await dispatch(
            getMailByFolderRead({ id: folderId, offset, limit: perPage }),
          ).unwrap();
        }}
      />
      <ComposeButton />
    </>
  );
};
