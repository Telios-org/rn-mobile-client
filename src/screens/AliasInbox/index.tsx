import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useSelector } from 'react-redux';
import {
  FolderName,
  getFolderIdByName,
  inboxMailListSelector,
} from '../../store/mailSelectors';
import { getMailByFolder, getNewMailFlow } from '../../store/mail';
import { MailList, MailListItem } from '../../components/MailList';
import { MailListHeader } from '../../components/MailListHeader';
import { NavTitle } from '../../components/NavTitle';
import { ComposeNewEmailButton } from '../../components/ComposeNewEmailButton';
import { MainStackParams, RootStackParams } from '../../Navigator';
import { CompositeScreenProps } from '@react-navigation/native';

export type AliasInboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasInbox'>,
  NativeStackScreenProps<RootStackParams>
>;

// TODO screen is duplicated, it's a sample
export const AliasInboxScreen = ({
  navigation,
  route,
}: AliasInboxScreenProps) => {
  const aliasId = route.params.aliasId;
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
    navigation.navigate('compose');
  };

  const onSelectEmail = (emailId: string) => {
    navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId },
    });
  };

  const listData: MailListItem[] = inboxMailList.map(
    (item: { emailId: string }) => ({
      id: item.emailId,
      mail: item,
      onSelect: () => onSelectEmail(item.emailId),
    }),
  );

  const renderHeader = () => (
    <MailListHeader title="Inbox" subtitle={aliasId} />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        navigation={navigation}
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
