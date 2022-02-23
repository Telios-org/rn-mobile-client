import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { useAppDispatch } from '../hooks';
import { accountLogout } from '../mainSlice';
import { fonts } from '../util/fonts';

export type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParams, 'profile'>,
  NativeStackScreenProps<RootStackParams>
>;

export const ProfileScreen = (props: ProfileScreenProps) => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(accountLogout());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={fonts.large.medium}>Not Implemented</Text>
    </View>
  );
};
