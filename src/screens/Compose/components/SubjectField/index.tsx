import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, StyleProp, ViewStyle } from 'react-native';
import { fonts } from '../../../../util/fonts';
import styles from './styles';

export interface SubjectFieldProps {
  prefix?: string;
  initialSubject?: string;
  onSubmitEditing?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  onEndEditing?: (subject: string) => void;
}

export default forwardRef<TextInput, SubjectFieldProps>(
  (
    {
      prefix = 'Subject',
      initialSubject,
      onEndEditing,
      onSubmitEditing,
      containerStyle,
    },
    subjectInputRef,
  ) => {
    const [value, setValue] = useState(initialSubject || '');

    return (
      <>
        <View style={[styles.container, containerStyle]}>
          <Text style={fonts.regular.medium}>{prefix}</Text>
          <TextInput
            ref={subjectInputRef}
            multiline={false}
            style={styles.textInput}
            value={value}
            onChangeText={setValue}
            returnKeyType="next"
            onSubmitEditing={onSubmitEditing}
            onBlur={() => onEndEditing && onEndEditing(value)}
          />
        </View>
      </>
    );
  },
);
