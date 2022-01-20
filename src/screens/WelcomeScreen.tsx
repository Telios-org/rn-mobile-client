import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { RootStackParams } from '../App';
import { spacing } from '../util/spacing';
import { useAppDispatch } from '../hooks';
import { registerNewAccount } from '../mainSlice';

export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'welcome'
>;

export const WelcomeScreen = (props: WelcomeScreenProps) => {
  const dispatch = useAppDispatch();

  const onRegister = () => {
    // props.navigation.navigate('register');

    dispatch(
      registerNewAccount({
        email: 'justin25@dev.telios.io',
        masterPassword: 'letmein123',
        recoveryEmail: 'justin.poliachik@gmail.com',
        code: 'btester1',
      }),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />

      <View style={{ margin: spacing.md }}>
        <Button title="Create Your Account" onPress={onRegister} />
      </View>

      {/* <ScrollView style={{ flex: 1 }}>
        <View>
          <Button title="Create Drive" onPress={createDrive} />
          <Button title="Create Account" onPress={createAccount} />
          <Text>{statusText}</Text>
          <Text>{driveKey}</Text>
          <Text>{driveDiffKey}</Text>
        </View>
      </ScrollView> */}
    </View>
  );
};
