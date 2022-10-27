import React, { ReactElement } from 'react';
import { Keyboard, Pressable, View } from 'react-native';

import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';

import ContactField from '../../components/ContactField';
import DatePicker from '../DataPicker';
import styles from './styles';

import { Contact } from '../../store/types';

type ContactFormProps = {
  contact?: Contact;
  isEditing?: boolean;
  onSubmit: (contact: Contact) => void;
  headerComponent?: (email: string, name: string) => ReactElement;
  innerRef?: React.Ref<FormikProps<Contact>>;
};

const ContactFormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address.').required('Required'),
  website: Yup.string().matches(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
    'Invalid URL',
  ),
});

export const ContactForm = ({
  contact,
  isEditing = false,
  onSubmit,
  headerComponent,
  innerRef,
}: ContactFormProps) => {
  const handleOnSubmit = async (
    values: Contact,
    actions: FormikHelpers<Contact>,
  ) => {
    try {
      actions.setSubmitting(true);
      onSubmit(values);
    } catch (error) {
      actions.setSubmitting(false);
    }
  };
  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <Formik
        initialValues={{ ...contact }}
        validateOnMount={true}
        validationSchema={ContactFormSchema}
        enableReinitialize
        innerRef={innerRef}
        onSubmit={handleOnSubmit}>
        {({
          handleChange,
          setFieldValue,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <View>
            {headerComponent?.(
              `${values.email}`,
              `${values.givenName} ${values.familyName}`,
            )}
            <View style={styles.content}>
              <View style={styles.row}>
                <ContactField
                  isEditing={isEditing}
                  style={styles.firstItemInRow}
                  value={values.givenName}
                  label="First Name"
                  onChangeText={handleChange('givenName')}
                />
                <ContactField
                  isEditing={isEditing}
                  style={styles.flex1}
                  value={values.familyName}
                  label="Last Name"
                  onChangeText={handleChange('familyName')}
                />
              </View>
              <ContactField
                isEditing={isEditing}
                label="Nickname"
                value={values.nickname}
                onChangeText={handleChange('nickname')}
              />
              <ContactField
                isEditing={isEditing}
                label="Email*"
                value={values.email}
                placeholder="*****@***.**"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                error={touched.email ? errors.email : undefined}
              />
              <DatePicker
                isEditing={isEditing}
                label="Birthday"
                date={values.birthday}
                placeholder="Day/Month/Year"
                onConfirm={date => setFieldValue('birthday', date.toString())}
              />
              <ContactField
                isEditing={isEditing}
                label="Address"
                value={values.address}
                placeholder="Street, City, State, ZIP / Postal code"
                onChangeText={handleChange('address')}
              />
              <ContactField
                isEditing={isEditing}
                label="Website"
                value={values.website}
                placeholder="www.example.com"
                onChangeText={handleChange('website')}
                onBlur={handleBlur('website')}
                keyboardType="url"
                error={touched.website ? errors.website : undefined}
              />
              <ContactField
                isEditing={isEditing}
                label="Phone"
                value={values.phone}
                placeholder="+1 (910) 999-9999"
                keyboardType="phone-pad"
                onChangeText={handleChange('phone')}
              />
              <ContactField
                isEditing={isEditing}
                label="Organization"
                value={values?.organization?.[0]?.name}
                onChangeText={(text: string) =>
                  setFieldValue('organization', [{ name: text }])
                }
              />
              <ContactField
                isEditing={isEditing}
                label="Notes"
                value={values.notes}
                onChangeText={handleChange('notes')}
              />
            </View>
          </View>
        )}
      </Formik>
    </Pressable>
  );
};
