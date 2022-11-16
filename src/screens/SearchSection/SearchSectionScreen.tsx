import React, { useEffect } from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, View } from 'react-native';

import { MainStackParams, RootStackParams } from '../../navigators/Navigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MailSectionHeader } from '../../components/MailSectionHeader/MailSectionHeader';
import { searchedElementsByGroupId } from '../../store/selectors/search';
import { Email, ToFrom } from '../../store/types';
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

  const onSelectEmail = (
    emailId: string,
    isUnread: boolean,
    folderId: number,
  ) => {
    navigation.navigate('emailDetail', {
      emailId: emailId,
      isUnread,
      folderId,
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

  const renderItem = ({ item }: { item: Email }) => {
    const fromJSON: ToFrom = JSON.parse(item.fromJSON)[0];
    return (
      <EmailCell
        emailId={item.emailId}
        emailDate={item.date}
        bodyAsText={item.bodyAsText}
        subject={item.subject}
        recipient={fromJSON.name || fromJSON.address}
        onPress={() =>
          onSelectEmail?.(item.emailId, item.unread, item.folderId)
        }
        isUnread={item.unread}
      />
    );
  };

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
