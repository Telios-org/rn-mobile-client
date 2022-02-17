import React from 'react';
import { View } from 'react-native';
import { colors } from '../util/colors';

export type AvatarProps = {
  touchable?: boolean;
  onPress?: () => void;
};
export const Avatar = (props: AvatarProps) => {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.skyLight,
        borderWidth: props.touchable ? 2 : 0,
        borderColor: colors.primaryBase,
      }}
    />
  );
};
