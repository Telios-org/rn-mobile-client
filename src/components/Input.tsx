import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
}
export const Input = (props: InputProps) => {
  const { style, textInputStyle, label, error, ...restOfProps } = props;

  return (
    <View style={style}>
      {label ? <Text>{label}</Text> : null}
      <TextInput
        style={[
          {
            backgroundColor: colors.white,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 45,
          },
          textInputStyle,
        ]}
        {...restOfProps}
      />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};
