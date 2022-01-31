import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { Input, InputProps } from '../components/Input';
import * as Yup from 'yup';

import { spacing } from '../util/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../App';
import { useAppDispatch, useAppSelector } from '../hooks';
import { accountLogin, getNewMailMeta, registerFlow } from '../mainSlice';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginFormSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export type LoginScreenProps = NativeStackScreenProps<RootStackParams, 'login'>;

export const LoginScreen = (props: LoginScreenProps) => {
  // The `state` arg is correctly typed as `RootState` already
  const storeData = useAppSelector(state => state.main);
  const dispatch = useAppDispatch();

  const onRefresh = async () => {
    await dispatch(getNewMailMeta());
  };

  const onSubmit = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>,
  ) => {
    try {
      actions.setSubmitting(true);

      await dispatch(
        accountLogin({
          email: values.email,
          password: values.password,
        }),
      );

      await dispatch(getNewMailMeta());

      actions.setSubmitting(false);
    } catch (error) {
      console.log('onSubmit error caught', error);
      actions.setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ margin: spacing.md }}>
        <Text>{'Login'}</Text>
        <Formik
          initialValues={{
            email: '',
            password: 'Letmein123!',
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
            validateField,
            isSubmitting,
          }) => (
            <View style={{ marginVertical: spacing.md }}>
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

              <Input
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={touched.password && errors.password}
                label="Password"
                autoCapitalize="none"
                autoCorrect={false}
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

        <Button onPress={onRefresh} title="Refresh" />
      </View>
    </ScrollView>
  );
};
