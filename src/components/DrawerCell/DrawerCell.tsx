import { IconAccessory } from '../../util/types';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { colors } from '../../util/colors';
import { Icon } from '../Icon';
import { fonts, textStyles } from '../../util/fonts';
import React from 'react';
import styles from './styles';

export const DrawerCell = (props: {
  label: string;
  focused?: boolean;
  leftIcon?: IconAccessory;
  leftIconStyle?: StyleProp<ViewStyle>;
  rightIcon?: IconAccessory;
  rightText?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}) => {
  const textStyle = [
    fonts.regular.regular,
    props.titleStyle,
    {
      color: props.focused ? colors.inkDarkest : colors.inkLight,
      fontWeight: props.focused
        ? textStyles.weights.bold
        : textStyles.weights.regular,
    },
  ];

  return (
    <TouchableWithoutFeedback
      style={[styles.button, props.style]}
      onPress={props.onPress}>
      <View
        style={[
          styles.buttonContent,
          { backgroundColor: props.focused ? colors.skyLighter : undefined },
        ]}>
        {props.leftIcon && (
          <View style={[styles.leftIconContainer, props.leftIconStyle]}>
            <Icon
              name={props.leftIcon.name}
              size={props.leftIcon.size || 28}
              color={
                props.leftIcon.color || props.focused
                  ? colors.inkDarkest
                  : colors.inkLight
              }
            />
          </View>
        )}
        <View style={styles.buttonTitle}>
          <Text style={textStyle} ellipsizeMode="tail" numberOfLines={1}>
            {props.label}
          </Text>
        </View>
        {props.rightIcon ? (
          <View style={styles.rightIconContainer}>
            <Icon
              name={props.rightIcon.name}
              size={props.rightIcon.size || 24}
              color={props.rightIcon.color || colors.inkDarkest}
            />
          </View>
        ) : (
          props.rightText && (
            <Text style={[textStyle, styles.rightTextMargin]}>
              {props.rightText}
            </Text>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
