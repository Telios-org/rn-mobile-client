import React, { useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { MainStackParams, RootStackParams } from 'src/Navigator';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { useSelector } from 'react-redux';
import {
  filteredInboxMailListSelector,
  FolderName,
  getFolderIdByName,
} from 'src/store/selectors/mail';
import { getMailByFolder, getNewMailFlow } from 'src/store/mail';
import { FilterOption, MailList, MailListItem } from 'src/components/MailList';
import { ComposeNewEmailButton } from 'src/components/ComposeNewEmailButton';
import { NavTitle } from 'src/components/NavTitle';
import { MailListHeader } from 'src/components/MailListHeader';
import { RootState } from 'src/store';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mail = useAppSelector(state => state.mail);
  const dispatch = useAppDispatch();
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);

  const inboxMailList = useSelector((state: RootState) =>
    filteredInboxMailListSelector(state, selectedFilterOption),
  );

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

  const setFilterOption = (filterItem: FilterOption) => {
    setSelectedFilterOption(filterItem);
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
        setFilterOption={setFilterOption}
        selectedFilterOption={selectedFilterOption}
      />
      <ComposeNewEmailButton onPress={onNewEmail} />
    </View>
  );
};
