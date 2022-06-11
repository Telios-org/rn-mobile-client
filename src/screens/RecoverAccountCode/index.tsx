import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import ScrollableContainer from '../../components/ScrollableContainer';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import { Input } from '../../components/Input';
import NextButton from '../../components/NextButton';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RegisterStackParams, RootStackParams } from '../../Navigator';

type RecoverAccountCodeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RegisterStackParams, 'recoverAccountCode'>,
  NativeStackScreenProps<RootStackParams, 'register'>
>;

export default ({ route, navigation }: RecoverAccountCodeScreenProps) => {
  const { recoveryEmail } = route.params;
  const [code, setCode] = useState('');
  const onSubmit = () => {
    try {
      // TODO verify recovery code
      Alert.alert('Warning', 'Recovery by code is not implemented yet');
      // navigation.navigate('register', {
      //   screen: 'enterNewPassword',
      //   params: { hasValidCode: true },
      // });
    } catch (e) {
      Alert.alert('Error', 'Invalid code');
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

      <NextButton onSubmit={onSubmit} disabled={!code} />
    </ScrollableContainer>
  );
};
