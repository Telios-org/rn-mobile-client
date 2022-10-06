import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ProfileStackParams } from '../../Navigator';

export type StatisticsScreenProps = NativeStackScreenProps<
  ProfileStackParams,
  'statistics'
>;

export const StatisticsScreen = ({}: StatisticsScreenProps) => {
  return (
    <View>
      <Text>Statistics Screen</Text>
    </View>
  );
};
