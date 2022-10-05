import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, View } from 'react-native';

import { MainStackParams, RootStackParams } from '../../Navigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MailSectionHeader } from '../../components/MailSectionHeader/MailSectionHeader';
import { searchedElementsByGroupId } from '../../store/selectors/search';
import { Email } from '../../store/types';
import { EmailCell } from '../../components/EmailCell/EmailCell';
import styles from './styles';

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

  const sectionHeader = () => (
    <MailSectionHeader
      title={`"${searchKey || 'Search'}"`}
      icon={'search-outline'}
      count={searchedElements?.length}
      onPress={() => {}}
    />
  );

  const renderItem = ({ item }: { item: Email }) => (
    <EmailCell email={item} onPress={() => onSelectEmail?.(item.emailId)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.content}
        data={searchedElements}
        renderItem={renderItem}
        ListHeaderComponent={sectionHeader}
      />
    </View>
  );
};
