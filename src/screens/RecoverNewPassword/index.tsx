import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { RegisterStackParams, RootStackParams } from '../../Navigator';
import { fonts } from '../../util/fonts';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import { PasswordStrengthBars } from '../../components/PasswordStrengthBars';
import styles from './styles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { recoveryPassFlow } from '../../store/account';
import { CompositeScreenProps } from '@react-navigation/native';

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

export type RegisterPasswordScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RegisterStackParams, 'recoverNewPassword'>,
  NativeStackScreenProps<RootStackParams>
>;

export default ({ route, navigation }: RegisterPasswordScreenProps) => {
  const { passphrase } = route.params;
  const dispatch = useAppDispatch();
  const email = useAppSelector(state => state.account.lastUsername);
  const headerHeight = useHeaderHeight();
  const modalizeRef = useRef<Modalize>(null);
  const inputRefVerify = useRef<TextInput>(null);
  const formRef = useRef<FormikProps<RegisterPasswordFormValues>>(null);
  const [formValid, setFormValid] = useState(false);
  const [strengthResult, setStrengthResult] = useState<PasswordResultsType>();

  const onSubmit = async () => {
    if (!formRef.current) {
      return;
    }
    if (
      formRef.current.isValid &&
      formRef.current.touched &&
      formRef.current.values.password &&
      email
    ) {
      const newPass = formRef.current.values.password;
      try {
        formRef.current.setSubmitting(true);
        await dispatch(
          recoveryPassFlow({ newPass, email, passphrase }),
        ).unwrap();
        formRef.current.setSubmitting(false);
        navigation.navigate('login');
      } catch (e: any) {
        Alert.alert('Error', 'Your passphrase was invalid, please try again.');
        navigation.goBack();
        formRef.current.setSubmitting(false);
      }
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

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          { marginTop: headerHeight },
          styles.scrollViewContent,
        ]}>
        <View style={styles.content}>
          <Text style={fonts.title2}>Enter New Password</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.sm }]}>
            Set your local master password. This is used to encrypt your stuff.
            Don’t forget it!
          </Text>
          <Formik
            innerRef={formRef}
            initialValues={{ password: '', verifyPassword: '' }}
            validationSchema={RegisterPasswordFormSchema}
            validate={validate}
            onSubmit={onSubmit}>
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={{ marginTop: spacing.lg }}>
                  <Input
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    error={
                      touched.password && errors.password
                        ? errors.password
                        : undefined
                    }
                    label="New Master Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    secureTextEntry
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
                    error={
                      touched.verifyPassword && errors.verifyPassword
                        ? errors.verifyPassword
                        : undefined
                    }
                    label="Confirm New Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    secureTextEntry={true}
                    iconLeft={{ name: 'lock-closed-outline' }}
                    style={{ marginTop: spacing.md }}
                  />

                  <View style={styles.timeCrack}>
                    <Text style={styles.timeCrackText}>
                      {'Time to crack password'}
                    </Text>
                    {!!values.password && (
                      <View style={styles.strength}>
                        <Text
                          style={[fonts.small.medium, { color: colors.white }]}>
                          {
                            strengthResult?.crack_times_display
                              .offline_slow_hashing_1e4_per_second
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.whatsThis}>
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
                <View style={styles.nextBtnContainer}>
                  <Button
                    size="large"
                    title="Next"
                    disabled={!formValid}
                    onPress={onSubmit}
                    loading={isSubmitting}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>

      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <View style={styles.modalContainer}>
          <Text style={fonts.title3}>Password Strength</Text>
          <Text style={[fonts.regular.regular, { marginTop: spacing.md }]}>
            Password strength is estimated through pattern matching and
            conservative estimation, it recognizes and weighs 30k common
            passwords, common names and surnames according to US census data,
            popular English words from Wikipedia and US television and movies,
            and other common patterns like dates, repeats (aaa), sequences
            (abcd), keyboard patterns (qwertyuiop), and l33t speak. Time to
            crack is estimated for an offline attack, multiple attackers, proper
            user-unique salting, and a slow hash function with moderate work
            factor, such as bcrypt, scrypt, PBKDF2.
          </Text>
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
