import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, formatISO, isToday } from 'date-fns';

import { Alert, FlatList, ScrollView, Text, View } from 'react-native';
import { MainStackParams, RootStackParams } from '../Navigator';
import { TextInput } from 'react-native-gesture-handler';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { OutgoingEmail, sendEmail } from '../mainSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button } from '../components/Button';

export type ComposeScreenProps = NativeStackScreenProps<
  RootStackParams,
  'compose'
>;

export const ComposeScreen = (props: ComposeScreenProps) => {
  const mainState = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();

  const [isSending, setIsSending] = React.useState(false);

  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');

  const onSend = async () => {
    if (!to || !subject || !body || !mainState.mailbox || isSending) {
      Alert.alert(
        'Error',
        `missing one of: to-${to} sub-${subject} body-${body} mailbox-${!!mainState.mailbox} isSending-${isSending}`,
      );
      return;
    }

    setIsSending(true);

    const email: OutgoingEmail = {
      from: [{ address: mainState.mailbox.address }],
      to: [{ address: to }],
      subject: subject,
      date: formatISO(new Date()),
      cc: [],
      bcc: [],
      bodyAsText: body,
      bodyAsHTML: body,
      attachments: [],
    };

    const response = await dispatch(sendEmail({ email }));

    setIsSending(false);
    if (response.type === sendEmail.rejected.type) {
      const { meta, ...restOfAction } = response;
      Alert.alert('Error', JSON.stringify(restOfAction));
    } else {
      props.navigation.goBack();
    }
  };

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Button
          type="text"
          size="small"
          onPress={() => props.navigation.goBack()}
          title="cancel"
        />
      ),
      headerRight: () => (
        <Button
          type="text"
          size="small"
          onPress={onSend}
          title="send"
          loading={isSending}
        />
      ),
    });
  }, [props.navigation, to, subject, body, isSending]); // TODO: is this going to cause performance issues?

  console.log(
    `to-${to} sub-${subject} body-${body} mailbox-${!!mainState.mailbox} isSending-${isSending}`,
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: spacing.sm,
          borderBottomColor: colors.gray300,
          borderBottomWidth: 1,
          paddingHorizontal: spacing.md,
          height: 50,
          alignItems: 'center',
        }}>
        <Text>{'To:'}</Text>
        <TextInput
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          multiline={false}
          style={{
            paddingHorizontal: spacing.md,
            height: '100%',
            flex: 1,
          }}
          value={to}
          onChangeText={value => setTo(value)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: spacing.sm,
          borderBottomColor: colors.gray300,
          borderBottomWidth: 1,
          paddingHorizontal: spacing.md,
          height: 50,
          alignItems: 'center',
        }}>
        <Text>{'Subject:'}</Text>
        <TextInput
          multiline={false}
          style={{
            paddingHorizontal: spacing.md,
            height: '100%',
            flex: 1,
          }}
          value={subject}
          onChangeText={value => setSubject(value)}
        />
      </View>
      <TextInput
        multiline={true}
        value={body}
        onChangeText={value => setBody(value)}
        style={{
          paddingHorizontal: spacing.md,
          marginVertical: spacing.md,
          backgroundColor: colors.white,
          flex: 1,
        }}
      />
    </View>
  );
};
