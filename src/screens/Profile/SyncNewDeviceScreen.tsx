import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ProfileStackParams } from '../../Navigator';

export type SyncNewDeviceScreenProps = NativeStackScreenProps<
  ProfileStackParams,
  'syncNewDevice'
>;

export const SyncNewDeviceScreen = ({}: SyncNewDeviceScreenProps) => {
  return (
    <View>
      <Text>SyncNewDevice Screen</Text>
    </View>
  );
};
