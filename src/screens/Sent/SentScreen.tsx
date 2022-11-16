import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../../navigators/Navigator';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAllMailsByFolder } from '../../store/selectors/email';
import {
  deleteMailFromFolder,
  getAllMailByFolder,
} from '../../store/thunks/email';
import { FoldersId } from '../../store/types/enums/Folders';
import MailContainer from '../../components/MailContainer';
import { Email } from '../../store/types';

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = ({ navigation }: SentScreenProps) => {
  const dispatch = useAppDispatch();
  const sentMailList = useAppSelector(state =>
    selectAllMailsByFolder(state, FoldersId.sent),
  );

  const onSelectEmail = (emailId: string) => {
    navigation.navigate('emailDetail', {
      emailId,
      isUnread: false,
      folderId: FoldersId.sent,
    });
  };

  const onDeleteEmail = (item: Email) => {
    dispatch(
      deleteMailFromFolder({
        messageIds: [item.emailId],
        folderId: FoldersId.sent,
      }),
    );
  };

  return (
    <MailContainer
      title="Sent"
      showBottomSeparator
      showRecipient
      mails={sentMailList}
      getMoreData={async (offset, perPage) => {
        return await dispatch(
          getAllMailByFolder({ id: FoldersId.sent, offset, limit: perPage }),
        ).unwrap();
      }}
      onPressItem={onSelectEmail}
      onRightActionPress={onDeleteEmail}
    />
  );
};
