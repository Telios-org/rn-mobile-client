import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { NavIconButton } from '../../components/NavIconButton';

type BackArrowProps = {
  navigation: any;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default ({ navigation, size = 28, color, style }: BackArrowProps) => ({
  headerLeft: () => (
    <NavIconButton
      icon={{ name: 'chevron-back', size, color }}
      onPress={() => navigation.goBack()}
      style={style}
    />
  ),
});
