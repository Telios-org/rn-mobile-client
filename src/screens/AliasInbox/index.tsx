import React, { useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  filteredInboxMailListSelector,
  selectMailsLoading,
} from '../../store/selectors/email';
import {
  FilterOption,
  MailList,
  MailListItem,
} from '../../components/MailList';
import { MailListHeader } from '../../components/MailListHeader';
import { NavTitle } from '../../components/NavTitle';
import { ComposeNewEmailButton } from '../../components/ComposeNewEmailButton';
import { MainStackParams, RootStackParams } from '../../Navigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { getMailByFolder, getNewMailFlow } from '../../store/thunks/email';
import { FoldersId } from '../../store/types/enums/Folders';

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
  const dispatch = useAppDispatch();

  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);

  const inboxMailList = useAppSelector(state => {
    return filteredInboxMailListSelector(
      state,
      FoldersId.aliases,
      selectedFilterOption,
    );
  });

  const isLoading = useAppSelector(selectMailsLoading);

  const getMails = async () => {
    await dispatch(getMailByFolder({ id: FoldersId.aliases }));
  };

  useLayoutEffect(() => {
    getMails();
  }, []);

  const onRefresh = async () => {
    await dispatch(getNewMailFlow());
  };

  const onNewEmail = () => {
    navigation.navigate('compose');
  };

  const setFilterOption = (filterItem: FilterOption) => {
    setSelectedFilterOption(filterItem);
  };

  const onSelectEmail = (emailId: string) => {
    navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId, folderId: FoldersId.aliases },
    });
  };

  const listData: MailListItem[] = inboxMailList.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  const renderHeader = () => (
    <MailListHeader title="Inbox" subtitle={aliasId} />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        renderNavigationTitle={() => <NavTitle>{'Inbox'}</NavTitle>}
        headerComponent={renderHeader}
        loading={isLoading}
        onRefresh={onRefresh}
        items={listData}
        setFilterOption={setFilterOption}
        selectedFilterOption={selectedFilterOption}
      />
      <ComposeNewEmailButton onPress={onNewEmail} />
    </View>
  );
};
