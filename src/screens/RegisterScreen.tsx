import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { Input, InputProps } from '../components/Input';
import * as Yup from 'yup';

import envApi from '../../env_api.json';
import { spacing } from '../util/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getNewMailMeta, registerFlow } from '../mainSlice';
import { Result } from '../util/types';

type RegisterFormValues = {
  betaCode: string;
  email: string;
  masterPassword: string;
  recoveryEmail: string;
  acceptedTC: boolean;
};

const RegisterFormSchema = Yup.object().shape({
  betaCode: Yup.string().required('Required'),
  email: Yup.string().required('Required'),
  masterPassword: Yup.string().required('Required'),
  recoveryEmail: Yup.string().required('Required'),
});

// TODO - break this apart into separate screens when implementing designs
// for quick iteration purposes, using one screen right now
// to get things working.

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParams,
  'register'
>;

export const RegisterScreen = (props: RegisterScreenProps) => {
  // The `state` arg is correctly typed as `RootState` already
  const storeData = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();

  const onRefresh = async () => {
    await dispatch(getNewMailMeta());
  };

  const onSubmit = async (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>,
  ) => {
    try {
      actions.setSubmitting(true);
      // const codeResult = await validateBetaCode(values.betaCode);
      // if (codeResult.type === 'error') {
      //   actions.setFieldError('betaCode', codeResult.error.message);
      //   throw codeResult.error;
      // }

      console.log('submit the form!', values);

      const fullEmail = `${values.email}@dev.telios.io`;

      await dispatch(
        registerFlow({
          email: fullEmail,
          masterPassword: values.masterPassword,
          recoveryEmail: values.recoveryEmail,
          code: values.betaCode,
        }),
      );

      // actions.setSubmitting(false);
    } catch (error) {
      console.log('onSubmit error caught', error);
      actions.setSubmitting(false);
    }
  };

  const validateBetaCode = async (
    betaCode: string,
  ): Promise<Result<{ status: number }>> => {
    try {
      console.log('verifying beta code');
      const response = await fetch(`${envApi.dev}/account/beta/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vcode: betaCode,
        }),
      });
      if (response.status === 200) {
        return { type: 'success', value: { status: response.status } };
      } else if (response.status === 400) {
        return { type: 'error', error: new Error('Invalid Code') };
      } else {
        return {
          type: 'error',
          error: new Error(`An unknown error occured ${response.status}`),
        };
      }
    } catch (error) {
      console.log(error);
      return {
        type: 'error',
        error: new Error(`An error occurred. Please try again later.`),
      };
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ margin: spacing.md }}>
        <Text>{'Beta Access'}</Text>
        <Text>
          {
            "Enter your Beta Access Code. If you don't have a beta access code please join our waitlist by visiting our website. We'll notify you with a beta access code via email as soon as we're ready for you."
          }
        </Text>
        <Formik
          initialValues={{
            betaCode: 'btester1',
            email: `justintest${Math.floor(Date.now() / 1000)}`,
            masterPassword: 'Letmein123!',
            recoveryEmail: 'justin.poliachik@gmail.com',
            acceptedTC: true,
          }}
          validationSchema={RegisterFormSchema}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValidating,
            validateField,
            isSubmitting,
          }) => (
            <View style={{ marginVertical: spacing.md }}>
              <Input
                onChangeText={handleChange('betaCode')}
                onBlur={handleBlur('betaCode')}
                value={values.betaCode}
                error={touched.betaCode && errors.betaCode}
                label="Code"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: spacing.md,
                  alignItems: 'center',
                }}>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  error={touched.email && errors.email}
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1 }}
                />
                <Text>{'@dev.telios.io'}</Text>
              </View>
              <Input
                onChangeText={handleChange('masterPassword')}
                onBlur={handleBlur('masterPassword')}
                value={values.masterPassword}
                error={touched.masterPassword && errors.masterPassword}
                label="Master Password"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ marginTop: spacing.md }}
              />
              <Input
                onChangeText={handleChange('recoveryEmail')}
                onBlur={handleBlur('recoveryEmail')}
                value={values.recoveryEmail}
                error={touched.recoveryEmail && errors.recoveryEmail}
                label="Recovery Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={{ marginTop: spacing.md }}
              />
              <Button
                onPress={handleSubmit}
                title="Submit"
                loading={isValidating || isSubmitting}
              />
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};
