import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { View, Image } from 'react-native';
import { Button } from '../components/Button';
import { CoreStackProps, RootStackParams } from '../navigators/Navigator';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';

export type IntroScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParams, 'intro'>,
  NativeStackScreenProps<CoreStackProps, 'register'>
>;

export const IntroScreen = (props: IntroScreenProps) => {
  const onRegister = () => {
    props.navigation.navigate('register');
  };

  const onLogin = () => {
    props.navigation.navigate('login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{ uri: 'logo-main' }}
          style={{ width: 110, height: 101 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SafeAreaView style={{ margin: spacing.lg, alignItems: 'center' }}>
          <Button title="Create account" size="large" onPress={onRegister} />
          <Button
            title="I already have an account"
            type="text"
            size="large"
            onPress={onLogin}
            style={{ marginTop: spacing.md }}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};
