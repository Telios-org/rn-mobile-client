import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { Input, InputProps } from '../components/Input';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { spacing } from '../util/spacing';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../Navigator';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  accountLogin,
  getNewMailMeta,
  loginFlow,
  registerFlow,
} from '../mainSlice';
import { storage } from '../util/asyncStorage';

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
  const dispatch = useAppDispatch();

  const [loadingUsernames, setLoadingUsernames] = React.useState(false);
  const [savedUsernames, setSavedUsernames] = React.useState<string[] | null>(
    [],
  );

  const getSavedUsernames = async () => {
    setLoadingUsernames(true);
    try {
      const jsonValue = await AsyncStorage.getItem(storage.savedUsernames);
      const usernames =
        jsonValue != null ? (JSON.parse(jsonValue) as string[]) : null;
      setSavedUsernames(usernames);
      setLoadingUsernames(false);
    } catch (e) {
      // error reading value
      console.log('ERROR GETTING USERNAMES: ', e);
      setLoadingUsernames(false);
    }
  };

  React.useEffect(() => {
    getSavedUsernames();
  }, []);

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
        throw new Error('Login failed');
      }

      // actions.setSubmitting(false);
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
            email: 'justintest12@dev.telios.io',
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
            isSubmitting,
            setFieldValue,
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
              {loadingUsernames ? (
                <ActivityIndicator />
              ) : (
                savedUsernames?.map(username => (
                  <Button
                    type="text"
                    title={username}
                    style={{ marginTop: spacing.sm }}
                    onPress={() => {
                      setFieldValue('email', username);
                    }}
                  />
                ))
              )}

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
      </View>
    </ScrollView>
  );
};
