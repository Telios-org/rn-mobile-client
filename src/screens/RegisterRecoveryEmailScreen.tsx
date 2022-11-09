import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Keyboard, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RegisterStackParams } from '../navigators/Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { validateEmail } from '../util/regexHelpers';
import { useAppDispatch } from '../hooks';
import { registerFlow } from '../store/thunks/account';

export type RegisterRecoveryEmailScreenProps = NativeStackScreenProps<
  RegisterStackParams,
  'registerRecoveryEmail'
>;

export const RegisterRecoveryEmailScreen = (
  props: RegisterRecoveryEmailScreenProps,
) => {
  const { email, password } = props.route.params;

  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerBackVisible: !loadingSubmit,
    });
  }, [loadingSubmit]);

  useEffect(() => {
    if (loadingSubmit && !showLoadingText) {
      setTimeout(() => {
        setShowLoadingText(true);
      }, 2000);
    }
  }, [loadingSubmit]);

  const isValid = recoveryEmail && validateEmail(recoveryEmail);

  const onSubmit = async () => {
    if (!isValid) {
      return;
    }
    Keyboard.dismiss();
    setLoadingSubmit(true);
    try {
      const registerResponse = await dispatch(
        registerFlow({
          email: email,
          masterPassword: password,
          recoveryEmail: recoveryEmail,
        }),
      );
      if (registerResponse.type === registerFlow.fulfilled.type) {
        // on success, Navigator will auto-transition into authenticated space.
        props.navigation.navigate('registerSuccess');
      } else {
        Alert.alert('Error', 'An error occurred');
        setLoadingSubmit(false);
      }
    } catch (e) {
      setLoadingSubmit(false);
    }
  };

  const NextButton = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Button
        size="block"
        title="Register"
        disabled={!isValid}
        onPress={onSubmit}
        loading={loadingSubmit}
      />
    </View>
  );

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{ marginTop: headerHeight, flexGrow: 1 }}>
        <View style={{ margin: spacing.lg, flex: 1 }}>
          <Text style={fonts.title2}>{'Recovery Email'}</Text>

          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            {
              'This email address can be used to retrieve your encrypted data (if you opted to store your encrypted data on our cloud backup).'
            }
          </Text>
          <Input
            style={{ marginTop: spacing.lg }}
            onChangeText={value => setRecoveryEmail(value)}
            value={recoveryEmail}
            error={isValid || !recoveryEmail ? undefined : 'Invalid email'}
            label="Recovery Email"
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            iconLeft={{
              name: 'mail-outline',
            }}
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            disabled={loadingSubmit}
          />

          <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
            {showLoadingText && (
              <View style={{ marginBottom: spacing.lg }}>
                <Text style={fonts.large.medium}>
                  {'Connecting to peer network...'}
                </Text>
                <Text
                  style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
                  {'This may take several seconds'}
                </Text>
              </View>
            )}
            <NextButton />
          </View>
        </View>
      </ScrollView>
    </>
  );
};
