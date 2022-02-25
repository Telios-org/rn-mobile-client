import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';
import { IconButton } from './IconButton';

export type NavIconButtonProps = {
  icon: { name: string; size?: number; color?: string };
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  padLeft?: boolean;
  padRight?: boolean;
};
export const NavIconButton = (props: NavIconButtonProps) => (
  <IconButton
    onPress={props.onPress}
    name={props.icon.name}
    size={props.icon.size || 26}
    color={props.icon.color || colors.inkDarker}
    loading={props.loading}
    style={{
      paddingLeft: props.padLeft ? spacing.md : spacing.xs,
      paddingRight: props.padRight ? spacing.md : spacing.xs,
      alignSelf: 'stretch',
    }}
  />
);
