import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';

export type SentScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'sent'>,
  NativeStackScreenProps<RootStackParams>
>;

export const SentScreen = (props: SentScreenProps) => {
  return <View style={{ flex: 1 }}></View>;
};
