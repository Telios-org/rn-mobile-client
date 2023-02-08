import React from 'react';
import { Text, View, TextInputProps } from 'react-native';

import { Input, Label } from '../Input';
import styles from './styles';

type ContactFieldProps = TextInputProps & {
  label: string;
  error?: string;
  style?: object;
  isEditing?: boolean;
};

const ContactField = (props: ContactFieldProps) => {
  const {
    label,
    value,
    error,
    style = {},
    isEditing = false,
    ...restOfProps
  } = props;
  return (
    <View style={[styles.textInputContainer, style]}>
      <Label labelStyle={styles.label} label={label} />
      {isEditing ? (
        <Input
          textInputStyle={styles.textInput}
          value={value}
          error={error}
          autoCapitalize="none"
          autoCorrect={false}
          {...restOfProps}
        />
      ) : (
        <Text style={styles.text}>{value}</Text>
      )}
    </View>
  );
};

export default ContactField;
