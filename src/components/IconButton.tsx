import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../util/colors';
import { Icon } from './Icon';

export type IconButtonProps = {
  onPress: () => void;
  name: string;
  size?: number;
  color?: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};
export const IconButton = (props: IconButtonProps) => (
  <Pressable
    disabled={props.loading}
    onPress={props.onPress}
    style={props.style}>
    {props.loading ? (
      <ActivityIndicator />
    ) : (
      <Icon
        name={props.name}
        color={props.color || colors.inkBase}
        size={props.size || 24}
      />
    )}
  </Pressable>
);
