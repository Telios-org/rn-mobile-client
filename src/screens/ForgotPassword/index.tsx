import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './styles';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Input } from '../../components/Input';
import { useHeaderHeight } from '@react-navigation/elements';
import { Button } from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../../Navigator';

type Props = NativeStackScreenProps<RootStackParams, 'login'>;

export default ({ navigation }: Props) => {
  const headerHeight = useHeaderHeight();
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const onSubmit = () => {
    Keyboard.dismiss();
    if (recoveryPhrase) {
      navigation.navigate('register', {
        screen: 'recoverNewPassword',
        params: { passphrase: recoveryPhrase },
      });
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        { marginTop: headerHeight },
        styles.scrollViewContainer,
      ]}>
      <View style={styles.container}>
        <Text style={fonts.title2}>{'Forgot Password'}</Text>
        <Text style={styles.resetText}>
          Reset your password using the recovery phrase assigned to you during
          account registration.
        </Text>
        <KeyboardAvoidingView
          contentContainerStyle={styles.keyboardAvoidingView}
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
                // todo what to show here?
              }}
            />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.nextBtnContainer}>
          <Button
            size="block"
            title="Next"
            disabled={!recoveryPhrase}
            onPress={onSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
};
