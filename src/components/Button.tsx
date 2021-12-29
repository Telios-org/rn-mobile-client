import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../util/colors';
import { borderRadius, spacing } from '../util/spacing';

export interface ButtonProps {
  label: string;
  onPress: () => void;
}
export const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius,
      }}
      onPress={props.onPress}>
      <Text style={{ color: colors.white }}>{props.label}</Text>
    </TouchableOpacity>
  );
};
