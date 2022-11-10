import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../navigators/Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAllMailsByFolder } from '../store/selectors/email';
import { getAllMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';
import MailContainer from '../components/MailContainer';

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = (props: SentScreenProps) => {
  const dispatch = useAppDispatch();
  const sentMailList = useAppSelector(state =>
    selectAllMailsByFolder(state, FoldersId.sent),
  );

  // TODO add logic to update redux with send mail, now you can see new sent mails on manual refresh or on first open Sent screen

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  return (
    <MailContainer
      title="Sent"
      showBottomSeparator
      mails={sentMailList}
      getMoreData={async (offset, perPage) => {
        return await dispatch(
          getAllMailByFolder({ id: FoldersId.sent, offset, limit: perPage }),
        ).unwrap();
      }}
      onPressItem={onSelectEmail}
    />
  );
};
