import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  labelText: {
    ...fonts.regular.medium,
    color: colors.inkDarkest,
    marginBottom: spacing.sm,
  },
  dropdownBtn: {
    paddingVertical: spacing.sm,
    minHeight: 55,
    borderWidth: 2,
    borderRadius: borderRadius,
    flexDirection: 'row',
  },
  dropdownBtnContent: { flex: 1, justifyContent: 'center' },
  leftIconContainer: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type DropdownInputProps = {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  iconLeft?: { name: string; size?: number; color?: string };
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

export const DropdownInput = (props: DropdownInputProps) => {
  return (
    <View style={props.style}>
      {props.label ? <Text style={styles.labelText}>{props.label}</Text> : null}
      <TouchableOpacity
        style={[
          styles.dropdownBtn,
          {
            backgroundColor: props.disabled ? colors.skyLighter : colors.white,
            paddingLeft: props.iconLeft ? 45 : spacing.md,
            borderColor: props.error ? colors.error : colors.skyBase,
          },
          props.buttonStyle,
        ]}
        onPress={props.onPress}>
        <View style={styles.dropdownBtnContent}>
          {props.value ? (
            <Text style={fonts.regular.regular}>{props.value}</Text>
          ) : (
            <Text style={[fonts.regular.regular, { color: colors.skyBase }]}>
              {props.placeholder}
            </Text>
          )}
        </View>
        <View style={styles.leftIconContainer}>
          <Icon name="chevron-down-outline" size={22} color={colors.skyBase} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
