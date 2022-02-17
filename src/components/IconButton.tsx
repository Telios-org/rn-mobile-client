import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
  <TouchableOpacity
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
  </TouchableOpacity>
);
