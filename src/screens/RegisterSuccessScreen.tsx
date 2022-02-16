import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
import * as Clipboard from 'expo-clipboard';

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { useAppSelector } from '../hooks';

export type RegisterSuccessScreenProps = NativeStackScreenProps<
  RootStackParams,
  'registerSuccess'
>;

export const RegisterSuccessScreen = (props: RegisterSuccessScreenProps) => {
  const headerHeight = useHeaderHeight();

  const account = useAppSelector(state => state.main.signupAccount);

  const onCopyToClipboard = () => {
    Clipboard.setString(account.mnemonic);
  };

  const onDone = () => {
    props.navigation.pop();
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
      contentContainerStyle={{
        marginTop: headerHeight + spacing.xl,
        flexGrow: 1,
      }}>
      <View style={{ margin: spacing.lg, flex: 1 }}>
        <Text style={fonts.title2}>{'Recovery Phrase'}</Text>

        <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
          {
            'In the event you lose your password or device, this phrase can be used to restore your account. Be sure to memorize this phrase or keep it somewhere secure like under your pillow.'
          }
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={fonts.small.bold}>{'For your eyes only!'}</Text>
          </View>

          <View
            style={{
              backgroundColor: colors.skyLighter,
              borderRadius: borderRadius,
              padding: spacing.md,
              marginVertical: spacing.sm,
            }}>
            <Text style={[{ flex: 1 }, fonts.large.medium]}>
              {account?.mnemonic}
            </Text>
          </View>
          <Button
            type="text"
            title="copy to clipboard"
            onPress={onCopyToClipboard}
          />
        </View>

        <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
          <Button title="I saved these words" onPress={onDone} />
        </View>
      </View>
    </ScrollView>
  );
};
