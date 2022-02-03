import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}
export const TextButton = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={props.loading}
      style={[
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          opacity: props.loading ? 0.5 : 1,
        },
        props.style,
      ]}
      onPress={props.onPress}>
      {props.loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ color: colors.primary, fontWeight: '800' }}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
