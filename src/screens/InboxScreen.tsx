import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlatList, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { MainStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getNewMailFlow, LocalEmail } from '../mainSlice';

export type InboxScreenProps = NativeStackScreenProps<MainStackParams, 'inbox'>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();
  const onRefresh = () => {
    dispatch(getNewMailFlow());
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Button onPress={onRefresh} title="refresh" />,
    });
  }, [props.navigation]);

  const listData = Object.values(mainState.mail);

  const renderItem = ({ item }) => <EmailCell email={item} />;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={listData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const EmailCell = (props: { email: LocalEmail }) => {
  let fromName;
  let fromEmail;
  if (props.email?.fromJSON) {
    const from = JSON.parse(props.email?.fromJSON);
    fromName = from[0].name;
    fromEmail = from[0].address;
  }
  return (
    <View style={{ padding: 10 }}>
      <Text>{props.email.subject}</Text>
      <Text>{fromName}</Text>
      <Text>{fromEmail}</Text>
    </View>
  );
};
