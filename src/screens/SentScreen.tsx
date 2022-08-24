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

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = (props: SentScreenProps) => {
  const dispatch = useAppDispatch();
  const sentMailList = useAppSelector(state =>
    selectMailsByFolder(state, FoldersId.sent),
  );
  const isLoading = useAppSelector(selectMailsLoading);

  useEffect(() => {
    dispatch(getMailByFolder({ id: FoldersId.sent }));
  }, []);

  const onSelectEmail = (emailId: string) => {
    // todo: navigate
  };

  const renderHeader = () => <MailListHeader title="Sent" />;

  const listData: MailListItem[] = sentMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  return (
    <MailList
      renderNavigationTitle={() => <NavTitle>{'Sent'}</NavTitle>}
      headerComponent={renderHeader}
      loading={isLoading}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
