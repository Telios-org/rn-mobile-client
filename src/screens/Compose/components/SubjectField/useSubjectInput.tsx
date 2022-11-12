import React, { useRef, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import SubjectField, { SubjectFieldProps } from './index';
import { StyleProp, ViewStyle } from 'react-native';

interface SubjectInputOptions {
  subject: string;
  subjectInput: React.ReactNode;
  subjectInputRef: React.RefObject<TextInput>;
}
export default (
  initialSubject?: string,
  subjectStyles?: StyleProp<ViewStyle>,
  onSubmitEditing?: SubjectFieldProps['onSubmitEditing'],
): SubjectInputOptions => {
  const subjectInputRef = useRef<TextInput>(null);
  const [subject, setSubject] = useState(initialSubject || '');

  const subjectInput = (
    <SubjectField
      ref={subjectInputRef}
      initialSubject={initialSubject}
      containerStyle={subjectStyles}
      onSubmitEditing={onSubmitEditing}
      onEndEditing={setSubject}
    />
  );

  return {
    subject,
    subjectInputRef,
    subjectInput,
  };
};
