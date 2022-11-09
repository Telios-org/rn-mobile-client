import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, SectionList, Text, View } from 'react-native';

import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { groupBy } from 'lodash';

import { SwipeRowProvider } from '../../components/SwipeRow/SwipeRowProvider';
import { SwipeableContactItem } from './components/SwipeableContactItem';
import { ContactsListHeader } from './components/ContactsListHeader';
import { Icon } from '../../components/Icon';

import {
  ProfileStackParams,
  RootStackParams,
} from '../../navigators/Navigator';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { colors } from '../../util/colors';
import {
  getAllContacts,
  removeContact,
  searchContact,
} from '../../store/thunks/contacts';
import {
  contactsSelector,
  searchContactsSelector,
} from '../../store/selectors/contacts';
import { Contact } from '../../store/types';
import { fonts } from '../../util/fonts';
import { getFirstCharOfValidParameter } from '../../util/contact';
import styles from './styles';
import { showToast } from '../../util/toasts';

export type ContactScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParams, 'contacts'>,
  NativeStackScreenProps<RootStackParams>
>;

const MIN_SEARCH_CHAR_LIMIT = 3;

export const ContactScreen = (props: ContactScreenProps) => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>('');

  const contacts: Contact[] = useAppSelector(contactsSelector);
  const searchContacts: Contact[] = useAppSelector(searchContactsSelector);

  useEffect(() => {
    dispatch(getAllContacts());
  }, []);

  const groupedContactsByMailFirstChacter = useMemo(() => {
    const contactList =
      searchText?.length >= MIN_SEARCH_CHAR_LIMIT ? searchContacts : contacts;
    return groupBy(contactList, item =>
      getFirstCharOfValidParameter(item)?.toUpperCase(),
    );
  }, [contacts, searchContacts, searchText]);

  const sectionListData = useMemo(() => {
    const sectionData: Array<{ title: string; data: Array<Contact> }> = [];
    const gropKeys = Object.keys(groupedContactsByMailFirstChacter) || [];
    gropKeys?.reverse()?.map(key =>
      sectionData.push({
        title: key,
        data: groupedContactsByMailFirstChacter[key],
      }),
    );

    return sectionData.sort((a, b) => a.title.localeCompare(b.title));
  }, [groupedContactsByMailFirstChacter]);

  const deleteContent = async (id: string) => {
    try {
      await dispatch(removeContact({ id: id })).unwrap();
      showToast('success', 'Contact deleted successfully');
    } catch (e: any) {
      const errorMessage =
        e?.message || 'Failed to delete contact, please try again later';
      showToast('error', errorMessage);
    }
  };

  const editContent = async (contactId: string) =>
    props.navigation.navigate('contactDetail', {
      contactId: contactId,
      editContent: true,
    });

  const handleOnPressContent = (contactId: string) =>
    props.navigation.navigate('contactDetail', { contactId: contactId });

  const handleAddButton = () => props.navigation.navigate('newContact');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    if (text?.length >= MIN_SEARCH_CHAR_LIMIT) {
      dispatch(searchContact({ searchQuery: text }));
    }
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <SwipeableContactItem
      contact={item}
      onPress={handleOnPressContent}
      onPressEdit={editContent}
      onPressDelete={deleteContent}
    />
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={fonts.large.bold}>{title}</Text>
    </View>
  );

  const noResultRender = () => {
    const noResultMessage =
      searchText?.length >= MIN_SEARCH_CHAR_LIMIT
        ? 'No Results Found'
        : "You don't have any contact.";
    return (
      <View style={styles.noResultContainer}>
        <Icon name={'search-outline'} size={58} color={colors.skyBase} />
        <Text style={styles.noResultText}>{noResultMessage}</Text>
      </View>
    );
  };

  return (
    <SwipeRowProvider isFocusedScreen={isFocused}>
      <SafeAreaView style={styles.container}>
        <ContactsListHeader
          handleAddButton={handleAddButton}
          onChangeText={handleSearchTextChange}
          searchText={searchText}
          totalContactCount={contacts?.length || 0}
        />
        <SectionList
          style={styles.sectionList}
          sections={sectionListData}
          stickySectionHeadersEnabled={true}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) =>
            `contact-list-item-${item._id}-${index}`
          }
          ListEmptyComponent={noResultRender}
        />
      </SafeAreaView>
    </SwipeRowProvider>
  );
};
