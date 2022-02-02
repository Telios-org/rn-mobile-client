import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { MainStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { useAppDispatch } from '../hooks';
import { getNewMailMeta } from '../mainSlice';

export type InboxScreenProps = NativeStackScreenProps<MainStackParams, 'inbox'>;

export const InboxScreen = (props: InboxScreenProps) => {
  const dispatch = useAppDispatch();
  const onRefresh = () => {
    dispatch(getNewMailMeta());
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Button onPress={onRefresh} title="refresh" />,
    });
  }, [props.navigation]);

  return <ScrollView style={{ flex: 1 }}></ScrollView>;
};
