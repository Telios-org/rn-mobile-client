import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import * as Yup from 'yup';

import { spacing } from '../util/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import { RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { SingleSelectInput } from '../components/SingleSelectInput';
import { loginFlow } from '../store/thunks/account';

const SYNC_EXISTING = 'sync_existing';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginFormSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParams,
  'register'
>;

export const LoginScreen = (props: LoginScreenProps) => {
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();

  const { localUsernames, lastUsername } = useAppSelector(
    state => state.account,
  );

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>,
  ) => {
    try {
      actions.setSubmitting(true);

      const loginResponse = await dispatch(
        loginFlow({ email: values.email, password: values.password }),
      );
      if (loginResponse.type === loginFlow.rejected.type) {
        actions.setSubmitting(false);
        Alert.alert('Login Failed', 'Invalid login credentials');
      }
    } catch (error) {
      console.log('onSubmit error caught', error);
      Alert.alert('Error', 'An unknown error occurred. Try again later.');
      actions.setSubmitting(false);
    }
  };

  const onSyncExistingAccount = () => {
    // todo navigate
    Alert.alert('Not implemented yet');
  };

  const onForgotPassword = () => {
    props.navigation.navigate('register', {
      screen: 'forgotPassword',
    });
  };

  const onRegisterNewAccount = () => {
    props.navigation.navigate('register');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={{ marginTop: headerHeight }}>
      <View
        style={{
          marginVertical: spacing.xxl,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: 'logo-no-text' }}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      </View>
      <View style={{ marginHorizontal: spacing.lg }}>
        <Text style={fonts.title2}>{'Welcome Back'}</Text>
        <Text style={fonts.regular.regular}>{'Log in with your account'}</Text>
        <Formik
          initialValues={{
            email: lastUsername || '',
            password: '',
          }}
          validationSchema={LoginFormSchema}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValidating,
            isSubmitting,
            setFieldValue,
          }) => (
            <View style={{ marginVertical: spacing.xl }}>
              <SingleSelectInput
                modalTitle="Select Account"
                options={[
                  ...localUsernames.map(username => ({
                    label: username,
                    value: username,
                  })),
                  {
                    label: 'Sync from another device',
                    value: SYNC_EXISTING,
                    rightIcon: {
                      name: 'arrow-down-circle-outline',
                      color: colors.primaryBase,
                    },
                    labelStyle: { color: colors.primaryBase },
                  },
                ]}
                value={values.email}
                error={touched.email && errors.email ? errors.email : undefined}
                onSelect={value => {
                  if (value === SYNC_EXISTING) {
                    onSyncExistingAccount();
                  } else {
                    setFieldValue('email', value);
                  }
                }}
              />

              <Input
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={
                  touched.password && errors.password
                    ? errors.password
                    : undefined
                }
                label="Master Password"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                secureTextEntry={true}
                iconLeft={{ name: 'lock-closed-outline' }}
                style={{ marginVertical: spacing.md }}
                returnKeyType="go"
                onSubmitEditing={() => handleSubmit()}
              />
              {lastUsername && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Button
                    onPress={onForgotPassword}
                    size="small"
                    type="text"
                    title="Forgot Password"
                  />
                </View>
              )}
              <Button
                style={{ marginTop: spacing.xl }}
                onPress={handleSubmit}
                title="Login"
                loading={isValidating || isSubmitting}
              />
              <Button
                style={{ marginTop: spacing.md }}
                size="small"
                type="text"
                onPress={onSyncExistingAccount}
                title="I have an account on another device"
              />
              <Button
                style={{ marginTop: spacing.sm }}
                size="small"
                type="text"
                onPress={onRegisterNewAccount}
                title="Create a new account"
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};
