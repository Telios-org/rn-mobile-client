import React, { useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Modalize } from 'react-native-modalize';
import { RootStackParams } from '../../navigators/Navigator';
import { colors } from '../../util/colors';
import { fonts } from '../../util/fonts';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// @ts-ignore
import envApi from '../../../env_api.json';
import { Icon } from '../../components/Icon';
import { randomLetters, randomWords } from '../../util/randomNames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MultiSelectInput } from '../../components/MultiSelectInput';
import { InputModal } from '../../components/InputModal';
import { validateEmail } from '../../util/regexHelpers';
import { useSelector } from 'react-redux';
import { aliasesForwardAddressesSelector } from '../../store/selectors/aliases';
import styles from './styles';
import { registerAlias } from '../../store/thunks/aliases';

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

export const NewAliasScreen = ({ navigation, route }: NewAliasScreenProps) => {
  const namespace = route.params.namespace;
  const dispatch = useAppDispatch();
  const mail = useAppSelector(state => state.mail);
  const existingForwardingAddresses = useSelector(
    aliasesForwardAddressesSelector,
  );

  // TODO: dev vs prod switch
  const emailPostfix = envApi.devMail;

  const inputModalRef = useRef<Modalize>(null);

  const [forwardingAddresses, setForwardingAddresses] = useState<string[]>(
    existingForwardingAddresses,
  );

  const onMoreInfo = () => {
    Alert.alert('Not implemented');
  };

  const onSubmit = async (
    values: NewAliasFormValues,
    actions: FormikHelpers<NewAliasFormValues>,
  ) => {
    const mailboxId = mail.mailbox?._id;
    if (!mailboxId) {
      return;
    }

    try {
      actions.setSubmitting(true);

      const fullAddress = `${namespace}#${values.alias}@${emailPostfix}`;
      console.log('registering ', fullAddress);

      const response = await dispatch(
        registerAlias({
          namespaceName: namespace,
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
        navigation.goBack();
      }
    } catch (error) {
      console.log('onSubmit error caught', error);
      Alert.alert('Error', 'An unknown error occurred. Try again later.');
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.scrollView}>
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
            <View style={styles.formikContent}>
              <Input
                value={values.alias}
                error={touched.alias ? errors.alias : undefined}
                label="Alias"
                onChangeText={handleChange('alias')}
                autoCapitalize="none"
                autoCorrect={false}
                disabled={isSubmitting}
              />
              <View style={styles.aliasLongName}>
                <Text
                  style={[fonts.small.medium, { color: colors.inkLighter }]}>
                  {namespace}
                  <Text style={{ color: colors.primaryBase }}>
                    {values.alias ? '#' + values.alias : '#'}
                  </Text>
                  {`@${emailPostfix}`}
                </Text>
              </View>
              <View style={styles.shuffleButtons}>
                <View style={styles.shuffleBtn}>
                  <Icon
                    name="shuffle-outline"
                    size={20}
                    color={colors.inkLighter}
                  />
                  <Text style={styles.shuffleBtnTitle}>Shuffle</Text>
                </View>

                <View style={styles.wordsAndLettersContainer}>
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
                    style={styles.shuffleWordsBtn}
                  />
                </View>
              </View>
              <Input
                value={values.description}
                error={touched.description ? errors.description : undefined}
                label="Description"
                placeholder="(optional)"
                onChangeText={handleChange('description')}
                disabled={isSubmitting}
                autoFocus
                style={styles.description}
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
                onChange={addresses =>
                  setFieldValue('forwardAddresses', addresses)
                }
                disabled={isSubmitting}
                style={styles.multiSelectInput}
              />
              <View style={styles.moreInfoBtnContainer}>
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
                style={styles.createBtn}
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
