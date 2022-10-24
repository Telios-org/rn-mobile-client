import React, { ReactNode, useMemo } from 'react';
import { Pressable, Text, View, Image, ActivityIndicator } from 'react-native';
import {
  getFirstCharactersFromGivenName,
  stringToHslColor,
} from '../../util/avatar';
import { colors } from '../../util/colors';
import { Icon } from '../Icon';
import styles from './styles';

export type AvatarProps = {
  variant?: 'extraSmall' | 'small' | 'large';
  onPress?: () => void;
  style?: object;
  email?: string;
  displayName?: string;
  image?: string;
  children?: ReactNode;
  editable?: boolean;
  isLoading?: boolean;
};

const Avatar = ({
  onPress,
  variant = 'small',
  style,
  email,
  displayName,
  image,
  editable = false,
  isLoading = false,
}: AvatarProps) => {
  const backgroundColorByEmail = useMemo(
    () => stringToHslColor(email, 50, 50, editable ? 0.5 : 1),
    [email, editable],
  );

  const firstCharacters = useMemo(() => {
    const text = displayName ? displayName : email;
    return getFirstCharactersFromGivenName(text);
  }, [displayName, email]);

  return (
    <View
      style={[
        styles.container,
        styles[`${variant}Image`],
        { backgroundColor: backgroundColorByEmail },
        style,
      ]}>
      {editable && (
        <Pressable
          onPress={onPress}
          style={[styles.pressableContainer, styles[`${variant}Image`]]}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primaryBase} />
          ) : (
            <Icon
              name={'images-outline'}
              size={44}
              color={colors.primaryBase}
            />
          )}
        </Pressable>
      )}
      {image ? (
        <Image
          source={{ uri: image }}
          style={[styles[`${variant}Image`], editable && styles.editable]}
        />
      ) : (
        <Text style={[styles.displayName, styles[`${variant}DisplayName`]]}>
          {firstCharacters}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
