import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { colors } from '../util/colors';
import { IconButton } from './IconButton';

export type NavIconButtonProps = {
  icon: { name: string; size?: number; color?: string };
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
};
export const NavIconButton = (props: NavIconButtonProps) => (
  <IconButton
    onPress={props.onPress}
    name={props.icon.name}
    size={props.icon.size || 26}
    color={props.icon.color || colors.inkDarker}
    style={{ width: 45, height: '100%' }}
  />
);
