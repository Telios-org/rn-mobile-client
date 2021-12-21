import nodejs from 'nodejs-mobile-react-native';

import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  useColorScheme,
  View,
} from 'react-native';

// const styles = StyleSheet.create({})

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [statusText, setStatusText] = useState('');
  const [driveKey, setDriveKey] = useState('');
  const [driveDiffKey, setDriveDiffKey] = useState('');

  console.log('Rendering', { statusText, isDarkMode });

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

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Button title="Create Drive" onPress={createDrive} />
          <Button title="Create Account" onPress={createAccount} />
          <Text style={{ color: 'white' }}>{statusText}</Text>
          <Text style={{ color: 'white' }}>{driveKey}</Text>
          <Text style={{ color: 'white' }}>{driveDiffKey}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
