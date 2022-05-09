import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useSelector } from 'react-redux';
import {
  FolderName,
  getFolderIdByName,
  sentMailListSelector,
} from '../store/mailSelectors';
import { getMailByFolder } from '../store/mail';
import { MailList, MailListItem } from '../components/MailList';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = (props: SentScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const sentMailList = useSelector(sentMailListSelector);

  React.useLayoutEffect(() => {
    dispatch(getMailByFolder({ id: getFolderIdByName(mail, FolderName.sent) }));
  }, [mail.folders]);

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
      navigation={props.navigation}
      renderNavigationTitle={() => <NavTitle>{'Sent'}</NavTitle>}
      headerComponent={renderHeader}
      loading={mail.loadingGetMailMeta}
      items={listData}
      disableUnreadFilters={true}
    />
  );
};
