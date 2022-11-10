import { StyleProp, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import styles from './styles';
import AutocompleteInput from '../../../../components/AutocompleteInput';
interface ToRecipientProps {
  recipientsPrefix?: string;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  rightComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default ({
  recipients,
  setRecipients,
  recipientsPrefix = 'To',
  rightComponent,
  style,
}: ToRecipientProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.prefix}>{recipientsPrefix}</Text>
      <AutocompleteInput
        tags={recipients}
        onChangeTags={setRecipients}
        inputStyle={styles.input}
        inputProps={{
          autoFocus: true,
          autoCorrect: false,
          autoCapitalize: 'none',
          keyboardType: 'email-address',
          textContentType: 'emailAddress',
          returnKeyType: 'next',
        }}
      />
      {rightComponent}
    </View>
  );
};
