import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';
import { validateEmail } from '../util/regexHelpers';
import { useAppDispatch } from '../hooks';
import { registerFlow } from '../mainSlice';
import { Modalize } from 'react-native-modalize';

export type RegisterRecoveryEmailScreenProps = NativeStackScreenProps<
  RootStackParams,
  'registerRecoveryEmail'
>;

const accessoryId = 'input-recoveryemail-accessory';

export const RegisterRecoveryEmailScreen = (
  props: RegisterRecoveryEmailScreenProps,
) => {
  const { code, email, password } = props.route.params;

  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const [recoveryEmail, setRecoveryEmail] = React.useState('');
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  const [showLoadingText, setShowLoadingText] = React.useState(false);
  const modalizeRef = React.useRef<Modalize>();

  React.useEffect(() => {
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
          code: code,
        }),
      );
      if (registerResponse.type === registerFlow.fulfilled.type) {
        // on success, Navigator will auto-transition into authenticated space.
        props.navigation.navigate('registerSuccess');
      } else {
        console.log('error', registerResponse);
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
            inputAccessoryViewID={accessoryId}
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

      <InputAccessoryView nativeID={accessoryId}>
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
          <NextButton />
        </View>
      </InputAccessoryView>
    </>
  );
};
