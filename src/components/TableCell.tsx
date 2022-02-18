import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../util/colors';
import { fonts } from '../util/fonts';
import { spacing } from '../util/spacing';
import { IconAccessory } from '../util/types';
import { Icon } from './Icon';

export type TableCellProps = {
  label: string;
  caption?: string;
  iconRight?: IconAccessory;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
export const TableCell = (props: TableCellProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.sm,
        },
        props.style,
      ]}
      onPress={props.onPress}>
      <View style={{ flex: 1 }}>
        <Text style={fonts.regular.regular}>{props.label}</Text>
        {props.caption ? (
          <Text
            style={[
              fonts.small.medium,
              { color: colors.inkLighter, marginTop: spacing.xs },
            ]}>
            {props.caption}
          </Text>
        ) : null}
      </View>
      {props.iconRight && (
        <View
          style={{
            marginLeft: spacing.md,
            justifyContent: 'center',
          }}>
          <Icon
            name={props.iconRight.name}
            size={props.iconRight.size || 26}
            color={props.iconRight.color || colors.inkBase}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
