import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '../../components/Input';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
// @ts-ignore
import envApi from '../../../env_api.json';
import ScrollableContainer from '../../components/ScrollableContainer';
import NextButton from '../../components/NextButton';
import styles from './styles';
import { validateEmail } from '../../util/regexHelpers';
import { RecoveryAccountStackParams } from '../../navigators/RecoveryAccount';

type RecoverAccountProps = NativeStackScreenProps<
  RecoveryAccountStackParams,
  'recoverAccount'
>;

export default ({ navigation }: RecoverAccountProps) => {
  const emailPostfix = envApi.devMail;

  const [username, setUsername] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const isValid = recoveryEmail && validateEmail(recoveryEmail);

  const teliosEmail = `${username}@${emailPostfix}`;
  console.log(teliosEmail);

  const onSubmit = () => {
    // TODO send email with recovery code
    if (recoveryEmail) {
      navigation.navigate('recoverAccountCode', { recoveryEmail });
    }
  };

  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Recover Account</Text>
      <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
        Enter your account and the recovery email you assigned at registration
      </Text>
      <Input
        style={styles.inputContainer}
        textInputStyle={styles.textInput}
        onChangeText={setUsername}
        value={username}
        label="Telios Account"
        placeholder="johndoe"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        renderCustomRightView={() => (
          <View style={styles.emailPostfix}>
            <Text style={fonts.regular.bold}>{`@${emailPostfix}`}</Text>
          </View>
        )}
      />

      <Input
        style={{ marginTop: spacing.lg }}
        onChangeText={setRecoveryEmail}
        value={recoveryEmail}
        error={isValid || !recoveryEmail ? undefined : 'Invalid email'}
        label="Recovery Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        iconLeft={{
          name: 'mail-outline',
        }}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />

      <NextButton onSubmit={onSubmit} disabled={!username || !recoveryEmail} />
    </ScrollableContainer>
  );
};
