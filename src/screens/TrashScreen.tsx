import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../navigators/Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAllMailsByFolder } from '../store/selectors/email';
import {
  deleteMailFromFolder,
  getAllMailByFolder,
} from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';
import MailContainer from '../components/MailContainer';
import { Email } from '../store/types';
import { showToast } from '../util/toasts';

export type TrashScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'trash'>,
  NativeStackScreenProps<RootStackParams>
>;

export const TrashScreen = (props: TrashScreenProps) => {
  const dispatch = useAppDispatch();
  const trashMailList = useAppSelector(state =>
    selectAllMailsByFolder(state, FoldersId.trash),
  );

  const onSelectEmail = (emailId: string) => {
    props.navigation.navigate('emailDetail', {
      emailId: emailId,
      isUnread: false,
      folderId: FoldersId.trash,
    });
  };

  const onDeleteEmail = async (email: Email) => {
    try {
      await dispatch(
        deleteMailFromFolder({
          messageIds: [email.emailId],
          folderId: FoldersId.trash,
        }),
      );
    } catch (e: any) {
      showToast('error', e.message);
    }
  };

  return (
    <MailContainer
      title="Trash"
      showBottomSeparator
      mails={trashMailList}
      getMoreData={async (offset, perPage) => {
        return await dispatch(
          getAllMailByFolder({ id: FoldersId.trash, offset, limit: perPage }),
        ).unwrap();
      }}
      onPressItem={onSelectEmail}
      onRightActionPress={onDeleteEmail}
    />
  );
};
