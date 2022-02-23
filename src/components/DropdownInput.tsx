import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';
import { Icon } from './Icon';

export type DropdownInputProps = {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  iconLeft?: { name: string; size?: number; color?: string };
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const DropdownInput = (props: DropdownInputProps) => {
  return (
    <View style={props.style}>
      {props.label ? (
        <Text
          style={[
            fonts.regular.medium,
            { color: colors.inkDarkest, marginBottom: spacing.sm },
          ]}>
          {props.label}
        </Text>
      ) : null}
      <TouchableOpacity
        style={{
          backgroundColor: props.disabled ? colors.skyLighter : colors.white,
          paddingVertical: spacing.sm,
          paddingLeft: props.iconLeft ? 45 : spacing.md,
          minHeight: 55,
          borderWidth: 2,
          borderColor: props.error ? colors.error : colors.skyBase,
          borderRadius: borderRadius,
          flexDirection: 'row',
        }}
        onPress={props.onPress}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {props.value ? (
            <Text style={fonts.regular.regular}>{props.value}</Text>
          ) : (
            <Text style={[fonts.regular.regular, { color: colors.skyBase }]}>
              {props.placeholder}
            </Text>
          )}
        </View>
        <View
          style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="chevron-down-outline" size={22} color={colors.skyBase} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
