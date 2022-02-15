import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import RNVIcon from 'react-native-vector-icons/Ionicons';

export const Icon = (props: {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <RNVIcon
      name={props.name}
      size={props.size}
      color={props.color}
      style={props.style}
    />
  );
};
