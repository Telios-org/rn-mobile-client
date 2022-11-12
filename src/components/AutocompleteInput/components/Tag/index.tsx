import React from 'react';
import {
  Text,
  Pressable,
  TextStyle,
  StyleProp,
  PressableProps,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import { Icon } from '../../../Icon';
import { colors } from '../../../../util/colors';

interface TagProps extends PressableProps {
  label: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default ({ label, textStyle, containerStyle, ...props }: TagProps) => (
  <Pressable style={[styles.tagContainer, containerStyle]} {...props}>
    <Text style={[styles.tagText, textStyle]}>{label}</Text>
    <Icon name="close-outline" size={18} color={colors.inkBase} />
  </Pressable>
);
