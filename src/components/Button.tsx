import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { IconAccessory } from '../util/types';
import { Icon } from './Icon';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'block' | 'large' | 'small';
  iconRight?: IconAccessory;
  iconLeft?: IconAccessory;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export const Button = (props: ButtonProps) => {
  const {
    title,
    onPress,
    type = 'primary',
    size = 'block',
    iconRight,
    iconLeft,
    disabled = false,
    loading = false,
    style,
    titleStyle,
  } = props;

  const getBgColor = () => {
    if (type === 'primary') {
      if (disabled) {
        return colors.skyBase;
      } else {
        return colors.primaryBase;
      }
    } else if (type === 'secondary') {
      if (disabled) {
        return colors.skyLighter;
      } else {
        return colors.primaryLightest;
      }
    }
    return null;
  };

  const textColor = type === 'primary' ? colors.white : colors.primaryBase;

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[
        {
          backgroundColor: getBgColor() || undefined,
          paddingHorizontal:
            type === 'text' ? 0 : size === 'small' ? spacing.md : spacing.xl,
          paddingVertical: size === 'small' ? spacing.sm : spacing.md,
          borderRadius: 30,
          opacity: loading ? 0.5 : 1,
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          height: size === 'block' || size === 'large' ? 55 : undefined,
          alignSelf: size === 'block' ? 'stretch' : 'auto',
          borderWidth: type === 'outline' ? 1 : 0,
          borderColor: colors.primaryBase,
        },
        style,
      ]}
      onPress={onPress}>
      {iconLeft && (
        <View style={{ marginRight: spacing.sm }}>
          <Icon
            name={iconLeft.name}
            color={iconLeft.color || textColor}
            size={iconLeft.size || 22}
          />
        </View>
      )}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={[
              fonts.regular.medium,
              {
                color: textColor,
              },
              titleStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
      {iconRight && (
        <View style={{ marginLeft: spacing.sm }}>
          <Icon
            name={iconRight.name}
            color={iconRight.color || textColor}
            size={iconRight.size || 22}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
