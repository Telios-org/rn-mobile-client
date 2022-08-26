import React from 'react';
import { Text, TextProps } from 'react-native';
import { fonts, textStyles } from '../util/fonts';

export const NavTitle = (props: TextProps) => (
  <Text
    style={[fonts.large.bold, { color: textStyles.titleColor }]}
    numberOfLines={1}
    ellipsizeMode="tail">
    {props.children}
  </Text>
);
