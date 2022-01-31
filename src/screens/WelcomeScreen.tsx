import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { RootStackParams } from '../App';
import { spacing } from '../util/spacing';

export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'welcome'
>;

export const WelcomeScreen = (props: WelcomeScreenProps) => {
  const onRegister = () => {
    props.navigation.navigate('register');
  };
  const onLogin = () => {
    props.navigation.navigate('login');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />

      <View style={{ margin: spacing.md }}>
        <Button title="Create Your Account" onPress={onRegister} />
      </View>
      <View style={{ margin: spacing.md }}>
        <Button title="Login" onPress={onLogin} />
      </View>
    </View>
  );
};
