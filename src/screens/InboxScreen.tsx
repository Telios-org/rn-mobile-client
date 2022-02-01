import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { MainStackParams } from '../Navigator';
import { spacing } from '../util/spacing';

export type InboxScreenProps = NativeStackScreenProps<MainStackParams, 'inbox'>;

export const InboxScreen = (props: InboxScreenProps) => {
  // needed:
  // account info to display avatar
  // list of emails
  // status of email loading - are we syncing?
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'yellow' }}></ScrollView>
  );
};
