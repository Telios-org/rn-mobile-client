import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectMailsByFolder,
  selectMailsLoading,
} from '../store/selectors/email';
import { MailList, MailListItem } from '../components/MailList';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';
import { getMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';

export type TrashScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'trash'>,
  NativeStackScreenProps<RootStackParams>
>;

export const TrashScreen = (props: TrashScreenProps) => {
  const dispatch = useAppDispatch();
  const trashMailList = useAppSelector(state =>
    selectMailsByFolder(state, FoldersId.trash),
  );
  const isLoading = useAppSelector(selectMailsLoading);

  useEffect(() => {
    dispatch(getMailByFolder({ id: FoldersId.trash }));
  }, []);

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  const renderHeader = () => <MailListHeader title="Trash" />;

  const listData: MailListItem[] = trashMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  return (
    <MailList
      renderNavigationTitle={() => <NavTitle>{'Trash'}</NavTitle>}
      headerComponent={renderHeader}
      loading={isLoading}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
