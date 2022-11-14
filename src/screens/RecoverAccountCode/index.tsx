import React, { useState } from 'react';
import { Text } from 'react-native';
import ScrollableContainer from '../../components/ScrollableContainer';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import { Input } from '../../components/Input';
import NextButton from '../../components/NextButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import { getAccountSyncInfo } from '../../store/thunks/account';
import { useAppDispatch } from '../../hooks';
import { showToast } from '../../util/toasts';

type RecoverAccountCodeScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncRecoverAccountCode'
>;

export default ({ route, navigation }: RecoverAccountCodeScreenProps) => {
  const { recoveryEmail } = route.params;
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    try {
      if (code) {
        setIsLoading(true);
        const syncData: any = await dispatch(getAccountSyncInfo({ code }));
        setIsLoading(false);
        navigation.navigate('syncMasterPassword', {
          syncData: {
            driveKey: syncData.payload.drive_key,
            email: syncData.payload.email,
          },
        });
      }
    } catch (e) {
      showToast('error', 'Invalid code.');
    }
  };
  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Enter Code</Text>
      <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
        {`A recovery code has been sent to ${recoveryEmail}`}
      </Text>

      <Input
        style={{ marginTop: spacing.lg }}
        onChangeText={setCode}
        value={code}
        label="Code"
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />

      <NextButton onSubmit={onSubmit} disabled={!code} loading={isLoading} />
    </ScrollableContainer>
  );
};
