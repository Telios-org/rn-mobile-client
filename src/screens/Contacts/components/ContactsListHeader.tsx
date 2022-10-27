import React from 'react';
import { Text, View, Pressable } from 'react-native';

import { Icon } from '../../../components/Icon';
import { Input } from '../../../components/Input';

import { colors } from '../../../util/colors';
import styles from './styles';

type ContactsListHeaderProps = {
  isDisable?: boolean;
  totalContactCount: number;
  searchText: string;
  onChangeText?: (arg0: string) => void;
  handleAddButton?: () => void;
};

export const ContactsListHeader = ({
  isDisable = false,
  totalContactCount,
  searchText,
  onChangeText,
  handleAddButton = () => {},
}: ContactsListHeaderProps) => {
  const handleTextChange = (text: string) => {
    onChangeText?.(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <Text style={styles.description}>
        Search your directory of {totalContactCount} contacts
      </Text>
      <View style={styles.inputContainer}>
        <Input
          style={styles.textInputContainer}
          textInputStyle={styles.textInput}
          value={searchText}
          placeholder="Search"
          iconLeft={{ name: 'search' }}
          onChangeText={handleTextChange}
          autoCapitalize="none"
          autoCorrect={false}
          disabled={isDisable}
          clearButtonMode="while-editing"
        />
        <Pressable style={styles.actionButton} onPress={handleAddButton}>
          <Icon name={'add-outline'} size={36} color={colors.skyBase} />
        </Pressable>
      </View>
    </View>
  );
};
