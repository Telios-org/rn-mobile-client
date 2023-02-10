import React, { ReactNode } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../util/colors';
import { fonts, textStyles } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';
import { Icon } from './Icon';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  loadingPosition?: 'left' | 'right';
  iconRight?: { name: string; size?: number; color?: string };
  iconLeft?: { name: string; size?: number; color?: string };
  renderCustomRightView?: () => ReactNode;
}

export interface LabelProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
}

export const Label = ({ label, labelStyle }: LabelProps) => {
  if (!label) {
    return null;
  }
  return (
    <Text
      style={[
        fonts.regular.bold,
        { color: colors.inkDarkest, marginBottom: spacing.sm },
        labelStyle,
      ]}>
      {label}
    </Text>
  );
};

export const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    style,
    textInputStyle,
    label,
    error,
    disabled,
    loading,
    loadingPosition = 'right',
    iconRight,
    iconLeft,
    labelStyle,
    renderCustomRightView,
    ...restOfProps
  } = props;

  const [focused, setFocused] = React.useState(false);

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <View style={style}>
      {label ? <Label label={label} labelStyle={labelStyle} /> : null}
      <View>
        <TextInput
          ref={ref}
          style={[
            {
              backgroundColor: disabled ? colors.skyLighter : colors.white,
              paddingVertical: spacing.sm,
              paddingLeft: iconLeft ? 45 : spacing.md,
              paddingRight: iconRight ? 45 : spacing.md,
              minHeight: 55,
              borderWidth: 2,
              borderColor: focused
                ? colors.primaryBase
                : error
                ? colors.error
                : colors.skyBase,
              borderRadius: borderRadius,
              fontSize: textStyles.sizes.regular,
              fontWeight: textStyles.weights.regular,
              color: textStyles.defaultColor,
            },
            textInputStyle,
          ]}
          editable={!disabled}
          {...restOfProps}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          {loading && loadingPosition === 'left' ? (
            <ActivityIndicator />
          ) : iconLeft ? (
            <Icon
              name={iconLeft.name}
              size={iconLeft.size || 24}
              color={iconLeft.color || colors.skyDark}
            />
          ) : null}
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          {renderCustomRightView ? (
            renderCustomRightView()
          ) : loading && loadingPosition === 'right' ? (
            <ActivityIndicator />
          ) : iconRight ? (
            <Icon
              name={iconRight.name}
              size={iconRight.size || 24}
              color={iconRight.color || colors.skyDark}
            />
          ) : null}
        </View>
      </View>

      {error ? (
        <View style={{ marginTop: spacing.sm }}>
          <Text style={[fonts.regular.medium, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
});
