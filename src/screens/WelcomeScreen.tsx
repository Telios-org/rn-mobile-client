import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import nodejs from 'nodejs-mobile-react-native';

import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { RootStackParams } from '../App';
import { spacing } from '../util/spacing';

export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'welcome'
>;

export const WelcomeScreen = (props: WelcomeScreenProps) => {
  const [statusText, setStatusText] = useState('');
  const [driveKey, setDriveKey] = useState('');
  const [driveDiffKey, setDriveDiffKey] = useState('');

  useEffect(() => {
    nodejs.start('bundle.js');
    nodejs.channel.addListener('message', msg => {
      console.log('From node: ', msg);
      if (msg.type === 'driveReady') {
        console.log('got key', msg.publicKey);
        setStatusText(JSON.stringify(msg));
        setDriveKey(msg.publicKey);
        setDriveDiffKey(msg.driveDiffKey);
      } else if (msg.type === 'registerAccount') {
        setStatusText(JSON.stringify(msg));
      }
    });
  });

  async function createDrive() {
    nodejs.channel.send({
      type: 'createDrive',
    });
  }

  async function createAccount() {
    if (!driveKey) {
      console.log('no drive key');
      return;
    }
    nodejs.channel.send({
      type: 'registerAccount',
      driveKey,
      driveDiffKey,
    });
  }

  const onRegister = () => {
    props.navigation.navigate('registerBetaCode');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />

      <View style={{ margin: spacing.md }}>
        <Button label="Create Your Account" onPress={onRegister} />
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
