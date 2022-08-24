import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { MailList, MailListItem } from '../components/MailList';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';
import { getMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';
import {
  selectMailsByFolder,
  selectMailsLoading,
} from '../store/selectors/email';

export type DraftsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'drafts'>,
  NativeStackScreenProps<RootStackParams>
>;

export const DraftsScreen = (props: DraftsScreenProps) => {
  const dispatch = useAppDispatch();
  const draftsMailList = useAppSelector(state =>
    selectMailsByFolder(state, FoldersId.drafts),
  );
  const isLoading = useAppSelector(selectMailsLoading);

  useEffect(() => {
    dispatch(getMailByFolder({ id: FoldersId.drafts }));
  }, []);

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  const renderHeader = () => <MailListHeader title="Drafts" />;

  const listData: MailListItem[] = draftsMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  return (
    <MailList
      renderNavigationTitle={() => <NavTitle>{'Drafts'}</NavTitle>}
      headerComponent={renderHeader}
      loading={isLoading}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
