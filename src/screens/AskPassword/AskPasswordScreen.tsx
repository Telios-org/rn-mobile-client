import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import { Input } from '../../components/Input';
import { accountLogin } from '../../store/thunks/account';
import { showToast } from '../../util/toasts';
import { selectLastUsername } from '../../store/selectors/account';
import { RootStackParams } from '../../navigators/Navigator';
import { Button } from '../../components/Button';

type AskMasterPasswordScreenProps = NativeStackScreenProps<
  RootStackParams,
  'askMasterPassword'
>;

export default ({ navigation }: AskMasterPasswordScreenProps) => {
  const dispatch = useDispatch();
  // const displayName = useSelector(selectAccountDisplayName);
  const email = useSelector(selectLastUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  const onPressLogin = async () => {
    try {
      setIsSubmitting(true);
      if (password && email) {
        const resp = await dispatch(
          accountLogin({ email, password: password }),
          // @ts-ignore
        ).unwrap();
        if (resp.accountId) {
          setIsSubmitting(false);
          navigation.goBack();
        }
      } else {
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log('error', error);
      showToast('error', 'Invalid master password.');
    }
  };
  return (
    <View
      style={{
        flex: 1,
        margin: spacing.lg,
        marginTop: 100,
      }}>
      <Text style={fonts.title2}>Enter Master Key</Text>
      <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
        {`Please enter master password of ${email} account.`}
      </Text>
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
        returnKeyType="go"
        iconLeft={{ name: 'lock-closed-outline' }}
        onSubmitEditing={onPressLogin}
      />
      <Button
        style={{
          marginTop: spacing.xl,
          position: 'absolute',
          bottom: 15,
          width: '100%',
        }}
        onPress={onPressLogin}
        title="Login"
        loading={isSubmitting}
      />
    </View>
  );
};
