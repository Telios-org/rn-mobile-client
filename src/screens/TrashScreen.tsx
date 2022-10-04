import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectAllMailsByFolder } from '../store/selectors/email';
import { getAllMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';
import MailContainer from '../components/MailContainer';

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
    // todo: navigate
  };

  // TODO review Trash flow

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
    />
  );
};
