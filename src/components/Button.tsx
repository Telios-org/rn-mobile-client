import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { borderRadius, spacing } from '../util/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'block' | 'large' | 'small';
  iconPosition?: 'left' | 'right' | 'side';
  iconName?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}
export const Button = (props: ButtonProps) => {
  const {
    title,
    onPress,
    type = 'primary',
    size = 'block',
    iconPosition,
    iconName,
    disabled = false,
    loading = false,
    style,
  } = props;
  return (
    <TouchableOpacity
      disabled={loading}
      style={[
        {
          backgroundColor:
            type === 'primary'
              ? colors.primaryBase
              : type === 'secondary'
              ? colors.primaryLightest
              : null,
          paddingHorizontal: size === 'small' ? spacing.md : spacing.xl,
          paddingVertical: size === 'small' ? spacing.sm : spacing.md,
          borderRadius: 30,
          opacity: loading ? 0.5 : 1,
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          height: size === 'block' || size === 'large' ? 55 : 'auto',
          alignSelf: size === 'block' ? 'stretch' : 'auto',
          borderWidth: type === 'outline' ? 1 : 0,
          borderColor: colors.primaryBase,
        },
        style,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            fonts.regular.medium,
            {
              color: type === 'primary' ? colors.white : colors.primaryBase,
            },
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
