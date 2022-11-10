import React from 'react';
import {
  Text,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import styles from './styles';

interface SuggestionProps extends PressableProps {
  label: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default ({ label, textStyle, ...props }: SuggestionProps) => (
  <Pressable style={styles.container} {...props}>
    <Text style={[styles.label, textStyle]}>{label}</Text>
  </Pressable>
);
