import React, { useLayoutEffect, useState } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  filteredInboxMailListSelector,
  selectMailBoxAddress,
  selectMailsLoading,
} from '../store/selectors/email';
import { FilterOption, MailList, MailListItem } from '../components/MailList';
import { ComposeNewEmailButton } from '../components/ComposeNewEmailButton';
import { NavTitle } from '../components/NavTitle';
import { MailListHeader } from '../components/MailListHeader';
import { getMailByFolder } from '../store/thunks/email';
import { FoldersId } from '../store/types/enums/Folders';

export type InboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'inbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const InboxScreen = (props: InboxScreenProps) => {
  const dispatch = useAppDispatch();
  const mailboxAddress = useAppSelector(selectMailBoxAddress);
  const isLoading = useAppSelector(selectMailsLoading);

  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);

  const inboxMailList = useAppSelector(state => {
    return filteredInboxMailListSelector(
      state,
      FoldersId.inbox,
      selectedFilterOption,
    );
  });

  const getMails = async () => {
    await dispatch(getMailByFolder({ id: FoldersId.inbox }));
  };

  useLayoutEffect(() => {
    getMails();
  }, []);

  const onNewEmail = () => {
    props.navigation.navigate('compose');
  };

  const onSelectEmail = (emailId: string) => {
    props.navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId, folderId: FoldersId.inbox },
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
    <MailListHeader title="Inbox" subtitle={mailboxAddress} />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        renderNavigationTitle={() => <NavTitle>{'Inbox'}</NavTitle>}
        headerComponent={renderHeader}
        onRefresh={getMails}
        items={listData}
        loading={isLoading}
        setFilterOption={setFilterOption}
        selectedFilterOption={selectedFilterOption}
      />
      <ComposeNewEmailButton onPress={onNewEmail} />
    </View>
  );
};
