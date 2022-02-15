import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { RootStackParams } from '../Navigator';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { colors } from '../util/colors';

const zxcvbn = require('zxcvbn');

export type PasswordResultsType = {
  crack_times_display: {
    offline_fast_hashing_1e10_per_second: string;
    offline_slow_hashing_1e4_per_second: string;
    online_no_throttling_10_per_second: string;
    online_throttling_100_per_hour: string;
  };
  feedback: {
    warning: string;
    suggestions: Array<string>;
  };
  password: string;
  score: number;
};

type RegisterPasswordFormValues = {
  password: string;
  verifyPassword: string;
};

const RegisterPasswordFormSchema = Yup.object().shape({
  password: Yup.string().min(4).required('Required'),
  verifyPassword: Yup.string().min(4).required('Required'),
});

export type RegisterPasswordScreenProps = NativeStackScreenProps<
  RootStackParams,
  'registerPassword'
>;

const accessoryId = 'input-password-accessory';

export const RegisterPasswordScreen = (props: RegisterPasswordScreenProps) => {
  const { code, accepted, email } = props.route.params;
  const headerHeight = useHeaderHeight();
  const modalizeRef = React.useRef<Modalize>();
  const inputRefVerify = React.useRef<TextInput>();
  const formRef = React.useRef<FormikProps<RegisterPasswordFormValues>>();

  const [formValid, setFormValid] = React.useState(false);
  const [strengthResult, setStrengthResult] = React.useState<
    undefined | PasswordResultsType
  >();

  const onSubmit = () => {
    console.log('form ref', formRef.current);
    if (!formRef.current) {
      return;
    }
    if (formRef.current.isValid && formRef.current.touched) {
      const password = formRef.current.values.password;
      console.log('submitting pw', password);
      props.navigation.navigate('registerRecoveryEmail', {
        code,
        accepted,
        email,
        password,
      });
    }
  };

  const validate = (values: RegisterPasswordFormValues) => {
    console.log('validate', values);
    let isValid = false;
    const errors: { password?: string; verifyPassword?: string } = {};
    const strength = zxcvbn(values.password) as PasswordResultsType;
    console.log('password strength', strength);
    setStrengthResult(strength);
    if (strength.score < 3) {
      errors.password = 'Too weak';
    } else {
      if (values.password !== values.verifyPassword) {
        errors.verifyPassword = 'Passwords must match';
      }
    }

    isValid = !errors.password && !errors.verifyPassword;
    if (formValid !== isValid) {
      setFormValid(isValid);
    }
    return errors;
  };

  const NextButton = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Button
        size="large"
        title="Next"
        disabled={!formValid}
        onPress={onSubmit}
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
          <Text style={fonts.title2}>{'Master Password'}</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            {
              'Set your local master password. This is used to encrypt your stuff. Don’t forget it!'
            }
          </Text>
          <Formik
            innerRef={formRef}
            initialValues={{ password: '', verifyPassword: '' }}
            validationSchema={RegisterPasswordFormSchema}
            validate={validate}
            onSubmit={onSubmit}>
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <View style={{ marginTop: spacing.lg }}>
                <Input
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  error={touched.password && errors.password}
                  label="Master Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  secureTextEntry={true}
                  iconLeft={{ name: 'lock-closed-outline' }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    console.log('next', inputRefVerify);
                    inputRefVerify.current?.focus();
                  }}
                />

                <PasswordStrengthBars
                  value={strengthResult?.score || 0}
                  style={{ marginTop: spacing.sm }}
                />

                <Input
                  ref={inputRefVerify}
                  onChangeText={handleChange('verifyPassword')}
                  onBlur={handleBlur('verifyPassword')}
                  value={values.verifyPassword}
                  error={touched.verifyPassword && errors.verifyPassword}
                  label="Confirm Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  secureTextEntry={true}
                  iconLeft={{ name: 'lock-closed-outline' }}
                  style={{ marginTop: spacing.md }}
                  inputAccessoryViewID={accessoryId}
                />

                <View
                  style={{
                    marginTop: spacing.lg,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      fonts.regular.regular,
                      {
                        flex: 1,
                        marginRight: spacing.sm,
                        color: colors.inkLighter,
                      },
                    ]}>
                    {'Time to crack password'}
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.success,
                      borderRadius: 30,
                      paddingVertical: spacing.xs,
                      paddingHorizontal: spacing.md,
                    }}>
                    <Text style={[fonts.small.medium, { color: colors.white }]}>
                      {
                        strengthResult?.crack_times_display
                          .offline_slow_hashing_1e4_per_second
                      }
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </Formik>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: spacing.sm,
            }}>
            <Button
              size="small"
              type="text"
              title="whats this?"
              onPress={() => {
                // todo show modal
                modalizeRef.current?.open();
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <NextButton />
          </View>
        </View>
      </ScrollView>

      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <View
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.xl,
            marginBottom: spacing.lg,
          }}>
          <Text style={fonts.title3}>{'Password Strength'}</Text>
          <Text
            style={[
              fonts.regular.regular,
              { marginTop: spacing.md },
            ]}>{`Password strength is estimated through pattern matching and conservative estimation, it recognizes and weighs 30k common passwords, common names and surnames according to US census data, popular English words from Wikipedia and US television and movies, and other common patterns like dates, repeats (aaa), sequences (abcd), keyboard patterns (qwertyuiop), and l33t speak.\nTime to crack is estimated for an offline attack, multiple attackers, proper user-unique salting, and a slow hash function with moderate work factor, such as bcrypt, scrypt, PBKDF2.`}</Text>
          <Button
            title="Done"
            style={{ marginTop: spacing.lg }}
            onPress={() => modalizeRef.current?.close()}
          />
        </View>
      </Modalize>
    </>
  );
};

const PasswordStrengthBar = (props: { color?: string }) => (
  <View
    style={{
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: props.color,
    }}
  />
);

const PasswordStrengthDivider = () => <View style={{ width: spacing.sm }} />;

const PasswordStrengthBars = (props: {
  value: number;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[{ flexDirection: 'row' }, props.style]}>
      <PasswordStrengthBar
        color={props.value >= 0 ? 'red' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 1 ? 'red' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 2 ? 'orange' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 3 ? 'yellow' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 4 ? colors.success : colors.skyLighter}
      />
    </View>
  );
};
