import React from 'react';
import {
  Text,
  Pressable,
  TextStyle,
  StyleProp,
  PressableProps,
  ViewStyle,
  View,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { Icon, IconProps } from '../../../Icon';
import { colors } from '../../../../util/colors';

interface TagProps extends PressableProps {
  label: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  iconProps?: IconProps;
  loading?: boolean;
}

export default ({
  label,
  textStyle,
  containerStyle,
  iconProps,
  loading,
  ...props
}: TagProps) => (
  <Pressable
    style={[styles.tagContainer, containerStyle]}
    disabled={loading}
    {...props}>
    {loading && (
      <ActivityIndicator
        color={colors.primaryBase}
        size="small"
        style={styles.loading}
      />
    )}
    <View style={styles.textContainer}>
      <Text style={[styles.tagText, textStyle]}>{label}</Text>
    </View>
    <View>
      <Icon
        name="close-outline"
        size={18}
        color={colors.inkBase}
        {...iconProps}
      />
    </View>
  </Pressable>
);
