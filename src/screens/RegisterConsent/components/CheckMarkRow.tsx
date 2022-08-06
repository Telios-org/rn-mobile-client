import React, { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../../util/colors';
import { spacing } from '../../../util/spacing';
import { Icon } from '../../../components/Icon';

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rowContent: { flex: 1 },
});

export const CheckmarkRow = (props: {
  onPress: () => void;
  selected?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          styles.button,
          { backgroundColor: props.selected ? 'green' : colors.skyLight },
        ]}>
        <Icon name="checkmark-outline" size={25} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.rowContent}>{props.children}</View>
    </View>
  );
};
