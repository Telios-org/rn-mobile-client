import React, { useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
// @ts-ignore
import envApi from '../../../env_api.json';
import {
  MailList,
  MailListItem,
  FilterOption,
} from '../../components/MailList';
import { MailListHeader } from '../../components/MailListHeader';
import { ComposeNewEmailButton } from '../../components/ComposeNewEmailButton';
import { MainStackParams, RootStackParams } from '../../Navigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { getMailByFolder } from '../../store/thunks/email';
import { FoldersId } from '../../store/types/enums/Folders';
import { aliasSelectors } from '../../store/adapters/aliases';
import { RootState } from '../../store';
import { getMessagesByAliasId } from '../../store/thunks/aliases';
import {
  filteredInboxMailByAliasSelector,
  selectMailsLoading,
} from '../../store/selectors/email';
import MailListHeaderTitle from '../../components/MailListHeaderTitle';
import { fonts, textStyles } from '../../util/fonts';

export type AliasInboxScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'aliasInbox'>,
  NativeStackScreenProps<RootStackParams>
>;

export const AliasInboxScreen = ({
  navigation,
  route,
}: AliasInboxScreenProps) => {
  const aliasId = route.params.aliasId;
  const dispatch = useAppDispatch();
  const alias = useAppSelector((state: RootState) =>
    aliasSelectors.selectById(state.aliases, aliasId),
  );
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>(FilterOption.All);
  const inboxMailList = useAppSelector(state => {
    return filteredInboxMailByAliasSelector(
      state,
      alias?.aliasId,
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
    if (alias?.aliasId) {
      await dispatch(getMessagesByAliasId({ id: alias.aliasId }));
    }
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

  if (!alias) {
    return null;
  }

  const renderHeader = () => (
    <MailListHeader
      title={`# ${alias.name}`}
      subtitle={`${alias.aliasId}@${envApi.postfix}`}
      showCurrentStatus
      canCopySubtitle
      isActive={!alias.disabled}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        renderNavigationTitle={() => (
          <MailListHeaderTitle
            title={`# ${alias.name}`}
            showCurrentStatus
            isActive={!alias.disabled}
            titleStyle={[fonts.large.bold, { color: textStyles.titleColor }]}
          />
        )}
        renderTitleDeps={[alias.disabled]}
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
