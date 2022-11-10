import { Text } from 'react-native';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import React from 'react';
import ScrollableContainer from '../../components/ScrollableContainer';
import { Button } from '../../components/Button';
import { colors } from '../../util/colors';
import { SyncStackParams } from '../../navigators/Sync';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParams } from '../../navigators/Navigator';

type SyncAccountScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SyncStackParams, 'syncAccount'>,
  NativeStackScreenProps<RootStackParams>
>;

export default ({ navigation }: SyncAccountScreenProps) => {
  const onPressScanQR = () => {
    navigation.navigate('syncQrCode');
  };
  const onPressEnterKey = () => {
    navigation.navigate('syncPublicCode');
  };

  const onPressNotLoggedIn = () => {
    navigation.navigate('recoveryAccount');
  };

  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Sync Account</Text>
      <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
        While logged in on another device, navigate to ‘Sync New Device’
      </Text>
      <Button
        title="Scan QR Code"
        onPress={onPressScanQR}
        style={{ marginTop: spacing.xl }}
        iconLeft={{ name: 'camera-outline', color: 'white', size: 26 }}
      />
      <Button
        type="outline"
        title="Enter Key Manually"
        onPress={onPressEnterKey}
        style={{ marginTop: spacing.lg }}
        iconLeft={{ name: 'ios-pencil-sharp', color: colors.primaryBase }}
      />
      <Button
        style={{ marginTop: spacing.xxl }}
        size="small"
        type="text"
        title="I’m not logged in on any other devices"
        onPress={onPressNotLoggedIn}
      />
    </ScrollableContainer>
  );
};
