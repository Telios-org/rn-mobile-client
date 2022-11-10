import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import ScrollableContainer from '../../components/ScrollableContainer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import NextButton from '../../components/NextButton';
import { Input } from '../../components/Input';
import { useAppDispatch } from '../../hooks';
import { getAccountSyncInfo } from '../../store/thunks/account';

type SyncPublicKeyScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncPublicCode'
>;

export default ({ navigation }: SyncPublicKeyScreenProps) => {
  const dispatch = useAppDispatch();
  const [publicCode, setPublicCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onPressNext = async () => {
    try {
      if (publicCode) {
        setIsLoading(true);
        const syncData: any = await dispatch(
          getAccountSyncInfo({ code: publicCode }),
        );
        navigation.navigate('syncMasterPassword', {
          syncData: {
            driveKey: syncData.payload.drive_key,
            email: syncData.payload.email,
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong, please try again.');
      setIsLoading(false);
    }
  };
  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Enter Key</Text>
      <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
        Enter your public key found under ‘Sync New Device’ on your other
        device.
      </Text>
      <Input
        style={{ marginTop: spacing.md }}
        onChangeText={setPublicCode}
        value={publicCode}
        label="Public Key"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        iconLeft={{ name: 'lock-closed-outline' }}
      />
      <NextButton
        loading={isLoading}
        onSubmit={onPressNext}
        disabled={!publicCode}
      />
    </ScrollableContainer>
  );
};
