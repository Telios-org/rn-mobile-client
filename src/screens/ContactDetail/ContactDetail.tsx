import React, { createRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import Toast from 'react-native-toast-message';
import { FormikProps } from 'formik';

import { ProfileStackParams, RootStackParams } from '../../Navigator';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Contact } from '../../store/types';
import {
  getAllContacts,
  getContactById,
  removeContact,
  updateContact,
} from '../../store/thunks/contacts';

import { selectedContactSelector } from '../../store/selectors/contacts';
import { ContactHeader } from './components/ContactHeader';
import { ContactForm } from '../../components/ContactForm';
import { Button } from '../../components/Button';

import { isIOS } from '../../util/platform';
import styles from './styles';

export type ContactDetailProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParams, 'contactDetail'>,
  NativeStackScreenProps<RootStackParams>
>;

export const ContactDetail = ({ navigation, route }: ContactDetailProps) => {
  const dispatch = useAppDispatch();
  const headerHeight = useHeaderHeight();
  const { contactId, editContent } = route?.params;

  const formRef = createRef<FormikProps<Contact>>();
  const [isEditing, setIsEditing] = useState<boolean>(!!editContent);

  const contactData: Contact | undefined = useAppSelector(
    selectedContactSelector,
  );

  useEffect(() => {
    dispatch(getContactById({ id: contactId }));
  }, []);

  const showToast = (type, errorMessage) =>
    Toast.show({
      type: type,
      text1: errorMessage,
    });

  const toggleEditStatus = () => setIsEditing(prev => !prev);

  const handleSaveAction = async (values: Contact) => {
    try {
      const payload = {
        id: contactData?.contactId,
        ...values,
      };
      await dispatch(updateContact(payload)).unwrap();
      dispatch(getAllContacts());
      showToast('success', 'Contact edited successfully');
      toggleEditStatus();
    } catch (e) {
      const errorMessage =
        e?.message || 'Failed to edit contact, please try again';
      showToast('error', errorMessage);
    }
  };

  const handleCancelAction = () => {
    formRef.current?.resetForm();
    toggleEditStatus();
  };

  const handleSubmit = () => formRef.current?.handleSubmit();

  const handleDeleteAction = async () => {
    try {
      await dispatch(removeContact({ id: contactId })).unwrap();
      showToast('success', 'Contact deleted successfully');
      navigation.goBack();
    } catch (e) {
      const errorMessage =
        e?.message || 'Failed to delete contact, please try again later';
      showToast('error', errorMessage);
    }
  };

  const headerComponent = (email: string, name: string) => (
    <ContactHeader
      navigation={navigation}
      email={email}
      name={name}
      isEditing={isEditing}
      onPressEdit={toggleEditStatus}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        contentContainerStyle={styles.flex1}
        keyboardVerticalOffset={headerHeight}
        behavior={isIOS ? 'padding' : 'height'}>
        <ScrollView keyboardShouldPersistTaps="always">
          <View>
            <ContactForm
              innerRef={formRef}
              contact={contactData}
              isEditing={isEditing}
              onSubmit={handleSaveAction}
              headerComponent={headerComponent}
            />
            <View style={styles.actionButtons}>
              {isEditing ? (
                <View style={styles.row}>
                  <Button
                    size="large"
                    type="outline"
                    style={[styles.cancelButton, styles.button]}
                    title="Cancel"
                    onPress={handleCancelAction}
                  />
                  <Button
                    size="large"
                    style={styles.button}
                    title="Save"
                    onPress={handleSubmit}
                  />
                </View>
              ) : (
                <Button
                  size="large"
                  type="outline"
                  style={[styles.button, styles.deteleButton]}
                  titleStyle={styles.deteleText}
                  title="Delete"
                  onPress={handleDeleteAction}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
