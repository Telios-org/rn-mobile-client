import React, { createRef } from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { FormikProps } from 'formik';
import Toast from 'react-native-toast-message';

import { ProfileStackParams, RootStackParams } from '../../Navigator';
import { ContactHeader } from '../ContactDetail/components/ContactHeader';
import { ContactForm } from '../../components/ContactForm';
import { Button } from '../../components/Button';

import { createContacts, getAllContacts } from '../../store/thunks/contacts';
import { useAppDispatch } from '../../hooks';

import { isIOS } from '../../util/platform';
import { Contact } from '../../store/types';
import styles from './styles';

export type NewContactProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParams, 'newContact'>,
  NativeStackScreenProps<RootStackParams>
>;

export const NewContact = ({ navigation }: NewContactProps) => {
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const formRef = createRef<FormikProps<Contact>>();

  const showToast = (type, errorMessage) =>
    Toast.show({
      type: type,
      text1: errorMessage,
    });

  const handleSaveAction = async (values: Contact) => {
    try {
      await dispatch(
        createContacts({
          contactList: [values],
        }),
      ).unwrap();
      dispatch(getAllContacts());
      showToast('success', 'Contact saved with successful.');
      navigation.goBack();
    } catch (e) {
      const errorMessage =
        e?.message ||
        "The contact wasn't saved successfully, please try again.";
      showToast('error', errorMessage);
    }
  };

  const headerComponent = (email: string, name: string) => (
    <ContactHeader
      navigation={navigation}
      email={email}
      name={name}
      isEditing={true}
    />
  );

  const handleSubmit = () => formRef.current?.handleSubmit();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        contentContainerStyle={styles.flex1}
        keyboardVerticalOffset={headerHeight}
        behavior={isIOS ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View>
            <ContactForm
              isEditing={true}
              innerRef={formRef}
              contact={{
                email: '',
                givenName: '',
                familyName: '',
                contactId: '',
              }}
              onSubmit={handleSaveAction}
              headerComponent={headerComponent}
            />
            <Button
              size="large"
              style={styles.button}
              title="Save"
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
