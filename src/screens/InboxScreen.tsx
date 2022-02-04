import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, isToday } from 'date-fns';

import { FlatList, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { MainStackParams } from '../Navigator';
import { spacing } from '../util/spacing';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getNewMailFlow, LocalEmail } from '../mainSlice';
import { TextButton } from '../components/TextButton';
import { colors } from '../util/colors';

export type InboxScreenProps = NativeStackScreenProps<MainStackParams, 'inbox'>;

export const InboxScreen = (props: InboxScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(getNewMailFlow());
    setIsRefreshing(false);
  };

  // React.useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     headerRight: () => <TextButton onPress={onRefresh} title="refresh" />,
  //   });
  // }, [props.navigation]);

  const listData = Object.values(mainState.mail);

  const renderItem = ({ item }) => <EmailCell email={item} />;

  const renderHeader = () => {
    return (
      <View
        style={{ paddingVertical: spacing.md, paddingHorizontal: spacing.md }}>
        {listData.length === 0 && <Text>{'no mail to display'}</Text>}
        <Text>{`${mainState.mailMeta?.length || 0} messages to download`}</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={listData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={ItemSeparator}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

const ItemSeparator = () => <View style={{ height: spacing.md }} />;

const EmailCell = (props: { email: LocalEmail }) => {
  let fromName;
  let fromEmail;
  if (props.email?.fromJSON) {
    const from = JSON.parse(props.email?.fromJSON);
    fromName = from[0].name;
    fromEmail = from[0].address;
  }
  const isUnread = !!props.email.unread;

  const date = new Date(props.email.date);
  const dateFormatted = format(date, 'LLL do');
  const timeFormatted = format(date, 'p');
  const displayDate = isToday(date) ? timeFormatted : dateFormatted;
  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
      }}>
      <View
        style={{
          backgroundColor: colors.gray300,
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
      />
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.gray800,
                fontWeight: '600',
                fontSize: 16,
              }}>
              {fromName}
            </Text>
          </View>
          <Text style={{ color: colors.gray600, maxWidth: 100, fontSize: 12 }}>
            {displayDate}
          </Text>
        </View>
        <Text style={{ fontSize: 14, marginTop: 2 }}>
          {props.email.subject}
        </Text>
        <Text numberOfLines={1} style={{ color: colors.gray600 }}>
          {props.email.bodyAsText}
        </Text>
      </View>
    </View>
  );
};
