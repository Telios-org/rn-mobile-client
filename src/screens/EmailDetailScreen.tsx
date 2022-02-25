import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, formatISO, isToday } from 'date-fns';
import Toast from 'react-native-toast-message';

import { Alert, FlatList, ScrollView, Text, View } from 'react-native';
import {
  InboxStackParams,
  MainStackParams,
  RootStackParams,
} from '../Navigator';
import { TextInput } from 'react-native-gesture-handler';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { OutgoingEmail, saveMailToDB, sendEmail, ToFrom } from '../mainSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button } from '../components/Button';
import { fonts, textStyles } from '../util/fonts';
import { NavIconButton } from '../components/NavIconButton';

export type EmailDetailScreenProps = NativeStackScreenProps<
  InboxStackParams,
  'emailDetail'
>;

export const EmailDetailScreen = (props: EmailDetailScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();
  const userEmailAddress = mainState.mailbox?.address;

  const { emailId } = props.route.params;
  const email = mainState.mail[emailId];

  const onDelete = () => {
    Alert.alert('Not implemented');
  };

  const onToggleUnread = () => {
    Alert.alert('Not implemented');
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavIconButton
            icon={{
              name: 'mail-unread-outline',
            }}
            onPress={onToggleUnread}
            padLeft
          />
          <NavIconButton
            icon={{
              name: 'trash-outline',
            }}
            onPress={onDelete}
            padLeft
          />
        </View>
      ),
    });
  }, [props.navigation]);

  console.log('rendering emailDetail', emailId);

  if (!email) {
    return (
      <View>
        <Text>Message doesn't exist</Text>
      </View>
    );
  }

  const fromArray = JSON.parse(email.fromJSON) as Array<ToFrom>;
  const from = fromArray?.[0];

  const dayFormatted = format(new Date(email.date), 'dd MMM yyyy');
  const timeFormatted = format(new Date(email.date), 'p');
  const fullDateText = `${dayFormatted} at ${timeFormatted}`;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View style={{ margin: spacing.lg }}>
        <Text style={fonts.title3}>{email.subject}</Text>
        <View style={{ marginTop: spacing.lg }}>
          <Text>{from.name || from.address}</Text>
          <Text>{fullDateText}</Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Text style={fonts.regular.regular}>{email.bodyAsText}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
