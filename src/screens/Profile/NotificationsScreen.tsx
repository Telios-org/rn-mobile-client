import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ProfileStackParams } from '../../navigators/Navigator';

export type NotificationsScreenProps = NativeStackScreenProps<
  ProfileStackParams,
  'notifications'
>;

export const NotificationsScreen = ({}: NotificationsScreenProps) => {
  return (
    <View>
      <Text>Notifications Screen</Text>
    </View>
  );
};
