import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../util/colors';
import { borderRadius, spacing } from '../util/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
}
export const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={props.loading}
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius,
        opacity: props.loading ? 0.5 : 1,
        justifyContent: 'center',
        alignContent: 'center',
      }}
      onPress={props.onPress}>
      {props.loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ color: colors.white }}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};
