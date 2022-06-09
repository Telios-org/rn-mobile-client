import { StyleProp, View, ViewStyle } from 'react-native';
import { spacing } from '../../util/spacing';
import { colors } from '../../util/colors';
import React from 'react';

const PasswordStrengthDivider = () => <View style={{ width: spacing.sm }} />;

const PasswordStrengthBar = (props: { color?: string }) => (
  <View
    style={{
      flex: 1,
      height: 6,
      borderRadius: 3,
      backgroundColor: props.color,
    }}
  />
);

export const PasswordStrengthBars = (props: {
  value: number;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[{ flexDirection: 'row' }, props.style]}>
      <PasswordStrengthBar
        color={props.value >= 0 ? 'red' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 1 ? 'red' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 2 ? 'orange' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 3 ? 'yellow' : colors.skyLighter}
      />
      <PasswordStrengthDivider />
      <PasswordStrengthBar
        color={props.value >= 4 ? colors.success : colors.skyLighter}
      />
    </View>
  );
};
