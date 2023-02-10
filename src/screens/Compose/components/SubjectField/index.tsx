import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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
export interface SubjectFieldHandle {
  getText: () => string;
  focus: () => void;
}
export default forwardRef<SubjectFieldHandle, SubjectFieldProps>(
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
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(subjectInputRef, () => ({
      getText: () => value,
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <>
        <View style={[styles.container, containerStyle]}>
          <Text style={fonts.regular.medium}>{prefix}</Text>
          <TextInput
            ref={inputRef}
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
