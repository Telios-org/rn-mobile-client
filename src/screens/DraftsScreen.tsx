import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getAllMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';
import { selectAllMailsByFolder } from '../store/selectors/email';
import MailContainer from '../components/MailContainer';

export type DraftsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'drafts'>,
  NativeStackScreenProps<RootStackParams>
>;

export const DraftsScreen = () => {
  const dispatch = useAppDispatch();
  const draftsMails = useAppSelector(state =>
    selectAllMailsByFolder(state, FoldersId.drafts),
  );

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  return (
    <MailContainer
      title="Drafts"
      showBottomSeparator
      mails={draftsMails}
      getMoreData={async (offset, perPage) => {
        return await dispatch(
          getAllMailByFolder({ id: FoldersId.drafts, offset, limit: perPage }),
        ).unwrap();
      }}
      onPressItem={onSelectEmail}
    />
  );
};
