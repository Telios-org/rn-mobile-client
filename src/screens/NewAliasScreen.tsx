import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import { RootStackParams } from '../Navigator';
import { colors } from '../util/colors';
import { borderRadius, spacing } from '../util/spacing';
import { fonts } from '../util/fonts';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import envApi from '../../env_api.json';
import { Icon } from '../components/Icon';
import { randomLetters, randomWords } from '../util/randomNames';
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerAlias, registerNamespace } from '../mainSlice';
import { MultiSelectInput } from '../components/MultiSelectInput';
import { InputModal } from '../components/InputModal';
import { validateEmail } from '../util/regexHelpers';
import { useSelector } from 'react-redux';
import { aliasesForwardAddressesSelector } from '../util/selectors';

type NewAliasFormValues = {
  alias: string;
  description?: string;
  forwardAddresses?: string[];
};

const NewAliasFormSchema = Yup.object().shape({
  alias: Yup.string().required('Required'),
  description: Yup.string(),
  forwardAddresses: Yup.array(),
});

export type NewAliasScreenProps = NativeStackScreenProps<
  RootStackParams,
  'newAlias'
>;

export const NewAliasScreen = (props: NewAliasScreenProps) => {
  const dispatch = useAppDispatch();
  const mainState = useAppSelector(state => state.main);
  const namespace = mainState.aliasNamespace;
  const existingForwardingAddresses = useSelector(
    aliasesForwardAddressesSelector,
  );

  // TODO: dev vs prod switch
  const emailPostfix = envApi.devMail;

  const inputModalRef = React.useRef<Modalize>();

  const [forwardingAddresses, setForwardingAddresses] = React.useState<
    string[]
  >(existingForwardingAddresses);

  const onMoreInfo = () => {
    Alert.alert('Not implemented');
  };

  const onSubmit = async (
    values: NewAliasFormValues,
    actions: FormikHelpers<NewAliasFormValues>,
  ) => {
    const mailboxId = mainState.mailbox._id;
    if (!mailboxId) {
      return;
    }

    try {
      actions.setSubmitting(true);

      const fullAddress = `${namespace.name}#${values.alias}@${emailPostfix}`;
      console.log('registering ', fullAddress);

      const response = await dispatch(
        registerAlias({
          namespaceName: namespace.name,
          domain: emailPostfix,
          address: values.alias,
          description: values.description,
          fwdAddresses: values.forwardAddresses || [],
          disabled: false,
        }),
      );
      actions.setSubmitting(false);
      if (response.type === registerAlias.rejected.type) {
        Alert.alert('Error', 'Unable to create alias');
      } else {
        props.navigation.goBack();
      }
    } catch (error) {
      console.log('onSubmit error caught', error);
      Alert.alert('Error', 'An unknown error occurred. Try again later.');
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <Formik
          initialValues={{
            alias: '',
          }}
          validateOnMount={true}
          validationSchema={NewAliasFormSchema}
          onSubmit={onSubmit}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <View style={{ margin: spacing.lg }}>
              <Input
                value={values.alias}
                error={touched.alias && errors.alias}
                label="Alias"
                onChangeText={handleChange('alias')}
                autoCapitalize="none"
                autoCorrect={false}
                disabled={isSubmitting}
              />
              <View
                style={{
                  backgroundColor: colors.skyLighter,
                  borderRadius: borderRadius,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  marginTop: spacing.sm,
                }}>
                <Text
                  style={[fonts.small.medium, { color: colors.inkLighter }]}>
                  {namespace.name}
                  <Text style={{ color: colors.primaryBase }}>
                    {values.alias ? '#' + values.alias : '#'}
                  </Text>
                  {`@${emailPostfix}`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing.sm,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="shuffle-outline"
                    size={20}
                    color={colors.inkLighter}
                  />
                  <Text
                    style={[
                      fonts.small.medium,
                      { color: colors.inkLighter, marginLeft: spacing.sm },
                    ]}>
                    {'Shuffle'}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Button
                    type="outline"
                    size="small"
                    title="Letters"
                    onPress={() => setFieldValue('alias', randomLetters())}
                  />
                  <Button
                    type="outline"
                    size="small"
                    title="Words"
                    onPress={() => setFieldValue('alias', randomWords())}
                    style={{ marginLeft: spacing.sm }}
                  />
                </View>
              </View>
              <Input
                value={values.description}
                error={touched.description && errors.description}
                label="Description"
                placeholder="(optional)"
                onChangeText={handleChange('description')}
                disabled={isSubmitting}
                style={{ marginTop: spacing.md }}
              />
              <MultiSelectInput
                label="Forward Addresses"
                placeholder="(optional)"
                values={values.forwardAddresses}
                options={[
                  ...forwardingAddresses.map(address => ({
                    label: address,
                    value: address,
                  })),
                  {
                    label: 'Add New',
                    value: 'ADD_NEW',
                    labelStyle: { color: colors.primaryBase },
                    rightIcon: {
                      name: 'add-outline',
                      color: colors.primaryBase,
                    },
                    onPress: () => {
                      inputModalRef.current?.open();
                    },
                  },
                ]}
                onChange={values => setFieldValue('forwardAddresses', values)}
                disabled={isSubmitting}
                style={{ marginTop: spacing.md }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: spacing.lg,
                }}>
                <Button
                  size="small"
                  type="text"
                  title="more info"
                  onPress={onMoreInfo}
                />
              </View>

              <Button
                title="Create"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={{ marginTop: spacing.lg }}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
      <InputModal
        ref={inputModalRef}
        onCancel={() => inputModalRef.current?.close()}
        onDone={value => {
          inputModalRef.current?.close();
          if (value && !forwardingAddresses.includes(value)) {
            setForwardingAddresses([...forwardingAddresses, value]);
          }
        }}
        inputProps={{
          label: 'Forwarding Email Address',
          autoCapitalize: 'none',
          autoComplete: 'email',
          autoCorrect: false,
          keyboardType: 'email-address',
        }}
        validate={value => (validateEmail(value) ? undefined : 'Invalid email')}
      />
    </>
  );
};
