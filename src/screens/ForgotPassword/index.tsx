import React, { useState } from 'react';
import { View, Text, Keyboard, KeyboardAvoidingView } from 'react-native';
import styles from './styles';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NextButton from '../../components/NextButton';
import ScrollableContainer from '../../components/ScrollableContainer';
import { useHeaderHeight } from '@react-navigation/elements';
import { RecoveryAccountStackParams } from '../../navigators/RecoveryAccount';

type Props = NativeStackScreenProps<
  RecoveryAccountStackParams,
  'forgotPassword'
>;

export default ({ navigation }: Props) => {
  const headerHeight = useHeaderHeight();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const onSubmit = () => {
    Keyboard.dismiss();
    if (recoveryPhrase) {
      navigation.navigate('enterNewPassword', { passphrase: recoveryPhrase });
    }
  };

  return (
    <ScrollableContainer>
      <Text style={fonts.title2}>Forgot Password</Text>
      <Text style={styles.resetText}>
        Reset your password using the recovery phrase assigned to you during
        account registration.
      </Text>
      <KeyboardAvoidingView
        contentContainerStyle={styles.keyboardAvoidingView}
        keyboardVerticalOffset={headerHeight}
        behavior={'position'}>
        <Input
          style={styles.input}
          textInputStyle={styles.textInput}
          onChangeText={setRecoveryPhrase}
          value={recoveryPhrase}
          textAlignVertical="center"
          label="Recovery Phrase"
          placeholder="Paste full phrase here"
          placeholderTextColor={colors.inkLighter}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          returnKeyType="next"
          blurOnSubmit
        />

        <View style={styles.infoBtn}>
          <Button
            size="small"
            type="text"
            title="what if I lost my recovery phrase?"
            onPress={() => {
              navigation.navigate('recoverAccount');
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <NextButton
        disabled={!recoveryPhrase}
        onSubmit={onSubmit}
        useKeyboardAvoidingView={false}
      />
    </ScrollableContainer>
  );
};
