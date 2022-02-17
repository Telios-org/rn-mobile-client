import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import RNVIcon from 'react-native-vector-icons/Ionicons';

export type IconProps = {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};
export const Icon = (props: IconProps) => {
  return (
    <RNVIcon
      name={props.name}
      size={props.size}
      color={props.color}
      style={props.style}
    />
  );
};
