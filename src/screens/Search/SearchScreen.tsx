import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  Pressable,
  Keyboard,
  TextInput,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '../../components/Icon';
import { NavIconButton } from '../../components/NavIconButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetSearch } from '../../store/search';
import {
  groupedSearchedElementsSelector,
  searchLoadingSelector,
} from '../../store/selectors/search';
import { searchMailbox } from '../../store/thunks/search';
import { colors } from '../../util/colors';
import { EmailCell } from '../../components/EmailCell/EmailCell';
import { MainStackParams, RootStackParams } from '../../navigators/Navigator';
import { MailSectionHeader } from '../../components/MailSectionHeader/MailSectionHeader';
import { ToFrom } from '../../store/types';
import styles from './styles';

export type SearchProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParams, 'search'>,
  NativeStackScreenProps<MainStackParams, 'inbox'>
>;

export const SearchScreen = ({ navigation }: SearchProps) => {
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const isLoading = useAppSelector(searchLoadingSelector);
  const groupedSearchedElements = useAppSelector(
    groupedSearchedElementsSelector,
  );

  useEffect(() => {
    return () => {
      dispatch(resetSearch());
    };
  }, [searchText]);

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

  const handleSectionClick = (
    id: { aliasId: string; folderId: string },
    title: string,
  ) => {
    const sectionTitle = id.aliasId ? '' : title;
    navigation.navigate('searchSection', {
      ...id,
      title: sectionTitle,
      searchKey: searchText,
    });
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text.length >= 3) {
      dispatch(searchMailbox({ searchQuery: text }));
    }
  };

  const handleClose = () => Keyboard.dismiss();

  // @ts-ignore
  const renderItem = ({ item, section }) => {
    const fromJSON: ToFrom = JSON.parse(item.fromJSON)[0];
    return (
      <EmailCell.Search
        emailId={item.emailId}
        emailDate={item.date}
        bodyAsText={item.bodyAsText}
        subject={item.subject}
        recipient={fromJSON.name || fromJSON.address}
        onPress={() =>
          onSelectEmail(item.emailId, section.id.unread, item.folderId)
        }
        isUnread={item.unread}
      />
    );
  };

  const noResultRender = () => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.noResultContainer}>
        <Icon name={'search-outline'} size={58} color={colors.skyBase} />
        <Text style={styles.noResultText}>No Results Found</Text>
      </View>
    );
  };

  const headerSearchBar = () => (
    <View style={styles.searchBox}>
      <NavIconButton
        icon={{ name: 'close-outline', size: 28 }}
        onPress={() => navigation.goBack()}
        padLeft
        padRight
      />
      <TextInput
        placeholder="Search"
        style={[styles.textInput]}
        clearButtonMode={'while-editing'}
        onChangeText={text => handleSearchTextChange(text)}
        value={searchText}
      />
      <Pressable style={styles.cancelContainer} onPress={handleClose}>
        <Text style={styles.text}>Cancel</Text>
      </Pressable>
    </View>
  );

  // @ts-ignore
  const sectionHeader = ({ section: { title, count, icon, id } }) => (
    <MailSectionHeader
      title={title}
      icon={icon}
      count={count}
      onPress={() => handleSectionClick(id, title)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {headerSearchBar()}
      <SectionList
        sections={groupedSearchedElements}
        keyExtractor={(item, index) => item.emailId + index}
        renderItem={renderItem}
        renderSectionHeader={sectionHeader}
        ListEmptyComponent={noResultRender}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="always"
      />
    </SafeAreaView>
  );
};
