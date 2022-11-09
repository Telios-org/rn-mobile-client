import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ProfileStackParams } from '../../navigators/Navigator';

export type ContactsScreenProps = NativeStackScreenProps<
  ProfileStackParams,
  'contacts'
>;

export const ContactsScreen = ({}: ContactsScreenProps) => {
  return (
    <View>
      <Text>Contacts Screen</Text>
    </View>
  );
};
