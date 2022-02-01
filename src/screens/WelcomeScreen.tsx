import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StatusBar, View } from 'react-native';
import { Button } from '../components/Button';
import { RootStackParams } from '../Navigator';
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
        <Button
          title="Login"
          onPress={onLogin}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </View>
  );
};
