import React, { useState } from 'react';
import { Text } from 'react-native';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import ScrollableContainer from '../../components/ScrollableContainer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SyncStackParams } from '../../navigators/Sync';
import NextButton from '../../components/NextButton';
import { Input } from '../../components/Input';

type SyncMasterPasswordScreenProps = NativeStackScreenProps<
  SyncStackParams,
  'syncMasterPassword'
>;

export default ({ navigation, route }: SyncMasterPasswordScreenProps) => {
  const { syncData } = route.params;
  const [password, setPassword] = useState('');
  const onPressNext = () => {
    navigation.navigate('syncPending', {
      masterPassword: password,
      syncData,
    });
  };
  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Enter Master Key</Text>
      {syncData?.email && (
        <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
          {`Please enter master password of ${syncData.email} account.`}
        </Text>
      )}
      <Input
        style={{ marginTop: spacing.md }}
        onChangeText={setPassword}
        value={password}
        label="Master Password"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        autoComplete="password"
        secureTextEntry={true}
        iconLeft={{ name: 'lock-closed-outline' }}
      />
      <NextButton onSubmit={onPressNext} disabled={!(password.length > 5)} />
    </ScrollableContainer>
  );
};
