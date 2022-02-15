import React from 'react';
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
  textInputStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  iconRight?: { name: string; size?: number; color?: string };
}
export const Input = (props: InputProps) => {
  const { style, textInputStyle, label, error, ...restOfProps } = props;

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
      {label ? (
        <Text
          style={[
            fonts.regular.medium,
            { color: colors.inkDarkest, marginBottom: spacing.sm },
          ]}>
          {label}
        </Text>
      ) : null}
      <View>
        <TextInput
          style={[
            {
              backgroundColor: colors.white,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              minHeight: 55,
              borderWidth: 2,
              borderColor: focused ? colors.primaryBase : colors.skyBase,
              borderRadius: borderRadius,
              fontSize: textStyles.sizes.regular,
              fontWeight: textStyles.weights.regular,
              color: textStyles.defaultColor,
            },
            textInputStyle,
          ]}
          {...restOfProps}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: spacing.md,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}>
          {props.loading ? (
            <ActivityIndicator />
          ) : props.iconRight ? (
            <Icon
              name={props.iconRight.name}
              size={props.iconRight.size || 24}
              color={props.iconRight.color || colors.skyDark}
            />
          ) : null}
        </View>
      </View>

      {error ? <Text>{error}</Text> : null}
    </View>
  );
};
