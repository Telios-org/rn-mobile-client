import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useSelector } from 'react-redux';
import {
  FolderName,
  getFolderIdByName,
  inboxMailListSelector,
} from '../store/mailSelectors';
import { getMailByFolder, getNewMailFlow } from '../store/mail';
import { MailList, MailListItem } from '../components/MailList';
import { ComposeNewEmailButton } from '../components/ComposeNewEmailButton';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const inboxMailList = useSelector(inboxMailListSelector);

  React.useLayoutEffect(() => {
    const inboxFolderId = getFolderIdByName(mail, FolderName.inbox);
    if (!inboxFolderId) {
      return;
    }
    dispatch(getMailByFolder({ id: inboxFolderId }));
  }, [mail.folders]);

  const onRefresh = async () => {
    await dispatch(getNewMailFlow());
  };

  const onNewEmail = () => {
    props.navigation.navigate('compose');
  };

  const onSelectEmail = (emailId: string) => {
    props.navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId },
    });
  };

  const listData: MailListItem[] = inboxMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  const renderHeader = () => (
    <MailListHeader title="Inbox" subtitle={mail.mailbox?.address} />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        navigation={props.navigation}
        renderNavigationTitle={() => <NavTitle>{'Inbox'}</NavTitle>}
        headerComponent={renderHeader}
        loading={mail.loadingGetMailMeta}
        onRefresh={onRefresh}
        items={listData}
      />
      <ComposeNewEmailButton onPress={onNewEmail} />
    </View>
  );
};
