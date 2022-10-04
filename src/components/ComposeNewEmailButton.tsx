import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../util/colors';
import { spacing } from '../util/spacing';
import { Icon } from './Icon';

export type ComposeNewEmailButtonProps = {
  onPress: () => void;
};

export const ComposeNewEmailButton = (props: ComposeNewEmailButtonProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
      }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          width: 54,
          height: 54,
          borderRadius: 26,
          backgroundColor: colors.primaryBase,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
          shadowOpacity: 0.2,
          shadowOffset: { width: 2, height: 2 },
        }}>
        <Icon
          name="add-outline"
          size={30}
          color={colors.white}
          style={{ marginRight: -4 }} // + icon is misaligned for some reason
        />
      </TouchableOpacity>
    </View>
  );
};
