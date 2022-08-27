import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { MainStackParams, RootStackParams } from '../../Navigator';
import { useSelector } from 'react-redux';
import { MailList, MailListItem } from '../../components/MailList';
import { RootState } from '../../store';
import { MailSectionHeader } from '../../components/MailSectionHeader/MailSectionHeader';
import { searchedElementsByGroupId } from '../../store/selectors/search';

export type SearchSectionScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParams, 'searchSection'>,
  NativeStackScreenProps<MainStackParams, 'inbox'>
>;

export const SearchSectionScreen = ({
  navigation,
  route,
}: SearchSectionScreenProps) => {
  const folderId = route.params.folderId;
  const aliasId = route.params.aliasId;

  const searchKey = route.params?.searchKey;

  const searchedElements = useSelector((state: RootState) =>
    searchedElementsByGroupId(state, { folderId, aliasId }),
  );

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
    });
  }, [route]);

  const onSelectEmail = (emailId: string) => {
    navigation.navigate('inbox', {
      screen: 'emailDetail',
      params: { emailId: emailId, folderId: parseInt(folderId, 10) },
    });
  };

  type MailListItems = MailListItem & {};
  const listData: MailListItems[] = searchedElements.map(item => ({
    id: item.emailId,
    mail: item,
    onSelect: () => onSelectEmail(item.emailId),
  }));

  const sectionHeader = () => (
    <MailSectionHeader
      title={`"${searchKey || 'Search'}"`}
      icon={'search-outline'}
      count={searchedElements?.length}
      onPress={() => {}}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <MailList
        navigation={navigation}
        loading={false}
        items={listData}
        sectionHeader={sectionHeader}
      />
    </View>
  );
};
